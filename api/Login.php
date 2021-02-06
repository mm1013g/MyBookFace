<?php
	$inData = getRequestInfo();
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "Jarvis", "jadipCOP4331", "contact_manager");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT ID,FirstName,LastName FROM users WHERE Login='" . $inData["login"] . "' and Password='" . $inData["password"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$firstName = $row["FirstName"];
			$lastName = $row["LastName"];
			$id = $row["ID"];
			
			returnWithInfo($firstName, $lastName, $id );
		}
		else
		{
			returnWithError( "No Records Found" );
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