const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises; // Use the promise-based fs module
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log(process.env.CLOUDINARY_CLOUD_NAME,process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET);
const uploadOnCloudinary = async (localFilePath) => {

    console.log("i am local"+localFilePath);
  if (!localFilePath) return { error: "No file path provided" };

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });



    await fs.unlink(localFilePath);
    return response.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    await fs.unlink(localFilePath);
    return { error: "Error uploading to Cloudinary", details: error };
  }
};

module.exports = {uploadOnCloudinary};