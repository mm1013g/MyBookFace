<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
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
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '
				{
					"id" 		:  ' . $row["ID"] 			. ',
					"firstname" : "' . $row["FirstName"]	. '",
					"lastname" 	: "' . $row["LastName"]		. '",
					"phone"		: "' . $row["Phone"] 		. '",
					"email"		: "' . $row["Email"] 		. '"
				}';

			}
			returnWithInfo( $searchResults, "");
		}
		else
		{
			returnWithInfo("", "No Records Found" );
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
	
	function returnWithInfo( $searchResults, $err)
	{
		$retValue = '{"results":[' . $searchResults . '],"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>