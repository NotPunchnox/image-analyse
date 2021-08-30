const mongoose = require('mongoose')

module.exports = mongoose.model('user', new mongoose.Schema({
    _id: Number,
    email: String,
    password: String,
    createdAt: {
        default: Date.now(),
        type: Date
    },
    credits: {
        default: 0,
        type: Number
    },
    notifs: [{
        icon: Number,
        text: String,
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    phone: [{
        id: String,
        service: String,
        tzid: Number,
        number: String,
        code: [{
            createdAt: {
                type: Date,
                default: Date.now()
            },
            code: String,
            message: String
        }],
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    pending: [{
        id: String,
        transactions: Object,
        createdAt: String,
        service: String,
        price: String
    }],
    approuved: [{
        id: String,
        state: String,
        cart: String,
        payer: {
            payment_method: String,
            status: String,
            payer_info: {
                email: String,
                first_name: String,
                last_name: String,
                payer_id: String,
                shipping_address: Object,
                country_code: String
            }
        },
        transactions: [{
            amount: Array,
            payee: Array,
            soft_descriptor: String,
            item_list: Array,
            related_resources: Array
        }],
        create_time: String,
        update_time: String
    }]
}, {
    versionKey: false
}))