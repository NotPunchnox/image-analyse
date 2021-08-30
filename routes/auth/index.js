const router = require('express').Router()

router.route('/auth/register').post(require('./register'))
router.route('/auth/login').post(require('./login'))

module.exports = router