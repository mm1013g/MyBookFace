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
		$sql = "SELECT Login FROM users WHERE Login='" . $inData["login"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
            returnResultWithMessage(true, "User already exists");
		}
		else
		{
            returnResultWithMessage(false, "User does not yet exist");
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
		$retValue->result = false;
		$retValue->message = $err;
		sendResultInfoAsJson( $retValue );
	}
    
    function returnResultWithMessage($result, $message)
    {
		$retValue->result = $result;
		$retValue->message = $message;
        sendResultInfoAsJson($retValue);
    }
	
?>