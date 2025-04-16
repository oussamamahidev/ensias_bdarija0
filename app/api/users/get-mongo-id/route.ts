import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // Get the clerkId from the query parameters
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json(
        { error: "Missing clerkId parameter" },
        { status: 400 }
      );
    }

    // Verify the user is authenticated and requesting their own ID
    const { userId: authenticatedClerkId } = await auth();

    if (!authenticatedClerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (clerkId !== authenticatedClerkId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by clerkId
    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the MongoDB user ID
    return NextResponse.json({ mongoUserId: user._id.toString() });
  } catch (error) {
    console.error("Error fetching MongoDB user ID:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
