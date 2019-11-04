/*eslint no-unused-vars: "off" */
let users = require("../models/users")
let express = require("express")
let router = express.Router()
let mongoose = require("mongoose")



let mongodbUri = "mongodb+srv://AtlasAdminister:wojiubugaosuni@cluster0-k2ynh.mongodb.net/cookingweb"
mongoose.connect(mongodbUri, { useNewUrlParser: true })

let db = mongoose.connection

db.on("error", function (err) {
    console.log("Unable to Connect to [ " + db.name + " ]", err)
})

db.once("open", function () {
    console.log("Successfully Connected to [ " + db.name + " ]")
})


router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader("Content-Type", "application/json")
    users.find(function(err, users) {
        if (err)
            res.send(err)
        res.send(JSON.stringify(users,null,5))
    })
}

function getByValue(array, id) {
    let result  = array.filter(function(obj){return obj.id == id} )
    return result ? result[0] : null // or undefined
}

router.findOneByID = (req, res) => {
    res.setHeader("Content-Type", "application/json")
    users.findOne({ "_id" : req.params.id },function(err, user) {
        if (err)
            res.json({ message: "User NOT Found By ID!!", errorMessage: err})
        else
        if (user == null)
            res.send({message: "User NOT Found By ID!!"})
        else
            res.send(JSON.stringify(user,null,5))
    })
}

function getByName(array, name) {
    let result  = array.filter(function(obj){return obj.name == name} )
    return result ? result : null // or undefined
}

router.findOneByName = (req, res) => {
    res.setHeader("Content-Type", "application/json")
    users.findOne({ "name" : req.params.name },function(err, user) {
        if (err)
            res.json({ message: "User NOT Found By Name!!", errorMessage: err})
        else
        if (user != null)
            res.send(JSON.stringify(user,null,5))
        else
            res.send({ message: "User NOT Found By Name!!"})
    })

}

router.addUser = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    let user = new users()

    user.name = req.body.name
    user.password = req.body.password
    user.sex = req.body.sex
    user.personal_lnfo = req.body.personal_lnfo

    user.save(function (err) {
        if (err)
            res.json({message: "User NOT Added!", errorMessage: err})
        else
            res.json({message: "User Added Successfully!", data: user})
    })
}

router.changePassword = (req, res) => {
    users.findById(req.params.id, function (err, user) {
        if (err)
            res.json({message: "User NOT Found"})
        else {
            if (user == null)
                res.send("User NOT Found!")
            else {
                user.password = req.body.password
                user.save(function(err) {
                    if (err)
                        res.json({message: "Change Password NOT Successful!!", errorMessage: err})
                    else
                        res.json({message: "Change Password Successful!!", data: user})
                })
            }
        }
    })
}

router.editInformation = (req, res) => {
    users.findById(req.params.id, function (err, user) {
        if (err)
            res.json({message: "User NOT Found"/*errorMessage: err*/})
        else {
            if (user == null)
                res.send("User NOT Found!!")
            else {
                user.sex = req.body.sex
                user.personal_lnfo = req.body.personal_lnfo
                user.save(function(err) {
                    if (err)
                        res.json({message: "Edit Information NOT Successful!!", errorMessage: err})
                    else
                        res.json({message: "Edit Information Successful!!", data: user})
                })
            }
        }
    })
}

router.deleteUser = (req, res) => {

    users.findByIdAndRemove(req.params.id, function(err, user) {
        if (err)
            res.json({message: "User NOT Deleted!", errorMessage: err})
        else
        if (user == null)
            res.send("User NOT Found")
        else
            res.json({message: "User deleted Successfully!"})
    })

}


module.exports = router
