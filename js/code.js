// var urlBase = 'http://mybookface.rocks/api';
var urlBase = 'http://localhost:5000/api';

const extension = 'php';
let userID;
let firstName;
let lastName;

function doRegister() {
	let firstName = document.getElementById("registerFirst").value;
	let lastName = document.getElementById("registerLast").value;
	let login = document.getElementById("registerUsername").value;
	let password = document.getElementById("registerPassword").value;

	// document.getElementById("registerResult").innerHTML = "";
    if (isEmpty(firstName))
    {
    //   document.getElementById("registerResult").innerHTML = "ERROR: First name conatins spaces or is empty";
		addAlert("First name contains spaces or is empty");
		return;
    }
    if (isEmpty(lastName))
    {
    //   document.getElementById("registerResult").innerHTML = "ERROR: Last Name conatins spaces or is empty";
		addAlert("Last name contains spaces or is empty");
    	return;
    }
    if (isEmpty(login))
    {
    	//document.getElementById("registerResult").innerHTML = "\nERROR: Username conatins spaces or is empty";
		addAlert("Username contains spaces or is empty");
      return;
    }
    if (isEmpty(password))
    {
    	//document.getElementById("registerResult").innerHTML = "ERROR: Password conatins spaces or is empty";
    	addAlert("Password contains spaces or is empty");
		return;
    }

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
					// document.getElementById("registerResult").innerHTML = jsonObject.error;
					addAlert(jsonObject.error);
					return;
				}
				else {
					// document.getElementById("registerResult").innerHTML = "Successfully Registered " + firstName + " " + lastName;
					addSuccess("Successfully Registered " + firstName + " " + lastName);
					window.location.href = "index.html";
				}
			}
		}
		xhr.send(jsonPayload);
	}
	catch (err) {
		// document.getElementById("loginResult").innerHTML = err.message;
		addAlert(err.message);
	}
}

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	const login = document.getElementById("loginUsername").value;
	const password = document.getElementById("loginPassword").value;

	const jsonPayload = JSON.stringify({
		'login': login,
		'password': password
	});


	const url = urlBase + '/Login.' + extension;
	const xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
  
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				const jsonObject = JSON.parse(xhr.responseText);

				userID = jsonObject.userID;

				if( userID < 1 )
				{
					addAlert("Invalid Username/Password combination");
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				// saveCookie();
				saveCookie();
				window.location.href = "contact_page.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		addAlert(err.message);
	}

}

function addAlert(message) {
	$('#alerts').empty();
	$('#alerts').append(
		'<div class="col-3 alert alert-danger fade show" role="alert">' + message + '</div>');
}

function addSuccess(message) {
	$('#alerts').empty();
	$('#alerts').append(
		'<div class="col-3 alert alert-success fade show" role="alert">' + message + '</div>');
}

function switchRegister() {
	$('loginContainer').toggle();
	$('registerContainer').toggle();
}

function saveCookie() {
	const minutes = 20;
	const date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userID + ";expires=" + date.toGMTString();
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
		else if (tokens[0] == "userID") {
			userID = parseInt(tokens[1].trim());
		}
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function isEmpty(p1)
{
  if (p1.length == 0)
    return true;
  for (var i = 0; i < p1.length; i++)
  {
    if (p1.charAt(i) == " ")
      return true;
  }
}