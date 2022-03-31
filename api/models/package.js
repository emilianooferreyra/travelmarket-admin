var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortid = require('shortid');

var packageSchema = new Schema({
    _id: {
        type: String,
        'default': shortid.generate
    },
    front: {
        type: String,
        ref: 'Image'
    },
    city: String,
    country: String,
    beach: String,
    when: Date,
    days: Number,
    nights: Number,
    passengers: Number,
    aerial: Boolean,
    excursion: Boolean,
    transfer: Boolean,
    foodRegime: String,
    hotelName: String,
    description: String,
    currency: String,
    accommodation: Boolean,
    starred: Boolean,
    minorsAge: Number,
    price: Number
}, {
    timestamps: true
});

var Package = mongoose.model('Package', packageSchema);

module.exports = Package;
