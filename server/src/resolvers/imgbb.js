import got from "got";
import Config from "../config";
import { handleError } from "../utils/handleError";

const IMGBB_API_URL = Config.imgbb.apiUrl;
const IMGBB_API_KEY = Config.imgbb.apiKey;

export default {
  Mutation: {
    // Upload your profile picture
    uploadImage: async (_, { picture }, { models, req }) => {
      try {
        const myId = req.session.userId;

        // Only users can upload images
        if (!myId) {
          return handleError(
            "user",
            "Only authenticated users can upload images."
          );
        }

        console.log(picture);

        // Upload an image to ImgBB
        // More info: https://api.imgbb.com/
        // Example call: https://api.imgbb.com/1/upload?expiration=600&key=YOUR_CLIENT_API_KEY

        const query = `${IMGBB_API_URL}?key=${IMGBB_API_KEY}&image=${picture}`;

        const {
          body: {
            data: { url },
            success,
          },
        } = await got(query, { responseType: "json" });

        if (!success) {
          return handleError("imgbb", "Could not upload image to ImgBB.");
        }

        return { picture: url };
      } catch (err) {
        console.log(err);
        return handleError(
          "API",
          "Something went wrong, please try again later."
        );
      }
    },
  },
};
