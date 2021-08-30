const jwt = require('jsonwebtoken'),
    request = require('request'),
    ApiError = require('../../helpers/ApiError'),
    user = require('../../models/user'),
    PAYPAL_API = 'https://api.paypal.com'

module.exports = async (req, res) => {

    if (!req.body) return res.status(400).json(ApiError.badrequest)
    if (!req.headers.token) return res.status(400).json(ApiError.badrequest)

    let token = jwt.verify(req.headers.token, process.env.KEY_JWT)

    if (!token.ID) return res.status(401).json(ApiError.unauthorized)

    if(!req.body.price) return res.status(400).json(ApiError.badrequest)
    if(typeof req.body.price !== 'number') return res.status(400).json(ApiError.badrequest)
    if(Number(req.body.price) < 4) return res.status(403).json(ApiError.forbidden)

    const client = await user.findById(token.ID)

    if (!client) return res.status(404).json(ApiError.unauthorized)

    request.post(PAYPAL_API + '/v1/payments/payment', {
        auth: {
            user: process.env.CLIENT,
            pass: process.env.SECRET
        },
        body: {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            transactions: [{
                amount: {
                    total: req.body.price,
                    currency: 'EUR'
                }
            }],
            redirect_urls: {
                return_url: process.env.name + '/succes',
                cancel_url: process.env.name + '/cancel'
            }
        },
        json: true
    }, async (e, r) => {
        if (e) return res.status(500).json(ApiError.error)

        client.pending.push({
            id: r.body.id,
            transactions: r.body.transactions,
            price: Number(req.body.price),
            createdAt: r.body.create_time
        })
        client.save()

        res.status(201).json({
            code: 201,
            message: {
                link: r.body.links[1].href
            }
        })

    })
}
