// var urlBase = 'http://mybookface.rocks/api';
const urlBase = 'http://localhost:5000/api';
const extension = 'php';
let userID;
let firstName;
let lastName;

function doRegister() {
	let firstName = document.getElementById("registerFirst").value;
	let lastName = document.getElementById("registerLast").value;
	let login = document.getElementById("registerUsername").value;
	let password = document.getElementById("registerPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	// const jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "login" : "' + login + '", "password" : "' + password + '"}';
	const jsonPayload = JSON.stringify({
		"firstName": firstName,
		"lastName": lastName,
		"login": login,
		"password": password
	});

	const url = urlBase + '/Register.' + extension;

	const xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				const jsonObject = JSON.parse(xhr.responseText);

				userID = jsonObject.userID;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				if (userID < 1) {
					document.getElementById("registerResult").innerHTML = jsonObject.error;
					return;
				}
				else {
					document.getElementById("registerResult").innerHTML = "Successfully Registered " + firstName + " " + lastName;
				}
			}
		}
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	const login = document.getElementById("loginUsername").value;
	const password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	const jsonPayload = JSON.stringify({
		'login': login,
		'password': password
	});


	const url = urlBase + '/Login.' + extension;
	const xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	// xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
	xhr.setRequestHeader("Content-type", "application/json;");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				const jsonObject = JSON.parse(xhr.responseText);

				userID = jsonObject.userID;

				if (userID < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				document.getElementById("loginResult").innerHTML = "Successfully Logged In, Welcome back " + firstName + " " + lastName;
				window.location.href = "contact_page.html?userID=" + userID;
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie() {
	const minutes = 20;
	const date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for (let i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}