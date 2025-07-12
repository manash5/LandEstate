import { User } from "../../models/index.js";
import { generateToken } from "../../security/jwt-util.js";

const login = async (req, res) => {
  try {
    //fetching all the data from users table
    if (req.body.email == null) {
      return res.status(500).send({ message: "email is required" });
    }
    if (req.body.password == null) {
      return res.status(500).send({ message: "email is required" });
    }
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(500).send({ message: "user not found" });
    }
    if (user.password == req.body.password) {
      const token = generateToken({ user: user.toJSON() });
      return res.status(200).send({
        data: { access_token: token },
        message: "successfully logged in",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to login" });
  }
};

/**
 *  init
 */

const init = async (req, res) => {
  try {
    console.log('Init endpoint called');
    console.log('req.user:', req.user);
    
    if (!req.user) {
      console.error('No user found in request');
      return res.status(401).json({ error: "No user found in request" });
    }
    
    if (!req.user.user) {
      console.error('No user data in req.user:', req.user);
      return res.status(401).json({ error: "Invalid user data structure" });
    }
    
    const user = req.user.user;
    console.log('User data:', user);
    
    delete user.password;
    res
      .status(200)
      .send({ data: user, message: "successfully fetched current user" });
  } catch (e) {
    console.error('Error in init endpoint:', e);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const authController = {
  login,
  init,
};
