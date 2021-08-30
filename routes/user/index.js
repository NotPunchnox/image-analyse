const router = require('express').Router()


router.route('/').get(require('./@me'))
router.route('/balance').get(require('./balance'))
router.route('/approuved').get(require('./approuved'))

module.exports = router