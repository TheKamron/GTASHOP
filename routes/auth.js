import { Router } from "express";
import User from "../models/User.js";
import Accounts from "../models/Account.js";
import Money from "../models/Money.js"
import Contact from "../models/Contact.js"
import bcrypt from "bcrypt"
import { generateJWTToken } from "../services/token.js"
import authMiddleware from "../middleware/auth.js"
import adminMiddleware from "../middleware/admin.js"
const router = Router()

router.get('/register', authMiddleware, (req, res) => {
    res.render("register", {
        title: "Ro'yxatdan O'tish | GTASHOP",
        registerError: req.flash('registerError')
    })
})

router.get('/login', authMiddleware, (req, res) => {
    res.render("login", {
        title: "Kirish | GTASHOP",
        loginError: req.flash('loginError')
    })
})

router.get('/admin-dashboard', adminMiddleware, async (req,res) => {
    const accounts = await Accounts.find().populate('user').lean()
    const money = await Money.find().populate('user').lean()
    const users = await User.find().lean()
    const messages = await Contact.find().lean()
    res.render("admin-dash", {
        layout: "admin",
        title: "Admin Dash",
        accounts: accounts.reverse(),
        money: money.reverse(),
        users: users,
        messages: messages
    })
})

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  res.redirect('/')
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    if(!username || !password) {
        req.flash('loginError', "Ism va Parolingizni Kiriting!")
        res.redirect("/login")
        return
    }

    const existUser = await User.findOne({userName: username})
    if(!existUser) { 
        req.flash('loginError', "Foydalanuvchi Topilmadi!")
        res.redirect('/login')
        return
    }
    const userPass = existUser.password
    const userPassEqual = await bcrypt.compare(password, userPass)
    if(!userPassEqual) { 
        req.flash('loginError', "Noto'g'ri Parol!")
        res.redirect('/login')
        return
    }


    const token = generateJWTToken(existUser._id)
    res.cookie("token", token, {httpOnly: true, secure: true})
    res.redirect('/login')
})

router.post('/register', async (req,res) => {
    const {username, email, password, confirmPassword} = req.body
    // validation fields
    if(!username || !email || !password || !confirmPassword) {
        req.flash("registerError", "Barcha maydonlarni to'ldiring!")
        res.redirect("/register")
        return
    }
    // password validation
    if(password !== confirmPassword) {
        req.flash('registerError', "Parollar Mos Kelmadi!")
        res.redirect('/register')
        return
    }
    // validation registered User
    const registeredUser = await User.findOne({userName: username})
    if(registeredUser) {
        req.flash("registerError", "Foydalanuvchi allaqachon mavjud!")
        res.redirect('/register')
        return
    }
    // validation registered Email
    const registeredEmail = await User.findOne({email})
    if(registeredEmail) {
        req.flash("registerError", "Pochta Manzili allaqachon mavjud!")
        res.redirect("/register")
        return
    }
    
    const hashedPass = await bcrypt.hash(password, 10)
    const userData = {
        userName: username,
        email: email,
        password: hashedPass,
        role: 'user',
        avatar: "user-avatar.jpg"
    }
    const user = await User.create(userData)
    const token = generateJWTToken(user._id)
    res.cookie("token", token, {httpOnly: true, secure: true})  
    res.redirect('/register')
})


export default router;