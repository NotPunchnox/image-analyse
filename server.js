const express = require("express"),
  app = express(),
  fetch = require('node-fetch')

app.post("/object-detection", async (req, res) => {
    require("@tensorflow/tfjs-backend-cpu")
    require("@tensorflow/tfjs-backend-webgl")
    const cocoSsd = require("@tensorflow-models/coco-ssd")
    const tf = require("@tensorflow/tfjs-node")

    function getImg(u) {
      return new Promise(async resolve => {
        let r = await fetch(u)
        resolve(r.buffer())
      })
    }
    
    const a = await [cocoSsd.load(), await getImg(req.query.uri)]

    const img = tf.node.decodeImage(new Uint8Array(a[1]), 3)

    // Load the model.
    const model = await cocoSsd.load()

    // Classify the image.
    const predictions = await model.detect(img)

    if(!predictions) return res.status(403).json({ code: 403, message: 'error' })

    return res.status(200).json({ code: 200, message: predictions})

})

app.listen(process.env.PORT || 3000)
