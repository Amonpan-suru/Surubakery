onload = windowload;

function windowload(){
    alert("Can use");
    loadstoredata();
}

const loadstoredata = (async () => {
	let response = await fetch("/loadstoredatainmsg");
	console.log("Load complete");
})