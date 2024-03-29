import axios from "axios";
import sharp from "sharp";

const url = "http://localhost:5100/api/caption";

// Function to fetch image from URL and convert to base64
const imageToBase64 = async (imageUrl) => {
  try {
    // Fetch image as a stream
    const response = await axios({
      method: "get",
      url: imageUrl,
      responseType: "arraybuffer",
    });
    // Convert the response data to a Buffer
    const imageBuffer = Buffer.from(response.data, "binary");
    // Convert image to JPEG format using sharp, if necessary
    const convertedBuffer = await sharp(imageBuffer).jpeg().toBuffer();
    // Convert the image buffer to base64
    return convertedBuffer.toString("base64");
  } catch (error) {
    console.error("Error fetching image:", error);
  }
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
const processImageFromUrl = async (imageUrl) => {
  const imageBase64 = await imageToBase64(imageUrl);
  return await captionImage(imageBase64);
};

const imageCaption = await processImageFromUrl(
  "https://cdn.discordapp.com/attachments/1048378429231337493/1222562828448170014/FqnsPs-XoAAAFiD.png?ex=6616ab5c&is=6604365c&hm=9b2674c33c15e43781ec34d2cdbc6029e0cbeee3a25bef5384663fb962740ee4&"
).catch(console.error);
console.log(imageCaption);
