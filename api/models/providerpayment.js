var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortid = require('shortid');

var providerPaymentSchema = new Schema({
    _id: {
        type: String,
        'default': shortid.generate
    },
    complete: Boolean,
    remain: Number,
    total: Number,
    date: Date,
    currency: String,
    provider: {
        type: String,
        ref: 'Provider'
    },
    sale: {
        type: String,
        ref: 'Sale'
    },
    notes: [{
        type: String,
        ref: 'Note'
    }],
}, {
    timestamps: true,
    usePushEach: true
});

var ProviderPayment = mongoose.model('ProviderPayment', providerPaymentSchema);

module.exports = ProviderPayment;
