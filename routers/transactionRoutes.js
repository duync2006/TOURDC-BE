const express = require('express');
const TransactionController = require('../controllers/transactionHistoryController');

const router = express.Router();
// const upload = require('../middleware/upload')

router.post('/add', TransactionController.addTransaction);
router.post('/getTransactions', TransactionController.getTransactionHistory)

module.exports = router;
