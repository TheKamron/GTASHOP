import express from "express";
import { create } from "express-handlebars";
import * as dotenv from "dotenv"
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash"
import cookieParser from "cookie-parser";
import hbsHelper from "./utils/function.js"
import User from "./models/User.js"
// middlewares
import varMiddleware from "./middleware/var.js"

// routes
import AuthRoutes from "./routes/auth.js"
import IndexRoutes from "./routes/index.js"
import ProductRoutes from "./routes/product.js"

dotenv.config()

const app = express()
const hbs = create({defaultLayout: 'main', extname: 'hbs', helpers: hbsHelper, runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
} })
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', "./views")

app.use(express.json())
app.use(session({secret: "appSecretKey", resave: false, saveUninitialized: false}))
app.use(flash())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(express.static("assets"))
app.use(express.static("vendor"))
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.regSuccess = req.flash('regSuccess')
    next()
})

app.use(varMiddleware)
app.use(AuthRoutes)
app.use(IndexRoutes)
app.use(ProductRoutes)


const startApp = () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        const PORT = process.env.PORT || 5500
        app.listen(PORT, () =>  console.log(`Server is running on port ${PORT} `))

    } catch (error) {
        console.log(error)
    }
}
startApp()