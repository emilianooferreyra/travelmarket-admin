var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortid = require('shortid');

var clientSchema = new Schema({
    _id: {
        type: String,
        'default': shortid.generate
    },
    name: String,
    cuit: Number,
    bank: String,
    cbuPeso: String,
    cbuDolar: String,
    phone: String,
    mail: String,
    notes: [{
        type: String,
        ref: 'Note'
    }],
}, {
    timestamps: true,
    usePushEach: true
});

var Provider = mongoose.model('Provider', clientSchema);

module.exports = Provider;
