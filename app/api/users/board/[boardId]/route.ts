import { NextResponse, NextRequest } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    console.error("Unauthorized request");
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  try{
  let users;

      users = await clerkClient.users.getUserList({});

    if (!users) return new NextResponse("User Not found", { status: 404 });

    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
