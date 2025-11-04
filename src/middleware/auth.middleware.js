 import jwt from "jsonwebtoken";
 import User from "../models/User.js";
 
 
 const protectRoute = async(req,res,next) => {
    try{
        //get token
        const token = req.header("Authorizaton").replace("Bearer", "");
        if(!token) return res.status(401).json({ message: "No authentication token, access denied" });

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // FIND USER
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(401).json({ message: "Token is not valid" });

        // ako je sve proslo
        req.user = user;
        next();   // ako je uspjesna protekcija tj provjera tokena nastavi dalje s funkcijom za dodavanje knjige


    } catch (error){
        console.error("Authentication error:", error.message);
        res.status(401).json({ message: "Token is not valid "}); 

    }

};

export default protectRoute;