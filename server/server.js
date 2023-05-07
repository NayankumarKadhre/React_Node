const cors = require("cors");
const express = require('express');
const bodyParser = require('body-parser');
const cv = require('opencv4nodejs');
const tf = require('@tensorflow/tfjs-node');

// Define the app
const app = express();
app.use(cors());

// Define the number of classes
const numClasses = 10;

// Load the trained model
const model = await tf.loadLayersModel('file://./model.h5');

// Define middleware for parsing JSON data
app.use(bodyParser.json());

// Define the route for the POST request
app.post('/', (req, res) => {
  const dataURL = req.body.dataURL;
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");

  // Convert base64 data to binary buffer
  const buffer = Buffer.from(base64Data, 'base64');

  // Read the image data from buffer
  cv.imread(buffer, cv.IMREAD_GRAYSCALE, (err, img) => {
    if (err) throw err;

    // Resize the image to 32x32
    const resizedImg = img.resize(32, 32);

    // Convert image to 8-bit depth
    const img8bit = resizedImg.convertTo(cv.CV_8UC1);

    // Convert OpenCV Mat object to array
    const data = img8bit.getDataAsArray();

    // Reshape the array into a 32x32x1 image
    const image = tf.tensor3d(data, [32, 32, 1], 'int32');

    // Normalize the pixel values
    const normalizedImage = image.toFloat().div(tf.scalar(255.0));

    // Get the prediction from the model
    const prediction = model.predict(normalizedImage.expandDims());

    res.json({prediction: prediction.dataSync()});
  });
});

// Start server
app.listen(8000, () => {
  console.log("Server listening on port 8000");
});





























// //jshint esversion:6     TENSOR
// const express = require("express"); 
// const app = express();
// const cors = require("cors");
// const tf = require("@tensorflow/tfjs-node");
// const fs = require("fs");
// const axios = require("axios");
// const { createCanvas, loadImage } = require('canvas');
// app.use(express.json());
// app.use(cors());

// const modelPath = "./model/model.json"; // path to the saved model
// const imgSize = 32; // size of the input image
// const imgChannels = 1; // number of channels in the input image

// // Load the model
// const loadModel = async (path) => {
//   const model = await tf.loadLayersModel("file://" + path);
//   return model;
// };

// // Load the image from URL and convert it to a tensor
// const loadImageFromURL = async (url) => {
//   const response = await axios({
//     url,
//     responseType: "arraybuffer"
//   });
//   const buffer = Buffer.from(response.data);
//   const img = await loadImage(buffer);
//   const canvas = createCanvas(img.width, img.height);
//   const ctx = canvas.getContext('2d');
//   ctx.drawImage(img, 0, 0);
//   const data = ctx.getImageData(0, 0, img.width, img.height).data;
//   const tensor = tf.tensor3d(Array.from(data), [img.width, img.height, 4], 'int32')
//     .slice([0, 0, 0], [img.width, img.height, 3])
//     .mean(-1)
//     .toFloat()
//     .div(tf.scalar(255.0))
//     .expandDims();
//   return tensor;
// };

// // Preprocess the input image tensor
// const preprocessImage = (img) => {
//   return tf.image.resizeBilinear(img, [imgSize, imgSize]).toFloat();
// };

// // Route for predicting the image
// app.post('/', async (req, res) => {
//   try {
//     // Load the model
//     const model = await loadModel(modelPath);

//     // Load the image from URL
//     const dataURL = req.body.dataURL;
//     const imageTensor = await loadImageFromURL(dataURL);

//     // Preprocess the image tensor
//     const preprocessedTensor = preprocessImage(imageTensor);

//     // Make the prediction
//     const prediction = await model.predict(preprocessedTensor);

//     // Send the prediction back to the client
//     res.json({ prediction: prediction.dataSync() });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Start server
// app.listen(8000, () => {
//   console.log("Server listening on port 8000");
// });