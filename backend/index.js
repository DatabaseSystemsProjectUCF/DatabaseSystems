/** Express Instance */
const express = require("express")
const cors = require("cors")
const UserRoutes = require('./routes/Users');
const RsoRoutes = require('./routes/RSO');
const UnivRoutes = require('./routes/University');
const EventRoutes = require('./routes/Event')

/** Express Config */
const app = express()
const PORT = 8800

app.use(express.json())
app.use(cors())
app.use('/user', UserRoutes);
app.use('/rso', RsoRoutes);
app.use('/university', UnivRoutes);
app.use('/events', EventRoutes);

// function to use async await on the routes
const asyncHandler = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next)).catch(next);
}

/** App Listener */
app.listen(PORT, ()=>{
    console.log('Connected to backend on Port: ' + PORT)
})

module.exports = { asyncHandler };


