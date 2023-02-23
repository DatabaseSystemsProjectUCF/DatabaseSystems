/** Express Instance */
const express = require("express")
const cors = require("cors")
const UserRoutes = require('./routes/Users');

/** Express Config */
const app = express()
const PORT = 8800

app.use(express.json())
app.use(cors())
app.use('/user', UserRoutes);


// /** Login Route */
// const loginRoute = require("./routes/Login")
// app.use("/login", loginRoute)

// /** Signup Route */
// const signupRoute = require("./routes/Register")
// app.use("/register", signupRoute)

/** App Listener */
app.listen(PORT, ()=>{
    console.log('Connected to backend on Port: ' + PORT)
})


