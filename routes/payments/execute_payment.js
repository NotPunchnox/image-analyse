const request2 = require('request'),
    ApiError = require('../../helpers/ApiError'),
    user = require('../../models/user'),
    PAYPAL_API = `https://api.paypal.com`

module.exports = async (req, res) => {
    if (!req.query) return res.status(400).json(ApiError.badrequest)
    const client = await user.findOne({
        'pending.id': req.query.paymentId
    })
    if (!client) return res.status(404).json(ApiError.unauthorized)

    if (client.approuved !== null) {
        if (client.approuved.find(a => a.id === req.query.paymentId)) return res.status(403).json(ApiError.forbidden)
    }
    const service = client.pending.find(a => a.id === req.query.paymentId)


    request2.post(PAYPAL_API + '/v1/payments/payment/' + req.query.paymentId + '/execute', {
        json: {
            payer_id: req.query.PayerID,
            transactions: [{
                amount: {
                    total: service.price,
                    currency: 'EUR'
                }
            }]
        },
        auth: {
            user: process.env.CLIENT,
            pass: process.env.SECRET
        }
    }, (e, r2) => {
        if (r2.statusCode !== 200) return console.error(r2.body), res.status(500).json(new ApiError(500, 'cancel'))

        client.approuved.push({
            id: r2.body.id,
            state: r2.body.state,
            cart: r2.body.cart,
            payer: {
                payment_method: r2.body.payer.id,
                status: r2.body.payer.id,
                payer_info: {
                    email: r2.body.payer.payer_info.email,
                    first_name: r2.body.payer.payer_info.first_name,
                    last_name: r2.body.payer.payer_info.last_name,
                    payer_id: r2.body.payer.payer_info.payer_id,
                    shipping_address: r2.body.payer.payer_info.shipping_address,
                    country_code: r2.body.payer.payer_info.country_code
                }
            },
            transactions: [{
                amount: r2.body.transactions.amount,
                payee: r2.body.transactions.payee,
                soft_descriptor: r2.body.transactions.soft_descriptor,
                item_list: r2.body.transactions.item_list,
                related_resources: r2.body.transactions.related_resources
            }],
            create_time: r2.body.create_time,
            update_time: r2.body.update_time
        })

        client.credits = client.credits + Number(service.price) * 1000

        client.save()

        res.status(201).json({
            code: 201,
            message: {
                balance: client.credits
            }
        })

    })
}
