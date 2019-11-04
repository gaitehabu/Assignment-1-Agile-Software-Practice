/*eslint no-unused-vars: "off" */
let createError = require("http-errors")
let express = require("express")
let path = require("path")
let cookieParser = require("cookie-parser")
let logger = require("morgan")

let indexRouter = require("./routes/index")
let usersRouter = require("./routes/users")

const users = require("./routes/users")
const recipes = require("./routes/recipes")
let app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)

//users
app.get("/users", users.findAll)
app.get("/users/:id", users.findOneByID)
app.get("/users/name/:name", users.findOneByName)
app.post("/users", users.addUser)
app.put("/users/:id/password", users.changePassword)
app.put("/users/:id/editInformation", users.editInformation)
app.delete("/users/:id", users.deleteUser)

//recipes
app.get("/recipes", recipes.findAll)
app.get("/recipes/:id", recipes.findOneByID)
app.get("/recipes/name/:name", recipes.findOneByName)
app.get("/recipes/username/:username", recipes.findOneByUserName)
app.get("/recipes/search/:name", recipes.fuzzySearch)
app.get("/recipes/:id/comment", recipes.findComment)

app.post("/recipes", recipes.addRecipe)
app.post("/recipes/:id/addComment", recipes.addComment)
app.put("/recipes/:id/upLike", recipes.incrementUpLike)
app.put("/recipes/:id/editRecipes", recipes.editRecipes)
app.delete("/recipes/:id", recipes.deleteRecipe)
app.delete("/recipes/:id/comment/:cid", recipes.deleteRecipeComment)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render("error")
})

module.exports = app
