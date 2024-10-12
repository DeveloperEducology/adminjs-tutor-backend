import fastify from "fastify";
import { Student, Tutor } from "../../models/user.js";
import jwt from "jsonwebtoken";
import axios from "axios";

let storedOtp = null;
let orderId = null;
let phoneNumber = null;

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  return;
};

export const loginStudent = async (req, reply) => {
  try {
    const { phoneNumber } = req.body;

    // Check if the student exists or create a new one
    let student = await Student.findOne({ phoneNumber });
    if (!student) {
      student = new Student({
        phoneNumber,
        role: "Student",
        isActivated: true,
      });
      await student.save();
    }

    // Send OTP via external API
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/send",
      {
        phoneNumber,
        otpLength: 4,
        channel: "SMS",
        expiry: 600,
      },
      {
        headers: {
          clientId: process.env.OTP_LESS_CLIENTID,
          clientSecret: process.env.OTP_LESS_CLIENTSECRET,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract orderId and otp from the response
    const orderId = response.data.orderId; // Local variable declaration
    const storedOtp = response.data.otp; // Local variable declaration, handle securely if needed

    // Respond with success and orderId
    reply.send({ orderId, success: true });
  } catch (error) {
    // Log the error with more secure checks
    console.log(error);
    console.error("Error sending OTP:", error?.response?.data || error.message);

    // Respond with the appropriate error message and status
    reply.status(error?.response?.status || 500).send({
      success: false,
      message: error?.response?.data?.message || error.message,
    });
  }
};

export const verifyOTP = async (req, reply) => {
  const { otp } = req.body;

  try {
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/verify",
      {
        orderId: orderId,
        otp: otp,
        phoneNumber: phoneNumber, // Include phone number
      },
      {
        headers: {
         clientId: process.env.OTP_LESS_CLIENTID,
          clientSecret: process.env.OTP_LESS_CLIENTSECRET,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response veife", response.data.isOTPVerified);
    if (response.data.isOTPVerified) {
      let user = await UserModel.findOne({ phoneNumber });

      if (!user) {
        // If the user doesn't exist, create a new one
        user = new UserModel({ phoneNumber });
        await user.save();
      }

      // Generate a JWT token
      const token = jwt.sign(
        { user_id: user._id, phoneNumber: user.phoneNumber },
        process.env.TOKEN_KEY,
        { expiresIn: "2w" }
      );

      const userWithoutSensitiveInfo = {
        ...user.toObject(),
        token,
      };
      delete userWithoutSensitiveInfo.password;

      // Clear stored OTP and orderId after successful verification
      storedOtp = null;
      orderId = null;
      console.log(userWithoutSensitiveInfo);
      reply.json({ data: userWithoutSensitiveInfo, success: true });
    } else {
      reply.status(400).json({ success: false, message: response.data.reason });
    }
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response ? error.response.data : error.message
    );
    reply.status(error.response ? error.response.status : 500).json({
      success: false,
      message: error.response ? error.response.data.message : error.message,
    });
  }
};

export const loginTutor = async (req, reply) => {
  try {
    const { email, password } = req.body;
    let Tutor = await Tutor.findOne({ email });

    if (!Tutor) {
      return reply
        .status(404)
        .send({ message: "delivery partner not found", error });
    }

    const isMatch = password === Tutor.password;

    console.log(isMatch);

    if (!isMatch) {
      return reply.status(404).send({ message: "Invalid credentials" });
    }
    console.log(Tutor);

    const accessToken = jwt.sign(
      { userId: Tutor._id, role: Tutor.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { userId: Tutor._id, role: Tutor.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // const { accessToken, refreshToken } = generateTokens(Tutor);

    return reply.send({
      message: "Login Successful",
      accessToken,
      refreshToken,
      Tutor,
    });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ message: "an error occured", error });
  }
};

export const refreshToken = async (req, reply) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return reply.status(401).send({ message: "Refresh token required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;
    if (decoded.role === "Student") {
      user = await Student.findById(decoded.userId);
    } else if (decoded.role === "Tutor") {
      user = await Tutor.findById(decoded.userId);
    } else {
      return reply.status(403).send({ message: "Invalid Role" });
    }
    if (!user) {
      return reply.status(403).send({ message: "Invalid refresh token" });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    return reply.send({
      message: "Token refreshed",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return reply.status(403).send({ message: "Invalid Refresh Token" });
  }
};

export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;
    let user;
    if (role === "Student") {
      user = await Student.findById(userId);
    } else if (role === "Tutor") {
      user = await Tutor.findById(userId);
    } else {
      return reply.status(403).send({ message: "Invalid Role" });
    }
    if (!user) {
      return reply.status(403).send({ message: "user not found" });
    }

    return reply.send({
      message: "user fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
