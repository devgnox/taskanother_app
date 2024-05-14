import { NextResponse, NextRequest } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId: sessionUserId, orgId } = auth();

  if (!sessionUserId || !orgId) {
    console.error("Unauthorized request");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    let user;

    if (params.userId === sessionUserId) {
      user = await currentUser();
    } else {
      user = await clerkClient.users.getUser(params.userId);
    }

    if (!user) return new NextResponse("User Not found", { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
