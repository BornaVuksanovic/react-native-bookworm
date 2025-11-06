import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    // 🔹 Dohvati Authorization header
    const authHeader = req.header("Authorization");
  
    // 🔹 Provjeri postoji li i ima li ispravan format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    // 🔹 Izdvoji token (makni "Bearer " dio)
    const token = authHeader.split(" ")[1];

    // 🔹 Provjeri token pomoću tajnog ključa
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Nađi korisnika po decoded.userId (jer tako generiraš token)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // 🔹 Ako je sve u redu, spremi korisnika u req i nastavi
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default protectRoute;
