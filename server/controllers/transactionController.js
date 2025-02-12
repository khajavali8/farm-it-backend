import Transaction from '../models/Transaction.js';
import Farm from '../models/Farm.js';  
import mongoose from 'mongoose';

const transactionController = {
  async getTransactions(req, res) {
    try {
      console.log("User ID:", req.user.id);
      const transactions = await Transaction.find({ from: req.user.id });

      if (!transactions.length) {
        return res.status(404).json({ message: "No transactions found" });
      }

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async getAnalytics(req, res) {
    try {
      const userId = new mongoose.Types.ObjectId(req.user.id);

      const investments = await Transaction.aggregate([
        { $match: { from: userId, type: 'investment' } },
        { $group: { _id: { $month: "$date" }, totalAmount: { $sum: "$amount" } } },
        { $sort: { _id: 1 } }
      ]);

      const repayments = await Transaction.aggregate([
        { $match: { from: userId, type: 'repayment' } },
        { $group: { _id: { $month: "$date" }, totalAmount: { $sum: "$amount" } } },
        { $sort: { _id: 1 } }
      ]);

      res.json({ investments, repayments });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async getTransactionDetails(req, res) {
    try {
      console.log("Transaction ID:", req.params.id);
      const transaction = await Transaction.findById(req.params.id);

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      const farmDetails = await Farm.findById(transaction.farmId);
      if (!farmDetails) {
        return res.status(404).json({ message: "Farm details not found" });
      }

      res.json({
        transaction,
        farmDetails,
        investorContribution: transaction.amount  
      });
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};

export default transactionController;
