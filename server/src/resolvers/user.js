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
    getNewestUsers: (_, __, { models, req }) => {
      const myId = req.session.userId;

      // Return null if not logged in
      if (!myId) return null;

      return models.User.findAll({
        limit: 30,
        order: [["createdAt", "DESC"]],
      });
    },

    /**
     * Get all users that follow ID.
     * @param {string} id - User ID.
     * @returns an array of users that follow ID.
     */
    getAllFollowersById: async (_, { id }, { models }) => {
      const user = await models.User.findOne({
        where: { id },
        include: {
          model: models.User,
          as: "following",
        },
        // order: [["createdAt", "DESC"]],
      });

      if (!user) {
        return [];
      }

      return user.following;
    },

    /**
     * Get all users that ID is following.
     * @param {string} id - User ID.
     * @returns an array of users that ID is following.
     */
    getAllFollowingById: async (_, { id }, { models }) => {
      const user = await models.User.findOne({
        where: { id },
        include: {
          model: models.User,
          as: "follower",
        },
        order: [["createdAt", "DESC"]],
      });

      if (!user) {
        return [];
      }

      return user.follower;
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

        // No one deserves to be alone: Befriend Alex on sign up
        await models.Follow.create({
          followerId: user.id,
          followingId: "1", // Alex's ID
        });

        // Receive initial messages from your new friend, Alex
        await models.Message.create({
          senderId: "1",
          recipientId: user.id,
          body: "Howdy 👋🏼",
        });

        await models.Message.create({
          senderId: "1",
          recipientId: user.id,
          body: "Welcome to Slide. A portfolio, semi-production ready messaging app that displays my skills.",
        });

        await models.Message.create({
          senderId: "1",
          recipientId: user.id,
          body: "You've probably used Whatsapp, WeChat or even iMessage. You'll find this to be quite similar.",
        });

        await models.Message.create({
          senderId: "1",
          recipientId: user.id,
          body: "You can add friends from the New Users tab and spark conversations.",
        });

        await models.Message.create({
          senderId: "1",
          recipientId: user.id,
          body: "P.S. If you're a potential employer. Hire me 😜",
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

    /**
     * Destroy and thus log user out, by destroying their
     * session/deleting their cookie.
     */
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

    /**
     * Update user's profile
     * @param {string} email - User email.
     * @param {string} name - User name.
     * @param {string} picture - image URL, src compatible.
     * @returns an user instance with the updated fields.
     */
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

    /**
     * Follow user of ID passed
     * @param {string} id -
     * @returns true if successfully followed.
     */
    followUser: async (_, { id }, { models, req }) => {
      const myId = req.session.userId;

      if (id === myId) {
        return handleError("id", "You can't follow yourself.");
      }

      const isFollowed = await models.Follow.findOne({
        where: {
          followerId: myId,
          followingId: id,
        },
      });

      if (isFollowed) {
        return handleError("id", "User already followed.");
      }

      // Create relation between users
      await models.Follow.create({
        followerId: myId,
        followingId: id,
      });

      return {
        success: true,
      };
    },

    /**
     * Unfollow user of ID passed
     * @param {string} id -
     * @returns true if successfully unfollowed.
     */
    unfollowUser: async (_, { id }, { models, req }) => {
      const myId = req.session.userId;

      const isFollowed = await models.Follow.findOne({
        where: {
          followerId: myId,
          followingId: id,
        },
      });

      if (!isFollowed) {
        return handleError("id", "User isn't followed.");
      }

      // Destroy relation between users
      await models.Follow.destroy({
        where: {
          followerId: myId,
          followingId: id,
        },
      });

      return {
        success: true,
      };
    },
  },
};
