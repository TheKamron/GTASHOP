import jwt from "jsonwebtoken"
import User from "../models/User.js"

export default async function (req, res, next) {
    const token = req.cookies.token
    if(!token) {
        res.redirect('/')
        return
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decode.userId)
    const userRole = user.role
    if(userRole != "admin") {
        res.redirect("/")
        return
    } 

    next()
}