const urlParams = new URLSearchParams(window.location.search);
userID = urlParams.get('userID');
displayAll();

let contactDict = {};
let currentEditID;
let currentDeleteID;

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

	// document.getElementById("contactAddResult").innerHTML = "";

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
				// document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				addSuccess("Contact has been added");
				const jsonObject = JSON.parse(xhr.responseText);
				contact.contactID = jsonObject.contactID;
				placeContact(contact);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		// document.getElementById("contactAddResult").innerHTML = err.message;
		addAlert(err.message);
	}
}


function searchContacts() {
	const srch = document.getElementById("searchText").value;
	// document.getElementById("contactSearchResult").innerHTML = "";

	const jsonPayload = '{"search" : "' + srch + '","userID" : ' + userID + '}';
	const url = urlBase + '/Search.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				// document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				addSuccess("Contacts have been retrieved");
				const jsonObject = JSON.parse(xhr.responseText);
				const contactObjects = jsonObject.results;
				displayContacts(contactObjects);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		// document.getElementById("contactSearchResult").innerHTML = err.message;
		addAlert(err.message);
	}

}

function liveSearch() {
	const checked = $("#liveSearchCheck").is(':checked');
	if(checked)
	{
		searchContacts();
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
				// document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				addSuccess("Contacts have been retrieved");
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
	contactDict[contact.contactID] = contact;
	$('#contactsHolder').append(
		'<div class="col" id=' + contact.contactID + '>' +
                '<div class="card" style="">' +
                    '<div class="card-body">' +
                      '<h5 class="card-title" id="'+ contact.contactID +'Name">' + contact.firstName + " " + contact.lastName +'</h5>' +
                      '<h6 class="card-subtitle mb-2 text-muted" id="'+ contact.contactID +'Email">' + contact.email + '</h6>' +
                      '<h6 class="card-subtitle mb-2 text-muted" id="'+ contact.contactID +'Phone">' + contact.phone +'</h6>' +
                      '<button class="btn btn-warning" type="edit" onClick="openEditMenu('+ contact.contactID +')">Edit</button>' +
                      '<button class="btn btn-danger" type="delete" onClick="openDeleteMenu('+ contact.contactID +')">Delete</button>' +
                    '</div>' +
                '</div>' +
		'</div>'
	);
}

function displayContacts(arr) {
	clearContacts();
	arr.forEach(contact => {
		placeContact(contact);
	});
}

function clearContacts() {
	// const contactList = document.getElementById("contactList");
	// while (contactList.firstChild) {
	// 	contactList.removeChild(contactList.firstChild);
	// }
	$('#contactsHolder').empty();
}

function openEditMenu(id) {
	$("#editModal").modal("show");
	currentEditID = id;
	$("#editFirst").val(contactDict[id].firstName);
	$("#editLast").val(contactDict[id].lastName);
	$("#editEmail").val(contactDict[id].email);
	$("#editPhone").val(contactDict[id].phone);
}

function editContact() {
	const first = document.getElementById("editFirst").value;
	const last = document.getElementById("editLast").value;
	const email = document.getElementById("editEmail").value;
	const phone = document.getElementById("editPhone").value;

	let contact = {
		contactID: currentEditID,
		firstName: first,
		lastName: last,
		email: email,
		phone: phone
	};

	const jsonPayload = JSON.stringify({
		"contactID": currentEditID,
		"firstName": first,
		"lastName": last,
		"phone": phone,
		"email": email
	});

	const url = urlBase + '/EditContact.' + extension;

	const xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				addSuccess("Contact has been edited");
				const jsonObject = JSON.parse(xhr.responseText);

				$(`#${currentEditID}Name`).text(`${first} ${last}`);
				$(`#${currentEditID}Email`).text(`${email}`);
				$(`#${currentEditID}Phone`).text(`${phone}`);
				contactDict[currentEditID] = contact;
				hideEditMenu();
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		addAlert(err.message);
	}
}

function hideEditMenu() {
	$("#editModal").modal("hide");
}

function openDeleteMenu(id) {
	$("#deleteModal").modal("show");
	currentDeleteID = id
}

function deleteContact() {
	const jsonPayload = JSON.stringify({
		"contactID": currentDeleteID,
	});

	const url = urlBase + '/DeleteContact.' + extension;

	const xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				addSuccess("Contact has been deleted");
				const jsonObject = JSON.parse(xhr.responseText);
				$(`#${currentDeleteID}`).remove();
				hideDeleteMenu();
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		addAlert(err.message);
	}
}

function hideDeleteMenu() {
	$("#deleteModal").modal("hide");
}