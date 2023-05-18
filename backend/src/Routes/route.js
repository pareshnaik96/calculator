const express = require('express')
const router = express.Router()
const calculatorController = require('../Controllers/calculatorController')


router.post('/api/post', calculatorController.saveCalculation)
router.get('/api/get', calculatorController.getData)
router.delete('/api/delete/:id', calculatorController.deleteData)


module.exports = router



