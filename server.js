const express = require("express")
const connectDB = require("./config/db")

connectDB()
const user_route = require("./routes/user_route")
const profile_route = require("./routes/profile_route")
const recipe_route = require("./routes/recipe_route")

const app = express()

 app.use(express.json())
 app.use(express.text())
 app.use(express.text({type:"application/javascript"}))
 app.use(express.text({type:"text/html"}))
 app.use(express.text({type:"application/xml"}))
 app.use(express.urlencoded())

 const PORT = process.env.PORT || 4000

 app.get("/", (req,res) =>{
    res.send(`Server is running on ${PORT}`)
 })

 app.get("/health", (req,res) => {
    res.json({
        "status":"okay",
        "time":new Date().toISOString()
    })

 })

 app.use("/user",user_route)
 app.use("/profile", profile_route)
 app.use('/recipe',recipe_route)
 
 
 // 404 Middleware
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Logs the full error details for developers

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server",
  });
});



 app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
 })