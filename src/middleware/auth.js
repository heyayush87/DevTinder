const auth = (req, res, next) => {
    const  token="xyz"
    const isAuthrequired = token ===" xyz"
    if (!isAuthrequired) {
        res.status(401).send("unauthaurized request")
    }
    else {
        next()
    }
}
module.exports = { auth, };