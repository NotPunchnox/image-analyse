const router = require('express').Router()

router.route('/payment').post(require('./buy'))
router.route('/succes').get(require('./execute_payment'))

module.exports = router
