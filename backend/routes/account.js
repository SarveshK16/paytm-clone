const express = require("express");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");
const router = express.Router();
const { default: mongoose } = require("mongoose");

router.get("/balance", authMiddleware , async (req, res) => {
    const account = await Account.findOne({ userId: req.userId });
    res.json({
        balance: account.balance
    });
})

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        const account = await Account.findOne({ userId: req.userId }).session(session);
        

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        

        if (!toAccount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        
        if (account.userId.equals(toAccount.userId)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: "Cannot transfer to the same account"
            });
        }


        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        ).session(session);


        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction error:", error);
        res.status(500).json({
            message: "Transfer failed",
            error: error.message
        });
    }
});

module.exports = router;