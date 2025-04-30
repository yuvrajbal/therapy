import { Request, Response } from "express";
import { fetchUserData } from "../tools/fetchUserData";

export const getUserDataHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userID = req.params.userID;
  console.log(typeof(userID))
  try {
    const userData = await fetchUserData({
      toolCallparameters: {
        userID
      }
    });
    
    if (userData.error) {
      return res.status(404).json({ error: userData.error });
    }
    
    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error in user endpoint:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}; 