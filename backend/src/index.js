const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const route = require('./Routes/route')

app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://pareshnaik:W536yetBeRCk0yL8@cluster0.m9yz9.mongodb.net/calculator-DB", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`)
})








