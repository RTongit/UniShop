async function getPendingVerificationRequests(req, res) {
  try {
    // Fetch pending student verification requests
    // Return them in the response
    return res.status(200).json({message : "The admin have hit the getPendingVerificationRequests api"})
  } 
  catch (error) {
    console.log(`Error in getPendingVerificationRequests controller : ${error.message}`);
    return res.status(500).json({message : "Internal Server error"})
  }
}

export {getPendingVerificationRequests};