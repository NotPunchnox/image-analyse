const jwt = require('jsonwebtoken'),
bcrypt = require('bcrypt'),
ApiError = require('../../helpers/ApiError'),
user = require('../../models/user')

module.exports = async (req, res) => {

    if (!req.body) return res.status(400).json(ApiError.badrequest)

    var { email, password } = req.body

    if (!email || !password) return res.status(400).json({ code: 400, message: 'Please specify your email or password'})

    let client = await user.findOne({ email: email })

    if(!client) return res.status(404).json(ApiError.notfound)

    let pass = await bcrypt.compare(password, client.password)

    if(!pass) return res.status(403).json(new ApiError(403, 'Invalid password'))

    let token = jwt.sign({ID: client._id}, process.env.KEY_JWT)

    res.status(201).json({ code: 201, token: token })

}