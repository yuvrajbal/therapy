import prisma from "../../lib/prisma";
import { EndOfCallReportPayload } from "../types/vapi.types";
// const prisma = new PrismaClient();
export const sendUserData = async(payload: EndOfCallReportPayload) => {
  try {
    console.log("Processing user data from call");
    
    
  
    // Check if email already exists to avoid unique constraint violations
    const existingUser = await prisma.user.findUnique({
      where: {
        email: "user@example.com"
      }
    });
    
    let user;
    if (existingUser) {
      console.log('Using existing user:');
      user = existingUser;
    } else {
      // Extract user information from payload if available
      // For now using a default user - in a real app you'd identify the actual user
      user = await prisma.user.create({
        data: {
          name: "User from Call",
          email: "user@example.com", 
          password: "hashedpassword"
        }
      });
      console.log('User created:', user);
    }
  
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        transcript: payload.transcript || "",
        summary: payload.summary || ""
      }
    });
    return {user, session}
  } catch (prismaError) {
    console.error('Error interacting with Prisma:', prismaError);
    if (prismaError instanceof Error) {
      console.error('Error name:', prismaError.name);
      console.error('Error message:', prismaError.message);
      console.error('Error stack:', prismaError.stack);
    }
    return null;
  }
}