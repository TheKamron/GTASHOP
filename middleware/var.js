export default function (req, res, next)  {
    const userToken = req.cookies.token
    if(userToken) {
        res.locals.token = true
    } else {
        res.locals.token = false
    }
    next()
}