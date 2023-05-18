const mongoose = require("mongoose")

const calculatorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        calculation: {
            type: String,
            trim: true
        },
        result: {
            type: Number,
            trim: true
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('calculator', calculatorSchema)




