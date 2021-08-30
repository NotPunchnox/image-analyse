const express = require("express"),
  app = express(),
  fetch = require('node-fetch'),
  cocoSsd = require("@tensorflow-models/coco-ssd"),
  tf = require("@tensorflow/tfjs-node")

app.use(express.json())

app.post("/", async (req, res) => {
  
  const uri = String(req.body.image)
  
  function getImg(u) {
    return new Promise(async resolve => {
      let r = await fetch(u)
      resolve(r.buffer())
    })
  }

  const a = await [cocoSsd.load(), await getImg(uri)];

  const img = tf.node.decodeImage(new Uint8Array(a[1]), 3);

  // Load the model.
  const model = await cocoSsd.load();

  // Classify the image.
  const predictions = await model.detect(img);

  console.log(predictions)
  
  res.status(200).json({code:200, message: predictions})

})

app.listen(3000)
