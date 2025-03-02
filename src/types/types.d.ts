import { Request } from "express";
import { IUser } from "../models/UserModel.ts";

interface CustomRequest extends Request {
  user?: IUser;
}
