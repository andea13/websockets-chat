import { User } from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import fs from "fs/promises";
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";
// import { nanoid } from "nanoid";

dotenv.config();

const { SECRET_KEY, JWT_EXPIRES_IN } = process.env;

export const test = async (req, res, next) => {
  res.json("Test route is working!");
};

export const registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user) {
      return next(
        HttpError(
          409,
          "Username has been already used! Please try another one."
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    console.log(newUser);

    await newUser.save();

    const comparePassword = await bcrypt.compare(password, newUser.password);
    if (!comparePassword) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: newUser._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });

    await User.findByIdAndUpdate(newUser._id, { token });
    res.status(200).json({
      token,
      user: {
        username: newUser.username,
      },
    });
  } catch (err) {
    next(err);
  }
};
