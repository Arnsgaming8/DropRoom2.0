import { v2 as cloudinary } from "cloudinary";

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dxtujnsmb",
  api_key: process.env.CLOUDINARY_API_KEY || "785721964931176",
  api_secret: process.env.CLOUDINARY_API_SECRET || "dgVPHq6y6xIW9v1p_P0ae9hjsBg",
};

console.log("Cloudinary config:", { 
  cloud_name: config.cloud_name, 
  api_key: config.api_key,
  api_secret_first5: config.api_secret?.substring(0, 5)
});

cloudinary.config(config);

export { cloudinary };
