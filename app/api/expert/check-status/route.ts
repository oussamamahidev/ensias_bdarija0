import { connectToDatabase } from "@/lib/mongoose";
import { ExpertProfile } from "@/database/expert.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/database/user.model";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { isExpert: false, isVerified: false },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find the MongoDB user
    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json(
        { isExpert: false, isVerified: false },
        { status: 404 }
      );
    }

    // Check if user has an expert profile
    const expertProfile = await ExpertProfile.findOne({ user: user._id });

    if (!expertProfile) {
      return NextResponse.json({ isExpert: false, isVerified: false });
    }

    return NextResponse.json({
      isExpert: true,
      isVerified: expertProfile.isVerified,
      expertise: expertProfile.expertise,
      consultingRate: expertProfile.consultingRate,
      rating: expertProfile.rating,
      reviewCount: expertProfile.reviewCount,
    });
  } catch (error) {
    console.error("Error checking expert status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
