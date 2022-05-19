window.onload = pageLoad;

async function pageLoad (){

    await loadstoredata();
    let response = await fetch("/bakery", {
        method: "GET",
        cache: "no-cache",
    });

    const json = await response.json()
    console.log(json)

    
    var user = document.getElementById("user");
    user.innerHTML = getCookie('username')

    showImg('img/'+getCookie('img'));
    showData(json);
    modalCart();
}

function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

const loadstoredata = (async () => {
    let response = await fetch("/loadstoredatainmsg");
    return true
})

function showImg(filename) {
    if (filename !== "") {
        var showpic = document.getElementById('showProfileIcon');
        showpic.src = filename;
    }
}

function showData(data){
	console.log(Object.keys(data).length);
    var post = document.querySelectorAll("#layer")
    var keys = Object.keys(data);

    for (var i = 0; i < keys.length; i++){
        console.log(data[keys[i]])
        var container = document.getElementById("layer");
        var div = document.createElement("div");
        div.className = "box" + " container" + " center";
        var header = document.createElement("h1");
        var price = document.createElement("h2");
        var description = document.createElement("p");
        var imgpost = document.createElement("img");
        var minus = document.createElement("BUTTON");
        var plus = document.createElement("BUTTON");
        var field = document.createElement("INPUT");
        field.value ="1"
        field.setAttribute("type", "number");
        field.setAttribute("min", 1)
        field.setAttribute("max", 99)

        var addCart = document.createElement("BUTTON");
        // var shopIcon = document.createElement("i");
        var shopIcon = document.createElement("i");

        imgpost.src = "pic/" + data[keys[i]].img_item
        header.innerHTML = data[keys[i]].item_name + "<br>" 
        description.innerHTML = data[keys[i]].description + "<br>"/* + "stock : " + data[keys[i]].stock*/;
        price.innerHTML = "price : " + data[keys[i]].price + "<br>" 
        plus.className = "button1"
        plus.id = "plusItem_" + i;
        minus.className = "button1"
        field.id = "fieldItem_" + i;
        minus.id = "minusItem_" + i;
        minus.innerHTML = "-";
        plus.innerHTML = "+";
        addCart.className = "addToCart"
        shopIcon.src="pic/shopIcon.png"
        shopIcon.className = "fa-solid fa-cart-plus"
        addCart.id = "Item_" + i;
        
        container.appendChild(div)
        div.appendChild(imgpost)
        div.appendChild(header)
        div.appendChild(description)
        div.appendChild(price)
        div.appendChild(minus)
        div.appendChild(field)
        div.appendChild(plus)
        div.appendChild(addCart)
        addCart.appendChild(shopIcon)
        addCart.innerHTML = "<i " + "class" + "= \" fas fa-cart-plus \" > </i>" + " Add to cart"
        addtocart(addCart,minus,plus,field);
    }
}

function addtocart(addCart,minus,plus,field){
    var numberofitem = 1;
    addCart.onclick = function () {  
        numberofitem = document.getElementById(field.id).value;
        if (numberofitem > 0) {
            addcartto(addCart,numberofitem);
            document.getElementById(field.id).value = 1;
            numberofitem = 1;
        }
	}

    minus.onclick = function(){
        if(numberofitem > 1 )
            numberofitem -= 1;      
        document.getElementById(field.id).value = numberofitem;
    }

    plus.onclick = function(){
        if(numberofitem < 99)
            numberofitem += 1;
        document.getElementById(field.id).value = numberofitem;
    console.log(numberofitem)
    }
}

const addcartto = (async (addCart,numberofitem) => {
	let response = await fetch("/addtocart", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Itemid:addCart.id,
            NumItem:numberofitem})
        });
})


function modalCart() {
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    btn.onclick = function () {
        var container = document.getElementById("layerCart");
        container.innerHTML = ""
        modal.style.display = "block";
        loadcartdata(); 
    }



// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
    }
    }
}

