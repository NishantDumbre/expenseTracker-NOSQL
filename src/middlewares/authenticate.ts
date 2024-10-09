import jwt from "jsonwebtoken";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string | undefined = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token is missing" });
    }

    const tokenData = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY as string
    ) as { user_id: string };
    const user = await User.findById(tokenData.user_id);

    req.user = user;
    console.log("Authenticated");
    next();
  } catch (error) {
    res.status(401).json({ success: "Not authenticated" });
  }
};

export default authenticate