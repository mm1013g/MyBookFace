<?php
	$inData = getRequestInfo();
	
	$searchResults = array();
	$searchCount = 0;

	$conn = new mysqli("localhost", "Jarvis", "jadipCOP4331", "contact_manager");

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT * FROM contacts WHERE (FirstName LIKE '%" . $inData["search"] . "%' or LastName LIKE '%" . $inData["search"] . "%') AND UserID=" . $inData["userID"];
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				$searchResults[$searchCount]->contactID = intval($row["ID"]);
				$searchResults[$searchCount]->firstName = $row["FirstName"];
				$searchResults[$searchCount]->lastName = $row["LastName"];
				$searchResults[$searchCount]->phone = $row["Phone"];
				$searchResults[$searchCount]->email = $row["Email"];
				$searchCount++;
			}
			returnWithInfo($searchResults, "");
		}
		else
		{
			returnWithError("No Records Found" );
			return;
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
		$retValue->results = [];
		$retValue->error = $err;
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults, $err)
	{
		$retValue->results = $searchResults;
		$retValue->error = $err;
		sendResultInfoAsJson( $retValue );
	}
	
?>