<?php

	$inData = getRequestInfo();
	
    $ID = $inData["contactID"];

	$conn = new mysqli("localhost", "Jarvis", "jadipCOP4331", "contact_manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $sql = "DELETE FROM contacts WHERE ID=$ID";
		$result = $conn->query($sql);

        if ($result == 1)
        {
			returnResultWithMessage(true, "Successfully deleted contact.");
		}
		else
		{
			returnResultWithMessage(false, "No contact to be deleted.");
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