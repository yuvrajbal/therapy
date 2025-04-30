import { PrismaClient } from "@prisma/client";

type fetchUserDataParams = {
  toolCallparameters: {
    userID:string;
  };
};
const prisma = new PrismaClient();

export const fetchUserData = async ({
  toolCallparameters,
}: fetchUserDataParams) => {
  const {userID} = toolCallparameters
  console.log("Fetching user data for userId", userID)
  try{
    const userData = await prisma.user.findUnique({
      where:{
        id:userID
      },
      include:{
        sessions:{
          orderBy:{
            createdAt:'desc'
          },
          select:{
            summary:true,
            createdAt:true
          }
        }
      }
    })
    if (!userData){
      return {error:"User not found"};

    }
    const {password,sessions,...userDataWithoutPassword} = userData;
    const summaries = sessions.map((session) => ({
      summary:session.summary,
      createdAt: session.createdAt
    }))
    return {
      user:userDataWithoutPassword,
      sessionCount: summaries.length,
      summaries
    }


  }catch(err){
    console.error("Error fetching user data:", err);
    return { error: "Failed to fetch user data" };
  }
  
};
