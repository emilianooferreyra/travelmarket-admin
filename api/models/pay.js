var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  shortid = require("shortid");

var paySchema = new Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    date: Date,
    payMethod: String,
    currency: String,
    importe: Number,
    importeConvertido: Number,
    exchangeRate: Number,
    impWer: String,
    sale: {
      type: String,
      ref: "Sale",
    },
    providerpayment: {
      type: String,
      ref: "Sale",
    },
  },
  {
    timestamps: true,
    usePushEach: true,
  }
);

var Pay = mongoose.model("Pay", paySchema);

module.exports = Pay;
