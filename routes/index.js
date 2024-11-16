import { Router } from "express";
import User from "../models/User.js"
import Account from "../models/Account.js"
import Money from "../models/Money.js"
import Contact from "../models/Contact.js";
import AddedAccount from "../models/AddAccount.js";
import AddedMoney from "../models/AddMoney.js"
import adminMiddleware from "../middleware/admin.js"
import userMiddleware from "../middleware/user.js"
import jwt from "jsonwebtoken"

const router = Router()

router.get('/', async (req, res) => {
    const accounts = await AddedAccount.find().lean()
    const money = await AddedMoney.find().lean()
    const users = await User.find().lean()    
    res.render("index", {
        title: "GTASHOP - Sizning O'yin Bozoringiz!",
        accounts: accounts.reverse(),
        money: money.reverse(),
        users: users,
    })
})

router.get('/user/:username', async (req, res) => {
    const username = req.params.username
    const userData = await User.findOne({userName: username}) // Foydalanuvchi Ma'lumotlari
    const userName = userData.userName
    // Account Info
    const data = await Account.find({user: userData._id})   // Foydalanuvchining (akkaunt) Ma'lumotlari
    const accountId = data.map(id => id._id)    // Akkaunt ma'lumotining ID sini topib olish
    const userProducts = await AddedAccount.find({_id: {$in: accountId}})   // Tasdiqlangan (akkaunt) ma'lumotlari
    
    // Money Info
    const dataMoney = await Money.find({user: userData._id})    // Foydalanuvchining (money) Ma'lumotlari
    const moneyId = dataMoney.map(id => id._id) // Money ma'lumotining ID sini topib olish
    const userMoney = await AddedMoney.find({_id: {$in: moneyId}})  // Tasdiqlangan (money) ma'lumotlari
    console.log(userMoney)
    res.render('user', {
        layout: '',
        title: `Foydalanuvchi ${userName} | GTASHOP`,
        userName,
        userProducts,
        userMoney,
        regData: userData.createdAt,
        userAvatar: userData.avatar,
        role: userData.role
    })
})

router.get('/profile', userMiddleware, async (req, res) => {
    const user = await User.findById(req.userId).lean()  // Foydlanauvchini Ma'lumotlari
    const products = await Account.find({user: req.userId}).lean() // Foydalanuvchi e'lonlari
    const productId = products.map(product => product._id);   
    const data = await AddedAccount.find({_id: {$in: productId}})
    res.render('profile', {
        layout: "",
        title: "Mening Profilim | GTASHOP",
        userName: user.userName,
        regData: user.createdAt,
        userAvatar: user.avatar,
        data,
        role: user.role,
    })
})

router.get('/account-details/:id', userMiddleware, async (req, res) => {
    const id = req.params.id
    const itemDetail = await AddedAccount.findById(id).lean()
    res.render("details", {
        layout: '',
        title: "Batafsil | GTASHOP",
        itemDetail: itemDetail
    })
})

router.get('/money-details/:id', userMiddleware, async (req, res) => {
    const id = req.params.id
    const moneyDetail = await AddedMoney.findById(id).lean()
    res.render("money-details", {
        layout: '',
        title: "Batafsil | GTASHOP",
        moneyDetail: moneyDetail
    })
})

router.get('/contact', (req, res) => {
    res.render('contact', {
        title: "Aloqa | GTASHOP",
    })
})

router.get("/reports", adminMiddleware, async (req, res) => {
    const reports = await Contact.find().lean()
    res.render("reports", {
        layout: 'admin',
        title: "Reports | Admin",
        reports: reports.reverse(),
    })
})

router.get('/terms', (req, res) => {
    res.render('terms', {
        title: "Sayt Qoidalari | GTASHOP"
    })
})

// POST
router.post("/contact", async (req, res) => {
    const {email, subject, message} = req.body
    const contactData = {
        email: email,
        subject: subject,
        message: message
    }
    await Contact.create(contactData)
    res.redirect("/contact")
})

router.post('/delete-report/:id', async (req, res) => {
    const id = req.params.id
    await Contact.findByIdAndDelete(id)
    res.redirect("/reports")
})


export default router;