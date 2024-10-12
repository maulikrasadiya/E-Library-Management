const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { 
        type: String,
        required: true 
    },
    authorName: { 
        type: String,
        required: true 
    },
    genre: { 
        type: String,
        required: true 
    },
    availability: { 
        type: Boolean,
        default: true 
    },
    borrowedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book
