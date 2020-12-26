const mongoose = require('mongoose');

// the schema
const transactionSchema = new mongoose.Schema({
    kind: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['buy', 'sell', 'dividend', 'split']
    },
    date: {
        type: Date
    },
    quantity: {
        type: Number,
        min: 0
    },
    price: {
        type: Number,
        min: 0
    },
    commission: {
        type: Number,
        min: 0
    },
    notes: {
        type: Buffer
    }
});

// there is no model

module.exports = transactionSchema;