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
        
        modal.style.display = "block";
        var container = document.getElementById("layerCart");
        var div = document.createElement("div");
        div.className = "box" + " container" + " center";
        var header = document.createElement("h1");

        header.innerHTML = "yoyo" 

        container.appendChild(div)
        div.appendChild(imgpost)
        div.appendChild(header)
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


