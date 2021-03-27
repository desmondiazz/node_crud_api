var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Book = new Schema({
    uuid: {type: String, required: true, index: { unique: true }},
    name: {type: String, required: true},
    releaseDate: { type: Number, required: true},
    authorName: {type: String, required: true},
    status: {type:Number , default: 1, index: true},
    createdAt: {type:Number, required:true},
    updatedAt: {type:Number, default:null}
});

module.exports = mongoose.model('books', Book);