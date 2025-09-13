const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'hackathon' },
            (error, result) => {
                if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(error);
                }
            }
        );
        require('streamifier').createReadStream(buffer).pipe(stream);
    });
};

const removeImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            folder: 'hackathon',
        });
        console.log('Image removed from Cloudinary:', result);
        return result;
    } catch (error) {
        console.error('Error removing image from Cloudinary:', error);
        throw new Error('Image removal failed');
    }
}
module.exports = { uploadImage, removeImage };