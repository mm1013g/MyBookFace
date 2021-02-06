<?php

	$inData = getRequestInfo();
    
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userID = $inData["userID"];

	$conn = new mysqli("localhost", "Jarvis", "jadipCOP4331", "contact_manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "INSERT INTO contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('$firstName', '$lastName', '$phone', '$email', '$userID')";
		$result = $conn->query($sql);

		if ($result == 1)
		{
			$sql = "SELECT FirstName, LastName, UserID, ID FROM contacts WHERE FirstName='$firstName' and LastName='$lastName' and UserID=$userID";
			$result = $conn->query($sql);

			$row = $result->fetch_assoc();
			
			$firstName = $row["FirstName"];
			$lastName = $row["LastName"];
			$id = $row["ID"];
			
			returnWithInfo($firstName, $lastName, $id);
		}
		else
		{
			returnWithError( "Issue with contact insert." );
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
		$retValue->contactID = 0;
		$retValue->error = $err;
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue->contactID = intval($id);
		$retValue->firstName = $firstName;
		$retValue->lastName = $lastName;
		$retValue->error = "";
		sendResultInfoAsJson( $retValue );
	}
	
?>