var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  shortid = require("shortid");

var saleSchema = new Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    description: String,
    code: String,
    currency: String,
    category: String,
    impNeto: Number,
    tx: Number,
    impTm: Number,
    profit: Number,
    benefit: Number,
    complete: Boolean,
    total: Number,
    remain: Number,
    date: Date,
    notes: [
      {
        type: String,
        ref: "Note",
      },
    ],
    client: {
      type: String,
      ref: "Client",
    },
    provider: {
      type: String,
      ref: "Provider",
    },
    package: {
      type: String,
      ref: "Package",
    },
  },
  {
    timestamps: true,
    usePushEach: true,
  }
);

var Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
