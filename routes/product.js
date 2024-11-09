import { Router } from "express";
import Account from "../models/Account.js";
import Money from "../models/Money.js";
import AddedAccount from "../models/AddAccount.js"
import AddedMoney from "../models/AddMoney.js"
import userMiddleware from "../middleware/user.js"
import adminMiddleware from "../middleware/admin.js"
const router = Router()

router.get('/sell-account', (req, res) => {
    res.render('sell-account', {
        title: "Akkauntingizni Soting | GTASHOP",
        accountError: req.flash("accountError"),
        sellSuccess: req.flash('sellSuccess')
    })
    if(!req.cookies.token) {
        res.redirect("/login")
        return
    }
})

router.get('/sell-money', (req, res) => {
    res.render('sell-money', {
        title: "Virtual Pul Soting | GTASHOP",
        sellSuccess: req.flash('sellSuccess')
    })
    if(!req.cookies.token) {
        res.redirect("/login")
        return
    }
})

router.get('/add-account/:id', adminMiddleware, async (req, res) => {
    const id = req.params.id
    const account = await Account.findById(id).populate('user').lean()
    res.render("add-account", {
        title: "Publish Product | Admin",
        account: account,
        layout: 'admin',
        parentId: id
    })
})

router.get('/add-money/:id', adminMiddleware, async (req, res) => {
    const id = req.params.id
    const money = await Money.findById(id).populate('user').lean()
    res.render('add-money', {
        layout: 'admin',
        title: "Publish | GTASHOP",
        money: money
    })
})

router.get('/products', adminMiddleware, async (req, res) => {
    const accounts = await AddedAccount.find().lean()
    const money = await AddedMoney.find().lean()
    res.render("products", {
        layout: 'admin',
        title: "Products | Admin",
        accounts: accounts.reverse(),
        money: money.reverse(),
    })
})

router.get('/edit-account/:id', async (req, res) => {
    const id = req.params.id
    const accountData = await AddedAccount.findById(id)
    res.render('edit-account', {
        layout: 'admin',
        accountData
    })
})
// POST

router.post("/sell-my-account", userMiddleware, async (req, res) => {

    const {selectServer, accountLvl, accountMoney, accountSecurity, accountPrice, accountImage, userContact, addInfo  } = req.body
    if(!req.body) {
        req.flash("accountError", "Barcha qatorlarni To'ldiring!")
        return
    }

    await Account.create({...req.body, user: req.userId}) 
    req.flash('sellSuccess', "Ajoyib! E'loningiz 24 Soat ichida Saytga joylanadi.")
    res.redirect('/sell-account')
})

router.post("/sell-my-money", userMiddleware, async (req, res) => {
    const {selectServer, priceMoney, amountMoney, minimumAmount, imageMoney, userContact} = req.body
    await Money.create({...req.body, user: req.userId})
    req.flash('sellSuccess', "Ajoyib! E'loningiz 24 Soat ichida Saytga joylanadi.")
    res.redirect('/sell-money')
})

router.post("/add-account",  async (req, res) => {
    const {server, productTitle, owner, contactUser, price, userAvatar, serverImage, date, addInfo, parentId} = req.body
    const data = await AddedAccount.create({...req.body, _id: parentId})
    console.log(data)
    
    res.redirect('/admin-dashboard')
})

router.post("/add-money", async (req, res) => {
    const {productTitle, owner, priceMoney, amountMoney, minimumAmount, serverImage, userContact, avatar, date} = req.body
    await AddedMoney.create(req.body)
    res.redirect('/admin-dashboard')
})

router.post('/edit-account/:id', async (req, res) => {
    const {server, productTitle, owner, contactUser, price, userAvatar, serverImage, date, addInfo, parentId} = req.body
    const id = req.params.id
    const data = await AddedAccount.findByIdAndUpdate(id, req.body, {new: true})
    console.log(data)
    res.redirect('/products')
})

router.post("/delete-account/:id", async (req, res) => {
    const id = req.params.id
    await AddedAccount.findByIdAndDelete(id)
    res.redirect('/products')
})

router.post("/delete-money/:id", async (req, res) => {
    const id = req.params.id
    await AddedMoney.findByIdAndDelete(id)
    res.redirect('/products')
})

router.post("/delete-product/:id", async (req, res) => {
    const id = req.params.id
    await Account.findByIdAndDelete(id)
    res.redirect('/admin-dashboard')
})

export default router;