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
		// Check if login already exists:
		$sql = "SELECT * FROM users WHERE Login='" . $login . "'";
		$result = $conn->query($sql);
		if($result->num_rows > 0)
		{
			returnWithError("User already exists");
			$conn->close();
			return;
		}

		$sql = "INSERT INTO users (Login, Password, FirstName, LastName) VALUES ('$login', '$password', '$firstName', '$lastName')";
		$result = $conn->query($sql);

		if ($result == 1)
		{
			$sql = "SELECT FirstName, LastName, ID FROM users WHERE Login='$login'";
			$result = $conn->query($sql);

			$row = $result->fetch_assoc();
			
			$firstName = $row["FirstName"];
			$lastName = $row["LastName"];
			$id = $row["ID"];
			
			returnWithInfo($firstName, $lastName, $id);
		}
		else
		{
			returnWithError( "Issue with registration." );
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
		echo json_encode($obj);
	}
	
	function returnWithError( $err )
	{
		$retValue->userID = 0;
		$retValue->error = $err;
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue->userID = intval($id);
		$retValue->firstName = $firstName;
		$retValue->lastName = $lastName;
		$retValue->error = "";
		sendResultInfoAsJson( $retValue );
	}
?>