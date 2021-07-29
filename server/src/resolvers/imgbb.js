// import axios from "axios";
import FormData from "form-data";
import { createReadStream, createWriteStream, unlink } from "fs";
import got from "got";
import path from "path";
import { v4 } from "uuid";
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

        console.log("checkpoint 1");

        const { createReadStream: fileReadStream } = await picture.promise;
        const stream = fileReadStream();

        // Create temp file to store in directory
        const dirEnd = `../../public/${v4()}`;
        const dir = path.join(__dirname, dirEnd);

        console.log("checkpoint 2");

        // Write file to dir & return file stream
        const formReadyStream = await new Promise((resolve, reject) =>
          stream
            .pipe(createWriteStream(dir))
            .on("finish", () => {
              console.log("finished: ", createReadStream(dir));
              resolve(createReadStream(dir));
            })
            .on("error", (err) => {
              console.log("errored: ", err);
              reject();
            })
        );

        // Read file and post to form data
        const form = new FormData();
        form.append("key", IMGBB_API_KEY);
        form.append("image", formReadyStream);

        console.log("checkpoint 3");

        // Upload an image to ImgBB
        // More info: https://api.imgbb.com/
        // Example call: https://api.imgbb.com/1/upload?expiration=600&key=YOUR_CLIENT_API_KEY

        const {
          body: {
            data: { url },
            success,
          },
        } = await got.post(IMGBB_API_URL, {
          body: form,
          responseType: "json",
        });

        console.log("checkpoint 4");

        // Delete file from dir after stream read & imgbb post
        if (formReadyStream) {
          unlink(dir, (err, res) => {
            if (err) return err;
            return res;
          });
        }

        console.log("checkpoint 5");

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
