const calculatorModel = require("../Models/calculatorModel")


//================================= Validation =============================================================//

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isvalidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0;
}


//============================ controller for save calculation ===============================================//


const saveCalculation = async function (req, res) {

    try {

        let data = req.body

        if (!isvalidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "please enter valid data" });
        } else {
            const { name, calculation } = data

            if (!isValid(name)) {
                return res.status(400).send({ status: false, message: "please enter valid name" })
            }
            if (!isValid(calculation)) {
                return res.status(400).send({ status: false, message: "please enter valid calculation" })
            }

            let saveData = await calculatorModel.create(data)
            return res.status(201).send({ status: true, message: "Success", data: saveData })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


//============================ controller for get data ========================================================//


const getData = async function (req, res) {

    try {

        let data = req.query

        let getData = await calculatorModel.find(data)
        return res.status(200).send({ status: true, message: "Success", data: getData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//============================ controller for delete calculation ============================================//


const deleteData = async function (req, res) {

    try {
        let data = req.params.id

        let getData = await calculatorModel.findByIdAndDelete({ _id: data })

        if (!getData) {
            return res.status(404).send({ status: false, message: "Data NOT found" })
        }
        return res.status(200).send({ status: true, message: "Deleted successfully" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { saveCalculation, getData, deleteData }














