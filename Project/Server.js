const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const { resolve } = require('path');

app.use(express.static('Page'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'result/img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// const imageFilter = (req, file, cb) => {
//     // Accept images only
//     if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//         req.fileValidationError = 'Only image files are allowed!';
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Karameet110TH",
    database: "project"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/regisDB', async (req,res) => {

    if(req.body.password != req.body.confirmpassword){
        return res.redirect('register.html');
    }

    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100),img VARCHAR(100))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (username, email, password,img) VALUES ("${req.body.username}", "${req.body.email}", "${req.body.password}",'avatar.png')`;
    result = await queryDB(sql);


    console.log("New record created successfullyone");
    return res.redirect('login.html');
    
})

let tablename = "userInfo";
//ทำให้สมบูรณ์
app.post('/checkLogin',async (req,res) => {
    // ถ้าเช็คแล้ว username และ password ถูกต้อง
    // return res.redirect('feed.html');
    // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
    // return res.redirect('login.html?error=1')
    let sql_loing = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100),img VARCHAR(100))";
    let result_loing = await queryDB(sql);
    let sql = `SELECT id, username, password, img FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    // console.log(result);
    const username = req.body.username;
    const password = req.body.password;

    var Obj = Object.keys(result);
    var isCorrect = false;
    for(var i = 0 ; i < Obj.length ; i++){
        var temp = result[Obj[i]];
        var dataUsername = temp.username;
        var dataPassword = temp.password;
        if(dataUsername == username && dataPassword == password ){
            isCorrect = true;
            res.cookie('username', username);
            res.cookie('img', temp.img);
        }
    }
    if(isCorrect = true){
        console.log("Correct");
        return res.redirect('shop.html');
        // return res.redirect('register.html');
    }
    else{
        console.log("Wrong");
        return res.redirect('index.html?error=1');
    }
})

app.get('/loadstoredatainmsg', async (req, res) => {

    let sql_storedata = "CREATE TABLE IF NOT EXISTS storedata (store_id INT AUTO_INCREMENT PRIMARY KEY, item_name VARCHAR(255), price INT, stock INT,img_item VARCHAR(255))"
    let result_storedata = await queryDB(sql_storedata);
    result_storedata = await queryDB(sql_storedata);
    // sql_storedata = `SELECT item_name FROM ${tablename_storedata}`;
    let sedata = `SELECT  store_id FROM storedata`;
    sedata = await queryDB(sedata);

    if(sedata == ''){
        readjson().then(Updatestore).then((out) => out);
        console.log("555");
    }
    console.log("Getcomplete")
    return res.end;
});

const readjson = () => {
    return new Promise((resolve,reject) => {
        fs.readFile('page/bakery.json','utf8',(err,data) => {
          if(err)
            reject(err);
          else{
            resolve(data);
          }
        });
    })
}

const Updatestore =  (data) =>{
    return new Promise((resolve,reject) => {
          var storejson = JSON.parse(data);
          var keys = Object.keys(storejson);

          let sql_storedata =  `SELECT item_name, price ,stock ,img_item FROM storedata`;
          sql_storedata =  queryDB(sql_storedata);
          for(i = 0;i < keys.length; i ++ ){
              
            let sql_storedata =  `INSERT INTO storedata (item_name, price, stock,img_item) VALUES ("${storejson[keys[i]].name}", "${storejson[keys[i]].price}","${storejson[keys[i]].stock}","${storejson[keys[i]].pic}")`; 
            sql_storedata =  queryDB(sql_storedata);          
        }
        resolve(sql_storedata);
    })
}

app.post('/addtocart', async (req, res) => {
    const data = req.body;
    const user = req.cookies.username;
    let conid = data.Itemid;
    conid = Array.from(conid)

    var id;
    if(conid[6]!=null)
        id = conid[5] + conid[6];
    else id = conid[5];
    id = Number(id);
    id = id+1;

    let sql_Incart = `CREATE TABLE IF NOT EXISTS ${user}_Incart (item int AUTO_INCREMENT PRIMARY KEY,id int, NameItem VARCHAR(255),price int,Number_of_Item INT,IMG_Item VARCHAR(255))`
    sql_Incart = queryDB(sql_Incart);
    let sql_storedata = `SELECT store_id ,item_name, price ,stock ,img_item FROM storedata WHERE store_id = '${id}'`
    sql_storedata = await queryDB(sql_storedata);

    let result = Object.assign({},sql_storedata);
    let obj = Object.keys(result);

    console.log(data.NumItem);
    sql_Incart = `SELECT id FROM ${user}_Incart`
    sql_Incart = await queryDB(sql_Incart);

    if(sql_Incart == ""){
        let sql_addincart = `SELECT id , NameItem, price, Number_of_Item, IMG_item FROM ${user}_Incart`
        sql_addincart = await queryDB(sql_addincart);
        sql_addincart = `INSERT INTO ${user}_Incart (id , NameItem, price, Number_of_Item, IMG_item) VALUES ("${id}","${result[obj[0]].item_name}","${result[obj[0]].price}","${data.NumItem}","${result[obj[0]].img_item}")`;
        sql_addincart = await queryDB(sql_addincart);
    }
    else{

        let sql_check = `SELECT id FROM ${user}_Incart WHERE id = ${id}`
        sql_check = await queryDB(sql_check);
        if(sql_check != ""){

            let sql_updatecart = `UPDATE ${user}_Incart SET Number_of_Item = '${data.NumItem}' WHERE id ='${id}'`;
            sql_updatecart = await queryDB(sql_updatecart);
        }
        else{
            let sql_updatecart = `INSERT INTO ${user}_Incart (id , NameItem, price, Number_of_Item, IMG_item) VALUES ("${id}","${result[obj[0]].item_name}","${result[obj[0]].price}","${data.NumItem}","${result[obj[0]].img_item}")`;
            sql_updatecart = await queryDB(sql_updatecart);
        }
    }      
});


app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/login.html`);
});