import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validation.js";

import User from "../models/UserModel.js";
import { CustomRequest } from "../types/types.js";
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!validateEmail(email)) {
      res.status(400).json({
        status: "fail",
        message: "Invalid email",
      });
      return;
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() });

    if (emailExists) {
      res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
      { _id: user.id, userType: user.userType },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { _id: user.id, userType: user.userType },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await user.save();

    res.status(201).json({
      status: "success",
      message: "Added User",
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

// export const googleRegister = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { accessToken: googleAccessToken, phoneNumber } = req.body;
//     const clientIp =
//       req.headers["cf-connecting-ip"] ||
//       req.headers["x-forwarded-for"] ||
//       req.ip;

//     if (!googleAccessToken) {
//       res.status(400).json({ status: "fail", message: "ID token is required" });
//       return;
//     }

//     const response = await axios.get(
//       "https://www.googleapis.com/oauth2/v3/userinfo",
//       {
//         headers: {
//           Authorization: `Bearer ${googleAccessToken}`,
//         },
//       }
//     );

//     const { email, name, picture, sub: googleId } = response.data;

//     if (!email || !name || !googleId) {
//       res.status(400).json({
//         status: "fail",
//         message: "Incomplete information from Google",
//       });
//       return;
//     }

//     // Check if the user already exists in the database
//     let user = await User.findOne({ email });

//     if (!user) {
//       // Register new user
//       const hashedPassword = await bcrypt.hash(googleId, 10);
//       if (!phoneNumber) {
//         res
//           .status(400)
//           .json({ status: "fail", message: "Phone number is required" });
//         return;
//       }

//       const usernameExists = await User.findOne({
//         username: name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(),
//       });

//       const cleanName = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

//       let newUsername = usernameExists
//         ? generateUsername()
//             .replace(/[^a-zA-Z0-9]/g, "")
//             .toLowerCase()
//         : cleanName;

//       // Ensure newUsername is at least 4 characters and at most 20 characters
//       newUsername = newUsername.slice(0, 20);
//       if (newUsername.length < 4) {
//         newUsername = newUsername.padEnd(4, "0"); // Add trailing zeros if too short
//       }

//       user = new User({
//         email,
//         username: newUsername,
//         firstName: name.split(" ")[0] || name, // First word as first name
//         lastName: name.split(" ")[1] || "", // Rest as last name if available
//         googleId,
//         password: hashedPassword,
//         phoneNumber: phoneNumber,
//         emailIsVerified: true,
//         loginMethod: "google",
//         ipAddress: clientIp,
//       });
//       await user.save();
//     }

//     // Generate tokens
//     const accessToken = jwt.sign(
//       { _id: user.id, userType: user.userType, username: user.username },
//       process.env.JWT_SECRET!,
//       { expiresIn: "15m" }
//     );

//     const refreshToken = jwt.sign(
//       { _id: user.id, userType: user.userType },
//       process.env.JWT_SECRET!,
//       { expiresIn: "7d" }
//     );

//     // Set refresh token in a secure cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     trackFacebookEvent(user, "UserRegistered", {}, req);

//     res.status(200).json({
//       status: "success",
//       message: "User successfully logged in or registered via Google",
//       accessToken,
//     });
//   } catch (error) {
//     console.error("Error in Google registration:", error);
//     res.status(500).json({ status: "error", message: "Internal Server Error" });
//   }
// };

// export const googleLogin = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { accessToken: googleAccessToken } = req.body;
//     const clientIp =
//       req.headers["cf-connecting-ip"] ||
//       req.headers["x-forwarded-for"] ||
//       req.ip;

//     console.log("client ip is", clientIp);
//     if (!googleAccessToken) {
//       res.status(400).json({ status: "fail", message: "ID token is required" });
//       return;
//     }

//     const response = await axios.get(
//       "https://www.googleapis.com/oauth2/v3/userinfo",
//       {
//         headers: {
//           Authorization: `Bearer ${googleAccessToken}`,
//         },
//       }
//     );

//     const { email, sub: googleId } = response.data;

//     if (!email || !googleId) {
//       res.status(400).json({
//         status: "fail",
//         message: "Incomplete information from Google",
//       });
//       return;
//     }

//     // Check if the user already exists in the database
//     const user = await User.findOneAndUpdate(
//       { email },
//       {
//         googleId,
//         ipAddress: clientIp,
//       },
//       { new: true }
//     );

//     if (!user) {
//       res.status(404).json({
//         status: "fail",
//         message: "User not found, please register",
//       });
//       return;
//     }

//     // Generate tokens
//     const accessToken = jwt.sign(
//       { _id: user.id, userType: user.userType, username: user.username },
//       process.env.JWT_SECRET!,
//       { expiresIn: "15m" }
//     );

//     const refreshToken = jwt.sign(
//       { _id: user.id, userType: user.userType },
//       process.env.JWT_SECRET!,
//       { expiresIn: "7d" }
//     );

//     // Set refresh token in a secure cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     trackFacebookEvent(user, "UserLoggedIn", {}, req);

//     res.status(200).json({
//       status: "success",
//       message: "User successfully logged in via Google",
//       accessToken,
//     });
//   } catch (error) {
//     console.error("Error in Google login:", error);
//     res.status(500).json({ status: "error", message: "Internal Server Error" });
//   }
// };

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "Invalid email or password",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(404).json({
        status: "fail",
        message: "Invalid email or password",
      });
      return;
    }

    const accessToken = jwt.sign(
      { _id: user.id, userType: user.userType },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { _id: user.id, userType: user.userType },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;

    const clientIp =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.ip;
    if (!refreshToken) {
      res.status(400).json({
        status: "fail",
        message: "Refresh token is required",
      });
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!,
      async (err, decoded: any) => {
        if (err) {
          res.status(403).json({
            status: "fail",
            message: "Invalid or expired refresh token",
          });
          return;
        }

        const user = await User.findByIdAndUpdate(
          decoded._id,
          {
            ipAddress: clientIp,
          },
          {
            new: true,
          }
        );

        if (!user) {
          res.status(404).json({
            status: "fail",
            message: "User not found",
          });
          return;
        }

        const newAccessToken = jwt.sign(
          { _id: user.id, userType: user.userType },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" }
        );

        res.status(200).json({
          status: "success",
          message: "Access token refreshed successfully",
          accessToken: newAccessToken,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

export const updateUser = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({
        status: "fail",
        message: "Invalid email",
      });
      return;
    }

    const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
    if (emailExists) {
      res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

export const changePassword = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      res.status(400).json({
        status: "fail",
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter and one number",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      res.status(400).json({
        status: "fail",
        message: "Invalid old password",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

export const getProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

export const getUsersBasedOnSearch = async (req: Request, res: Response) => {
  try {
    const { search } = req.body;
    const users = await User.find({
      $or: [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ],
    })
      .select("email firstName lastName phoneNumber")
      .limit(5);
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};
