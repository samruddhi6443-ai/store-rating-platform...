const sharp = require("sharp");

const MAX_SIZE_KB = 320;
const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;

/**
 * Compress image to 320KB maximum size
 * @param {Buffer} imageBuffer - The image buffer to compress
 * @returns {Promise<Buffer>} - Compressed image buffer as base64 string
 */
const compressImage = async (imageBuffer) => {
  try {
    let quality = 80;
    let compressed = await sharp(imageBuffer)
      .jpeg({ quality, progressive: true })
      .toBuffer();

    // Iteratively reduce quality if still over size limit
    while (compressed.length > MAX_SIZE_BYTES && quality > 10) {
      quality -= 5;
      compressed = await sharp(imageBuffer)
        .jpeg({ quality, progressive: true })
        .toBuffer();
    }

    // Convert to base64 for database storage
    const base64 = compressed.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    console.log(
      `Image compressed: ${imageBuffer.length} bytes → ${compressed.length} bytes (${quality}% quality)`
    );

    return dataUrl;
  } catch (error) {
    console.error("Image compression error:", error);
    throw new Error("Failed to compress image");
  }
};

module.exports = { compressImage };
