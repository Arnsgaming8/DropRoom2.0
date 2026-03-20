import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dxtujnsmb",
  api_key: process.env.CLOUDINARY_API_KEY || "785721964931176",
  api_secret: process.env.CLOUDINARY_API_SECRET || "dgVPHq6y6xIW9v1p_P0ae9hjsBg",
});

export { cloudinary };
