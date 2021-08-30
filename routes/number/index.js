const router = require('express').Router()

router.route('/object-detection').post(require('./object_detection'))

module.exports = router
