var urlBase = 'http://mybookface.rocks/api';
var extension = 'php';
var userID;

function doRegister()
{
    var firstName = document.getElementById("registerFirst").value;
    var lastName = document.getElementById("registerLast").value;
    var login = document.getElementById("registerUsername").value;
    var password = document.getElementById("registerPassword").value;

    document.getElementById("registerResult").innerHTML = "";

    // var jsonPayload = '{'"firstname" : ' + firstName + "login" : "' + login + '", "password" : "' + password + '"}';
    var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "login" : "' + login + '", "password" : "' + password + '"}';
    var url = urlBase + '/Register.' + extension;

    var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

        userId = jsonObject.id;
        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;
        // console.log(jsonObject.firstName);

		if( userId < 1 )
		{
			document.getElementById("registerResult").innerHTML = "Something went wrong";
			return;
        }
        else
        {
            document.getElementById("registerResult").innerHTML = "Successfully Registered " + firstName + " " + lastName;
        }

		// firstName = jsonObject.firstName;
		// lastName = jsonObject.lastName;

		// saveCookie();

		// window.location.href = "color.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;
	
	// Possibly use later, doesn't care about security for now
	// var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
	try
	{
		xhr.onreadystatechange = function() {
			var jsonObject = JSON.parse( xhr.responseText );

			userID = jsonObject.id;

			if( userId < 1 )
			{
				document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
				return;
			}

			firstName = jsonObject.firstName;
			lastName = jsonObject.lastName;

			saveCookie();

			// window.location.href = "color.html";
			document.getElementById("loginResult").innerHTML = "Successfully Logged In, Welcome back " + firstName + " " + lastName;
			window.location.href = "contact_page.html?userID=" + userID;
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
    //var newContact = document.getElementById("contactText").value;
    var firstName = document.getElementById("registerFirst").value;
    var lastName = document.getElementById("registerLast").value;
    var phone = document.getElementById("registerPhone").value;
    var email = document.getElementById("registerEmail").value;

	document.getElementById("contactAddResult").innerHTML = "";

    var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "phone" : "' + phone + '", "email" : "' + email + '", "userId" : ' + userId + '}';
	//var jsonPayload = '{"contact" : "' + newContact + '", "userId" : ' + userId + '}';
	var url = urlBase + '/AddContact.' + extension;

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

	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}
