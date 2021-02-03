var urlBase = 'http://mybookface.rocks/api';
var extension = 'php';

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

	placeContact(contact);
}

function searchContacts()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	var contactList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","userID" : ' + 46 + '}';
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
	// editButton.onclick = "doEdit("+contact.id+");";
	editButton.setAttribute('onclick', "doEdit("+contact.id+")");
	
	contactDiv.appendChild(nameP);
	contactDiv.appendChild(emailP);
	contactDiv.appendChild(phoneP);
	contactDiv.appendChild(editButton);

	contactList.appendChild(contactDiv);
}

function displayContacts(arr)
{
	arr.forEach(contact =>{
		placeContact(contact);
	});
}

function doEdit(id)
{
	contactDiv = document.getElementById(id);
	// contactDiv.contentEditable = "true";
	contactDiv.setAttribute("contentEditable", "true");
	console.log(id);
}