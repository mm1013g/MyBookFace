<?php

	$inData = getRequestInfo();
	
	$id = 0;

	$conn = new mysqli("localhost", "Jarvis", "jadipCOP4331", "contact_manager");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// $sql = "SELECT ID,FirstName,LastName FROM Users where Login='" . $inData["login"] . "' and Password='" . $inData["password"] . "'";
		$sql = "SELECT Login FROM users WHERE Login='" . $inData["login"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$retValue = '{"result" : true}';
            sendResultInfoAsJson($retValue);
		}
		else
		{
            $retValue = '{"result" : false}';
            sendResultInfoAsJson($retValue);
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>