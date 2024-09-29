import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import ForgotPwdReq from "../models/forgot-pwd-req";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Sib from "sib-api-v3-sdk";

interface AuthenticatedRequest extends Request {
  user?: any;
}

function generateToken(id: string, name: string) {
  return jwt.sign({ user_id: id, name }, process.env.TOKEN_SECRET_KEY as string);
}

export const createUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email, name } = req.body;
    const saltrounds = parseInt(process.env.SALT_ROUNDS as string, 10);
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      if (err) {
        throw new Error(err);
      }
      const instance = new User({
        name,
        username,
        password: hash,
        email,
        premium: false,
      });

      const user = await instance.save();
      res.json(user);
    });
  } catch (error) {
    res.status(502).json(error);
  }
};

export const checkUserExists = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email } = req.body;

    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
      return res
        .status(200)
        .json({ success: false, message: "Email already registered" });
    } else {
      const foundUsername = await User.findOne({ username });
      if (foundUsername) {
        return res
          .status(200)
          .json({ success: false, message: "Username already registered" });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const result = await User.findOne({ username });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      const fetchedPassword = result.password;
      bcrypt.compare(password, fetchedPassword, (err, bcryptResult) => {
        if (err) {
          throw new Error("Something went wrong");
        }
        if (bcryptResult === false) {
          res
            .status(401)
            .json({ success: false, message: "Entered password is wrong" });
        } else {
          res
            .status(200)
            .json({
              success: true,
              token: generateToken(result.id, result.name),
            });
        }
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getCheckPremium = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    res.json({ premium: user.premium });
  } catch (error) {
    res.status(400).json("Something went wrong");
  }
};

export const sendForgotPwdEmail = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "Email not found" });
  }

  const instance = new ForgotPwdReq({
    user_id: user._id,
    is_active: true,
  });
  const request = await instance.save();

  const client = Sib.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.SENDINBLUE_KEY;
  const tranEmailApi = new Sib.TransactionalEmailsApi();
  const sender = { email: "nishant.dumbre@gmail.com" };
  const receiver = [{ email }];
  try {
    await tranEmailApi.sendTransacEmail({
      sender,
      to: receiver,
      subject: "Forgot password Sharpener Expense Tracker",
      textContent: `Following is the link to reset password: http://localhost:8080/user/reset-password/${request._id.toString()}`,
    });
    res
      .status(200)
      .json({ success: true, message: "Reset link sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

export const newPasswordURL = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const result = await ForgotPwdReq.findOneAndUpdate(
      {
        _id: id,
        is_active: true,
      },
      {
        is_active: false,
      }
    );
    console.log(true);
    console.log(result);
    if (!result) {
      throw new Error("Invalid request");
    }

    res.status(200).send(`<html>
                                        <script>
                                            function formsubmitted(e){
                                                e.preventDefault();
                                                console.log('called')
                                            }
                                        </script>
    
                                        <form action="/user/update-password/${id}" method="get">
                                            <label for="newpassword">Enter New password</label>
                                            <input name="newpassword" type="password" required></input>
                                            <button>reset password</button>
                                        </form>
                                    </html>`);
    res.end();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid request" });
  }
};

export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    const request = await ForgotPwdReq.findById(resetpasswordid);
    const user = await User.findById(request.user_id);
    const saltrounds = Number(process.env.SALT_ROUNDS);

    bcrypt.hash(newpassword, saltrounds, async (err, hash) => {
      if (err) {
        console.log(err, "this is erropr");
        throw new Error("Could not change password");
      }

      await User.findByIdAndUpdate(
        user._id,
        {
          password: hash,
        },
        { new: true }
      );
      res
        .status(201)
        .json({
          success: true,
          message: "Successfuly update the new password",
        });
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Could not change password" });
  }
};
