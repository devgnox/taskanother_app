import { Cloudinary } from "@cloudinary/url-gen";

const cloudiary = () => {
  return new Cloudinary({
    cloud: {
      cloudName: "deywomwe5",
      apiKey: process.env.CLOUDINARY_API_KEY!,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  });
};

export default cloudiary;
