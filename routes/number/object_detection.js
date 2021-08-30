const request = require('sync-request'),
  ApiError = require('../../helpers/ApiError'),
  user = require('../../models/user'),
  jwt = require('jsonwebtoken'),
  fetch = require('node-fetch')

module.exports = async (req, res) => {

  const {
    uri
  } = req.query

  if (!req.headers.token) return res.status(400).json(ApiError.badrequest)
  let token = jwt.verify(req.headers.token, process.env.KEY_JWT)
  if (!token.ID) return res.status(401).json(ApiError.unauthorized)


  const client = await user.findById(token.ID)
  if (!client) return res.status(404).json(ApiError.unauthorized)
  if (!uri) return res.status(400).json(new ApiError(400, 'image url not found!'))

  const cocoSsd = require("@tensorflow-models/coco-ssd");
  const tf = require("@tensorflow/tfjs-node");

  function getImg(u) {
    return new Promise(async resolve => {
      let r = await fetch(u)
      if (!r.buffer()) return res.status(403).json(new ApiError(403, 'Invalid uri!'))
      resolve(r.buffer())
    })
  }

  const a = await [cocoSsd.load(), await getImg(req.query.uri)]

  const img = tf.node.decodeImage(new Uint8Array(a[1]), 3)

  const model = await cocoSsd.load()
  const predictions = await model.detect(img)

  return res.status(200).json({
    code: 200,
    message: predictions
  })

}