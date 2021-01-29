const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    date: {
      type: String
    },
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
     balance:{
       type: Number,
       required: "Enter Balance"
     },
     update: {
      type: Date,
      default: Date.now
    },
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
