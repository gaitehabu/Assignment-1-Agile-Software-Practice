/*eslint no-unused-vars: "off" */
let express = require("express")
let router = express.Router()

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Cooking web" })
})

module.exports = router
