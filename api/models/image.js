var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortid = require('shortid');

var imageSchema = new Schema({
    _id: {
        type: String,
        'default': shortid.generate
    },
    source: String,
    front: Boolean,
    post: {
        type: String,
        ref: 'Post'
    },
}, {
    timestamps: true
});

var Image = mongoose.model('Image', imageSchema);

module.exports = Image;
