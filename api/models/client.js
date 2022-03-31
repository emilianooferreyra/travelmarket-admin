var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortid = require('shortid');

var clientSchema = new Schema({
    _id: {
        type: String,
        'default': shortid.generate
    },
    name: String,
    dni: String,
    phone: Number,
    birth: Date,
    cuit: Number,
    mail: String,
    address: String,
    notes: [{
        type: String,
        ref: 'Note'
    }],
}, {
    timestamps: true,
    usePushEach: true
});

var Client = mongoose.model('Client', clientSchema);

module.exports = Client;
