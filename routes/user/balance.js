const jwt = require('jsonwebtoken'),
    ApiError = require('../../helpers/ApiError'),
    user = require('../../models/user')

module.exports = async (req, res) => {

    if (!req.body) return res.status(400).json(ApiError.badrequest)
    if (!req.headers.token) return res.status(400).json(ApiError.badrequest)

    let token = jwt.verify(req.headers.token, process.env.KEY_JWT)

    if (!token.ID) return res.status(401).json(ApiError.unauthorized)

    const client = await user.findById(token.ID)

    if (!client) return res.status(404).json(ApiError.unauthorized)

    res.status(200).json({
        code: 200,
        api_key: req.headers.token,
        balance: {
            value: client.credits
        }
    })

}
