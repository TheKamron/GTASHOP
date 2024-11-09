import { Router } from "express";
import User from "../models/User.js";
import Accounts from "../models/Account.js";
import Money from "../models/Money.js"
import Contact from "../models/Contact.js"
import bcrypt from "bcrypt"
import { generateJWTToken } from "../services/token.js"
import authMiddleware from "../middleware/auth.js"
import adminMiddleware from "../middleware/admin.js"
import userMiddleware from "../middleware/user.js"
const router = Router()


router.get('/register', authMiddleware, (req, res) => {
    res.render("register", {
        title: "Ro'yxatdan O'tish | GTASHOP",
        registerError: req.flash('registerError'),
        regSuccess: req.flash('regSuccess')
    })
})

router.get('/login', authMiddleware, (req, res) => {
    res.render("login", {
        title: "Kirish | GTASHOP",
        loginError: req.flash('loginError'),
        success: req.flash('success')
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

router.get('/profile/settings', userMiddleware,async (req, res) => {
    const user = await User.findById(req.userId).lean() 
    res.render('settings', {
        layout: "", 
        title: "Sozlamalar | GTASHOP",
        avatar: user.avatar, 
        userName: user.userName,
        settingsError: req.flash('settingsError')
    })
})

// POST

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



    if(existUser.role === "blocked") {
        req.flash('loginError', "Sizning Akkauntingiz Bloklangan!")
        res.redirect('/login')
        return
    }


    const token = generateJWTToken(existUser._id)
    res.cookie("token", token, {httpOnly: true, secure: true})
    req.flash('success', 'Xush kelibsiz, Muvaffaqiyatli tizimga kirdingiz!')
    res.redirect('/')
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
    req.flash('regSuccess', "Tabriklaymiz, Muvaffaqiyatli Ro'yxatdan O'tdingiz!")
    res.redirect('/')
})


router.post('/save-edits', async (req, res) => {
    const {oldPassword, newPassword, confirmPassword, userName} = req.body
    const user = await User.findOne({userName})
    if(!oldPassword || !newPassword || !confirmPassword) {
        req.flash( 'settingsError', "Barcha Maydonlarni To'ldiring!")
        res.redirect('/profile/settings')
        return
    }
    // Old Password Validation
    const checkPassword = await bcrypt.compare(oldPassword, user.password)
    if(!checkPassword) {
        req.flash('settingsError', 'Eski Parol Xato!')
        res.redirect('/profile/settings')
        return
    }

    if(newPassword !== confirmPassword) {
        req.flash('settingsError', 'Yangi Parol Mos Emas!')
        res.redirect('/profile/settings')
        return
    }

    if(newPassword.length !== 6) {
        req.flash('settingsError', "Yangi Parolingiz Juda Qisqa!")
        res.redirect("/profile/settings")
        return
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await User.findOneAndUpdate({userName}, {password: hashedPassword}, {new: true})
    
    res.redirect('/profile/settings')
})

export default router;