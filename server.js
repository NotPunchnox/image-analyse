const app = require('express')(),
    mongoose = require('mongoose'),
    bp = require('body-parser'),
    start = new Date()

require('dotenv').config()


app.use(require('cors')())

app.use(bp.urlencoded({
    extended: false
}))
app.use(bp.json())

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
mongoose.connection.on('connected', e => {
    if (e) throw e
    console.info('connected to data base!')
})

app.get('/', (req, res) => {
    return res.status(203).json({
        status: true,
        code: 203,
        message: 'hey 👋'
    })
})

app.use(require('./routes/auth/index'), require('./routes/payments/index'), require('./routes/number/index'))
app.use('/@me', require('./routes/user/index'))


app.listen(process.env.PORT, (e) => {
    if (e) throw e
    console.log(`[\x1b[36mServer\x1b[0m]: \x1b[32mstarted successfully at\x1b[0m [\x1b[36mlocalhost:${process.env.PORT}\x1b[0m] \x1b[32min\x1b[0m [\x1b[36m${new Date() - start}ms\x1b[0m]`)
})