<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

	$conn = new mysqli("localhost", "Jarvis", "jadipCOP4331", "contact_manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "INSERT INTO users (Login, Password, FirstName, LastName) VALUES ('$login', '$password', '$firstName', '$lastName')";
		$result = $conn->query($sql);
		// returnWithError($result);

		if ($result == 1)
		{
			$sql = "SELECT FirstName, LastName, ID FROM users WHERE Login='$login'";
			$result = $conn->query($sql);
			// returnWithError($result);
			// returnWithError(1);

			$row = $result->fetch_assoc();
			
			$firstName = $row["FirstName"];
			$lastName = $row["LastName"];
			$id = $row["ID"];
			
			returnWithInfo($firstName, $lastName, $id);
		}
		else
		{
			returnWithError( "Issue when registration." );
		}
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"error","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>