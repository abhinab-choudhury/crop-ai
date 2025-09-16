import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import env from './env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'hackathon' }, (error, result) => {
      if (result) {
        resolve(result.secure_url);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const removeImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image removed from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('Error removing image from Cloudinary:', error);
    throw new Error('Image removal failed');
  }
};
