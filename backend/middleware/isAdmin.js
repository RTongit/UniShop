export default function isAdmin(req,res,next) {
    try {
        if (req.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        return next();
    }

    catch(error) {
        console.error(`Error in isAdmin middleware: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
