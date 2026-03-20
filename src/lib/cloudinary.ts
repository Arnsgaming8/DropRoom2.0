import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dxtujnsmb";
const apiKey = process.env.CLOUDINARY_API_KEY || "785721964931176";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "dgVPHq6y6xIW9v1p_P0ae9hjsBg";

console.log("Cloudinary config:", { 
  cloudName, 
  apiKey, 
  apiSecretFirstChars: apiSecret ? apiSecret.substring(0, 5) : "NOT SET" 
});

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export { cloudinary };
