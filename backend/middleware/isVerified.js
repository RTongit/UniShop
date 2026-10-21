export default function isVerified(req,res,next) {

    try {
        if (req.verificationStatus !== "verified") {
          return res.status(403).json({ message: "Your account must be verified to access this resource." });
        }
        return next();
    }

    catch(error) {
        console.error(`Error in isVerified middleware: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
