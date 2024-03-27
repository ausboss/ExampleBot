import fs from "fs";
import path from "path";
import axios from "axios";
import sharp from "sharp";

const model_name = "model name goes here";
const image_path = "1710009654635280.jpg";
const url = "http://localhost:5100/api/caption";

// Function to convert image to base64
const imageToBase64 = async (filePath) => {
  // Convert image to JPEG format using sharp
  const imageBuffer = await sharp(filePath).jpeg().toBuffer();
  // Convert the image buffer to base64
  return imageBuffer.toString("base64");
};

// Function to send the image for captioning
const captionImage = async (imageBase64) => {
  const payload = {
    image: imageBase64,
  };
  try {
    const response = await axios.post(url, payload);
    if (response.data.caption) {
      return response.data.caption;
    }
  } catch (error) {
    console.error(error);
  }
};

// Main function to handle the process
const processImage = async (filePath) => {
  const imageBase64 = await imageToBase64(filePath);
  return await captionImage(imageBase64);
};

const imageCaption = await processImage(image_path).catch(console.error);
console.log(imageCaption);
