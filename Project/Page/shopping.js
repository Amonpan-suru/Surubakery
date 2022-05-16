window.onload = pageLoad;

function pageLoad(){
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", "bakery.json"); 
    loadstoredata();
    xhr.onload = function() { 
        var jsondata = JSON.parse(xhr.responseText);
        console.log(jsondata);
        showData(jsondata);
    }; 
    xhr.onerror = function() { alert("ERROR!"); }; 
    xhr.send();

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
})

function showData(data){
	console.log(Object.keys(data).length);
    var post = document.querySelectorAll("#layer")
    var keys = Object.keys(data);

    for(var i =0; i< keys.length;i++){
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
        field.setAttribute("type", "text");
        var addCart = document.createElement("BUTTON");
        // var shopIcon = document.createElement("i");
        var shopIcon = document.createElement("i");

        imgpost.src = "pic/" + data[keys[i]].pic
        header.innerHTML = data[keys[i]].name + "<br>" 
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
        
        // shopIcon.innerHTML = "Add to cart"
        
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

