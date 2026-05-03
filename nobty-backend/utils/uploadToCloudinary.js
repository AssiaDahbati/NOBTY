const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const uploadBufferToCloudinary = (fileBuffer, folder = "nobty") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadBufferToCloudinary;