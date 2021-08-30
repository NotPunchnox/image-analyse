const jwt = require('jsonwebtoken'),
bcrypt = require('bcrypt'),
ApiError = require('../../helpers/ApiError'),
user = require('../../models/user')

module.exports = async (req, res) => {

    if (!req.body) return res.status(400).json(ApiError.badrequest)

    var { email, password } = req.body

    if (!email || !password) return res.status(400).json(new ApiError(400, 'Please specify your email or password'))

    if(!email.includes('@')) return res.status(400).json(new ApiError(400, 'Please specify a valid email'))
    let check = await user.findOne({ email: email }),
    p = await bcrypt.hash(password, await bcrypt.genSalt(12))

    if(check) return res.status(403).json(new ApiError(403, 'The email already used'))
    
    let client = await user.create({
        _id: Date.now() + 5000000000000 * 9000,
        email: email,
        password: p
    })

    let token = jwt.sign({ID: client._id}, process.env.KEY_JWT)

    res.status(201).json({ code: 201, token: token })

}