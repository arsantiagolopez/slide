import { existsSync, mkdirSync } from "fs";

// Create a folder in give path if it doesn't exist
const createFolderIfNotExists = (folderPath) => {
  try {
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath);
    }
  } catch (err) {
    console.log(err);
  }
};

export { createFolderIfNotExists };
