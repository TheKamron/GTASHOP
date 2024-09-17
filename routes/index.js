import { Router } from "express";
import User from "../models/User.js"
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

// router.get('/terms-conditions', (req, res) => {
//     res.render("terms-conditions", {
//         title: "Shartlar va Qoidalar | GTASHOP"
//     })
// })

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