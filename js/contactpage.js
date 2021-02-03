var urlBase = 'http://mybookface.rocks/api';
var extension = 'php';

const urlParams = new URLSearchParams(window.location.search);
const USERID = urlParams.get('userID');

function addContact()
{
	var id = 0;
	var first = document.getElementById("addFirst").value;
	var last = document.getElementById("addLast").value;
	var email = document.getElementById("addEmail").value;
	var phone = document.getElementById("addPhone").value;

	var contact = {
		id : id,
		firstname: first,
		lastname: last,
		email: email,
		phone: phone
	};

	document.getElementById("contactAddResult").innerHTML = "";

    var jsonPayload = '{"firstName" : "' + first + '", "lastName" : "' + last + '", "phone" : "' + phone + '", "email" : "' + email + '", "userID" : ' + USERID + '}';
	var url = urlBase + '/CreateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				var jsonObject = JSON.parse( xhr.responseText );
				contact.id= jsonObject.id;
				placeContact(contact);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function searchContacts()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	var contactList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","userID" : ' + USERID + '}';
	var url = urlBase + '/Search.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				var contactObjects = jsonObject.results;
				displayContacts(contactObjects);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function displayAll(){

	var contactList = "";
	
	var jsonPayload = '{"userID" : ' + USERID + '}';
	var url = urlBase + '/GetContacts.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				var contactObjects = jsonObject.results;
				displayContacts(contactObjects);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function placeContact(contact)
{
	var contactList = document.getElementById("contactList");
	var contactDiv = document.createElement('div');
	contactDiv.classList.add("contactBox");
	contactDiv.id = contact.id;
	var nameP = document.createElement("p");
	nameP.appendChild(document.createTextNode(contact.firstname + " " + contact.lastname));
	var emailP = document.createElement("p");
	emailP.appendChild(document.createTextNode(contact.email));
	var phoneP = document.createElement("p");
	phoneP.appendChild(document.createTextNode(contact.phone));
	var editButton = document.createElement("button");
	editButton.appendChild(document.createTextNode("Edit"));
	editButton.classList.add("editButton");
	editButton.type = "button";
	editButton.setAttribute('onclick', "editContact("+contact.id+")");
	var deleteButton = document.createElement("button");
	deleteButton.appendChild(document.createTextNode("Delete"));
	deleteButton.classList.add("deleteButton");
	deleteButton.type = "button";
	deleteButton.setAttribute('onclick', "deleteContact("+contact.id+")");

	contactDiv.appendChild(nameP);
	contactDiv.appendChild(emailP);
	contactDiv.appendChild(phoneP);
	contactDiv.appendChild(editButton);
	contactDiv.appendChild(deleteButton);

	contactList.appendChild(contactDiv);
}

function displayContacts(arr){
	clearContacts();
	arr.forEach(contact =>{
		placeContact(contact);
	});
}

function clearContacts(){
	var contactList = document.getElementById("contactList");
	while(contactList.firstChild){
		contactList.removeChild(contactList.firstChild);
	}
}

function editContact(id)
{
	var contactDiv = document.getElementById(id);
	// contactDiv.contentEditable = "true";
	contactDiv.setAttribute("contentEditable", "true");
	console.log(id);
}

function deleteContact(id){
	console.log("deleting contact id: " + id);
	document.getElementById(id).remove();
}