const urlParams = new URLSearchParams(window.location.search);
userID = urlParams.get('userID');
displayAll();

function addContact() {
	const first = document.getElementById("addFirst").value;
	const last = document.getElementById("addLast").value;
	const email = document.getElementById("addEmail").value;
	const phone = document.getElementById("addPhone").value;

	let contact = {
		contactID: 0,
		firstName: first,
		lastName: last,
		email: email,
		phone: phone
	};

	document.getElementById("contactAddResult").innerHTML = "";

	const jsonPayload = JSON.stringify({
		"firstName": first,
		"lastName": last,
		"phone": phone,
		"email": email,
		"userID": userID
	});
	const url = urlBase + '/CreateContact.' + extension;

	const xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				const jsonObject = JSON.parse(xhr.responseText);
				contact.contactID = jsonObject.contactID;
				placeContact(contact);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function searchContacts() {
	const srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	const jsonPayload = '{"search" : "' + srch + '","userID" : ' + userID + '}';
	const url = urlBase + '/Search.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				const jsonObject = JSON.parse(xhr.responseText);
				const contactObjects = jsonObject.results;
				displayContacts(contactObjects);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

function displayAll() {
	const jsonPayload = '{"userID" : ' + userID + '}';
	const url = urlBase + '/GetContacts.' + extension;

	const xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				const jsonObject = JSON.parse(xhr.responseText);
				const contactObjects = jsonObject.results;
				displayContacts(contactObjects);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

function placeContact(contact) {
	const contactList = document.getElementById("contactList");
	const contactDiv = document.createElement('div');
	contactDiv.classList.add("contactBox");
	contactDiv.id = contact.contactID;
	const nameP = document.createElement("p");
	nameP.appendChild(document.createTextNode(contact.firstName + " " + contact.lastName));
	const emailP = document.createElement("p");
	emailP.appendChild(document.createTextNode(contact.email));
	const phoneP = document.createElement("p");
	phoneP.appendChild(document.createTextNode(contact.phone));
	const editButton = document.createElement("button");
	editButton.appendChild(document.createTextNode("Edit"));
	editButton.classList.add("editButton");
	editButton.type = "button";
	editButton.setAttribute('onclick', "editContact(" + contact.id + ")");
	const deleteButton = document.createElement("button");
	deleteButton.appendChild(document.createTextNode("Delete"));
	deleteButton.classList.add("deleteButton");
	deleteButton.type = "button";
	deleteButton.setAttribute('onclick', "deleteContact(" + contact.id + ")");

	contactDiv.appendChild(nameP);
	contactDiv.appendChild(emailP);
	contactDiv.appendChild(phoneP);
	contactDiv.appendChild(editButton);
	contactDiv.appendChild(deleteButton);

	contactList.appendChild(contactDiv);
}

function displayContacts(arr) {
	clearContacts();
	arr.forEach(contact => {
		placeContact(contact);
	});
}

function clearContacts() {
	const contactList = document.getElementById("contactList");
	while (contactList.firstChild) {
		contactList.removeChild(contactList.firstChild);
	}
}

function editContact(id) {
	const contactDiv = document.getElementById(id);
	// contactDiv.contentEditable = "true";
	contactDiv.setAttribute("contentEditable", "true");
	console.log(id);
}

function deleteContact(id) {
	console.log("deleting contact id: " + id);
	document.getElementById(id).remove();
}