function edittocart(div, minus, plus, field, close, total, price) {
    var numberofitem = 0;
    numberofitem = document.getElementById(field.id).value;
    numberofitem = Number(numberofitem)
    
     minus.onclick = function(){
        if(numberofitem > 0 )
            numberofitem -= 1;      
        document.getElementById(field.id).value = numberofitem;
        document.getElementById(total.id).innerHTML = "Total : " + (price * field.value) + " Bath";
         //  console.log(numberofitem)
        //  console.log(field.id)
    }

    plus.onclick = function(){
        if(numberofitem < 99)
            numberofitem += 1;
        document.getElementById(field.id).value = numberofitem;
        document.getElementById(total.id).innerHTML = "Total : " + (price * field.value) + " Bath";
        // console.log(numberofitem)
        // console.log(field.id)
    }

    close.onclick = function(){
        let id_delete = close.id;
        deletecartdata(id_delete);
        document.getElementById(div.id).innerHTML = "";
        document.getElementById(div.id).className = "";
        
    }
}

async function loadcartdata(){

    console.log("Loaddata")
	let response = await fetch("/loadcartdatafromsql");
    console.log("loadcomplete");
    let contant = await response.json();
    let cart = await showCart(JSON.parse(contant));

}

const deletecartdata = (async (id_delete) => {
	let response = await fetch("/deletecartdatafromsql", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id:id_delete
            })
        });
})


function showCart(cart) {
    // console.log("showcart")
    
    let grandTotal = 0;
    let keys = Object.keys(cart);
    // console.log(cart[keys[0]]);
    // let img_show = cart[keys[i]].img_item;
    // alert(img_show);

    var container = document.getElementById("layerCart");
    container.innerHTML = ""
    console.log("showcart1")
    for (var i = 0; i < keys.length ; i++) {
        var modal = document.getElementById("myModal");
        // console.log(cart[keys[i]].id);
        // console.log(cart[keys[i]].IMG_item);
        // console.log(cart[keys[i]]);
        
        var div = document.createElement("div");
        div.className = "boxCart"
        div.id = "cart" + i
        var close = document.createElement("span");
        close.className = "close"
        close.innerHTML = "&times;"
        var divGrid = document.createElement("div");
        divGrid.className = "containerCart"
        var divImg = document.createElement("div");
        divImg.className = "imgcontainerCart"

        var divText = document.createElement("div");
        divText.className = "textcontainerCart"

        var imgpost = document.createElement("img");
        imgpost.className = "imgCart"
        var header = document.createElement("h2");
        var price = document.createElement("p");
        var total = document.createElement("p");
        var minus = document.createElement("BUTTON");
        var plus = document.createElement("BUTTON");
        var field = document.createElement("INPUT");
        

        field.value = cart[keys[i]].Number_of_Item;    
        field.setAttribute("type", "number");
        field.setAttribute("min", 1)
        field.setAttribute("max", 99)
        var divTotal = document.createElement("div");
        divTotal.className = "right" + " total"
        total.className = "totalText"
        

        

        imgpost.src = "pic/" + (cart[keys[i]].IMG_item);
        header.innerHTML = cart[keys[i]].NameItem;
        const eachPrice = cart[keys[i]].price;
        price.innerHTML = "Price : " + eachPrice;
        total.innerHTML = "Total : " + eachPrice * field.value + " Bath";
        plus.className = "button2"
        plus.id = "plusItem" + i;
        minus.className = "button2"
        field.id = "fieldItem" + i;
        minus.id = "minusItem" + i;
        total.id = "total" + i;
        minus.innerHTML = "-";
        plus.innerHTML = "+";
        close.id = cart[keys[i]].NameItem;

        container.appendChild(div)
        div.appendChild(divGrid)
        divGrid.appendChild(divImg)
        divImg.appendChild(imgpost)
        divGrid.appendChild(divText)
        divText.appendChild(close)
        divText.appendChild(header)
        divText.appendChild(price)
        divText.appendChild(minus)
        divText.appendChild(field)
        divText.appendChild(plus)
        divText.appendChild(divTotal)
        divTotal.appendChild(total)

        grandTotal += field.value * eachPrice;
        edittocart(div, minus, plus, field, close, total, eachPrice)
    }

    if (keys.length != 0) {
        var checkout = document.createElement("BUTTON");
        var allTotal = document.createElement("p");

        checkout.className = "addToCart"
        checkout.innerHTML = "Check Out"
        allTotal.className = "totalText"
        allTotal.id = "allTotal"
        allTotal.innerHTML = grandTotal

        container.appendChild(checkout);

        checkout.onclick = function () {
            document.getElementById("layerCart").innerHTML = "";
            
            for (var i = 0; i < keys.length; i++) {
                deletecartdata(cart[keys[i]].NameItem)
            }
        }
    }
    

}


