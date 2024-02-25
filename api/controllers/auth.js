import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import  Jwt  from "jsonwebtoken";

export const register = (req, res)=>{
 
    // check user if exists
    
    const q = 'SELECT * FROM users WHERE username = ?'

    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err)
        if(data.length) return res.status(409).json("user already exists!");
        //create a new user
            // Hash the password
            const salt =bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt)
    
            const q = "INSERT INTO users (username,email, password, name) VALUE (?)"

        const values = [req.body.username,req.body.email,hashedPassword, req.body.name]
            db.query(q, [values], (err,data)=>{
                if(err) return res.status(500).json(err)
        return res.status(200).json("User has been created.")
            });
    });
   
      

};

export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found");

        const userData = data[0];

        if (!userData.password) {
            return res.status(400).json("Password not found for the user");
        }

        const checkPassword = bcrypt.compareSync(req.body.password, userData.password);
        if (!checkPassword) return res.status(400).json("Wrong password or username!");

        const token = Jwt.sign({ id: userData.id }, "secretkey");

        const { password, ...other } = userData;

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(other);
    });
};


export const logout = (req,res)=>{
   res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("User has been logged out.")


}