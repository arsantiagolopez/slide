import argon2 from "argon2";
import Config from "../config";
import { handleError } from "../utils/handleError";

// Constants
const COOKIE_NAME = Config.cookieName;
const CLIENT_URL = Config.clientUrl;

export default {
  Query: {
    // Check if user is logged in
    // User considered logged in if their id is stored in session
    me: (_, __, { models, req }) => {
      const myId = req.session.userId;

      // Return null if not logged in
      if (!myId) return null;

      return models.User.findOne({ where: { id: myId } });
    },
    // Returns true if user with email exists
    userRegistered: async (_, { email }, { models }) => {
      const emailExists = await models.User.findOne({ where: { email } });
      if (emailExists) return true;
      return false;
    },
    // Get newest users (last 30)
    getNewestUsers: async (_, __, { models, req }) => {
      const myId = req.session.userId;

      // Return null if not logged in
      if (!myId) return null;

      const newestUsers = await models.User.findAll({
        limit: 3,
        order: [["createdAt", "DESC"]],
      });

      return newestUsers;
    },
  },
  Mutation: {
    // Sign user up locally, log them in & return their profile
    signup: async (
      _,
      { input: { email, password, name } },
      { models, req }
    ) => {
      try {
        const lowercaseEmail = email.toLowerCase();

        // Check if email is already registered
        const emailExists = await models.User.findOne({
          where: { email: lowercaseEmail },
        });

        if (emailExists) {
          return handleError("email", "User with that email already exists.");
        }

        // Validate password
        if (password.length < 5 || password.length > 50) {
          return handleError(
            "password",
            "Password must be between 5 and 50 characters long."
          );
        }

        // Hash password with argon2
        const hashedPassword = await argon2.hash(password);

        // Create user
        const user = await models.User.create({
          email: lowercaseEmail,
          password: hashedPassword,
          name,
        });

        // Update user session & log them in
        req.session.userId = user.id;

        // Return merged fields
        return {
          user,
        };
      } catch (err) {
        // Handle global errors
        return handleError(
          "credentials",
          "Something went wrong. Please try a different email."
        );
      }
    },
    // Local user login
    login: async (_, { input: { email, password } }, { models, req }) => {
      const lowercaseEmail = email.toLowerCase();

      // Check if user exists
      const user = await models.User.findOne({
        where: { email: lowercaseEmail },
      });

      if (!user) {
        return handleError(
          "credentials",
          "Wrong credentials, please try again."
        );
      }

      // Authenticate password
      const isValid = await argon2.verify(user.password, password);

      // Same here, if incorrect credentials,
      // show global error message
      if (!isValid) {
        return handleError(
          "credentials",
          "Wrong credentials, please try again."
        );
      }

      // Update user session & log them in
      req.session.userId = user.id;

      return { user };
    },
    // Log user out by destroying their session
    logout: (_, __, { req, res }) =>
      new Promise((resolve) => {
        // Destroy session
        req.session.destroy((err) => {
          // Clear session cookie
          res.clearCookie(COOKIE_NAME);

          if (err) return resolve(false);

          return resolve(true);
        });
      }),

    // Update user profile
    updateProfile: async (
      _,
      { input: { email, name, picture } },
      { models, req }
    ) => {
      const myId = req.session.userId;

      // Only users can update their profiles
      if (!myId) {
        return handleError(
          "credentials",
          "You must be authenticated to update a profile."
        );
      }

      const user = await models.User.findOne({ where: { id: myId } });

      // Update user
      user.update({ email, name, picture });

      return { user };
    },
  },
};
