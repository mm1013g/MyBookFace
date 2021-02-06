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
        $sql = "SELECT * FROM contacts WHERE ID=$ID";
		$result = $conn->query($sql);
        $contact = $result->fetch_assoc();
        if ($result == 1)
        {
            $firstName = isset($inData["firstName"]) ? $inData["firstName"] : $contact["FirstName"];
            $lastName = isset($inData["lastName"]) ? $inData["lastName"] : $contact["LastName"];
            $phone = isset($inData["phone"]) ? $inData["phone"] : $contact["Phone"];
            $email = isset($inData["email"]) ? $inData["email"] : $contact["Email"];

            $sql = "UPDATE contacts SET FirstName='" . $firstName . "', LastName='" . $lastName . "', Phone='" . $phone . "', Email='" . $email . "' WHERE ID=$ID";
            $result = $conn->query($sql);
            if ($result == 1)
            {
                returnResultWithMessage(true, "Successfully edited contact.");
            }
            else
            {
                returnResultWithMessage(false, "Issue with contact edit.");
            }
		}
		else
		{
			returnResultWithMessage(false, "Could not find contact to edit.");
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