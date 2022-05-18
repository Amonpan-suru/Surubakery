window.onload = pageLoad;

async function pageLoad (){

    await loadstoredata();
    let response = await fetch("/bakery", {
        method: "GET",
        cache: "no-cache",
    });

    const json = await response.json()
    console.log(json)
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
        field.value ="0"
        field.setAttribute("type", "text");
        var addCart = document.createElement("BUTTON");
        // var shopIcon = document.createElement("i");
        var shopIcon = document.createElement("i");

        imgpost.src = "pic/" + data[keys[i]].img_item
        header.innerHTML = data[keys[i]].item_name + "<br>" 
        description.innerHTML = data[keys[i]].description + "<br>" + "stock : " + data[keys[i]].stock;
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
    var numberofitem = 0;
    addCart.onclick = function(){      
        numberofitem = document.getElementById(field.id).value;
	    addcartto(addCart,numberofitem);
        document.getElementById(field.id).value = "";
        numberofitem = 0;
	}

    minus.onclick = function(){
        if(numberofitem > 0 )
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
        showCart()
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

function edittocart(div, minus, plus, field, close) {
    var numberofitem = 0;
    numberofitem = document.getElementById(field.id).value;
    numberofitem = Number(numberofitem)
    
     minus.onclick = function(){
        if(numberofitem > 0 )
            numberofitem -= 1;      
         document.getElementById(field.id).value = numberofitem;
         console.log(numberofitem)
         console.log(field.id)
    }

    plus.onclick = function(){
        if(numberofitem < 99)
            numberofitem += 1;
        document.getElementById(field.id).value = numberofitem;
        console.log(numberofitem)
        console.log(field.id)
    }

    close.onclick = function(){
        document.getElementById(div.id).innerHTML = "";
        document.getElementById(div.id).className = "";
    }
}

function showCart() {
    
    var container = document.getElementById("layerCart");
    container.innerHTML = ""
        
    for (var i = 0; i < 3; i++) {
        var modal = document.getElementById("myModal");
            
        
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
        var pice = document.createElement("p");
        var price = document.createElement("p");

        var minus = document.createElement("BUTTON");
        var plus = document.createElement("BUTTON");
        var field = document.createElement("INPUT");
        field.value = "0"
        field.setAttribute("type", "text");
        

        imgpost.src = "pic/brownie.png"
        header.innerHTML = "brownie"
        price.innerHTML = "Price : " + "20"
        plus.className = "button1"
        plus.id = "plusItem" + i;
        minus.className = "button1"
        field.id = "fieldItem" + i;
        minus.id = "minusItem" + i;
        minus.innerHTML = "-";
        plus.innerHTML = "+";

        container.appendChild(div)
        div.appendChild(divGrid)
        divGrid.appendChild(divImg)
        divImg.appendChild(imgpost)
        divGrid.appendChild(divText)
        divText.appendChild(close)
        divText.appendChild(header)
        divText.appendChild(pice)
        divText.appendChild(price)
        divText.appendChild(minus)
        divText.appendChild(field)
        divText.appendChild(plus)
        

        edittocart(div, minus, plus, field, close)
    }
}

