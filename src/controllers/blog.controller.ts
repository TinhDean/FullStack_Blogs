import { Request, Response } from "express";
import { getAllBlogs, getAllHellos } from "../services/blog.service";

export const getBlogs = (req: Request, res: Response): void => {
  const result = getAllBlogs();

  res.status(200).json({
    data: result
  });
};

export const getHellos = (req: Request, res: Response): void => {
  const result = getAllHellos();

  res.status(200).json({
    data: result
  });
};
