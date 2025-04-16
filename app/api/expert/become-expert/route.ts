import { connectToDatabase } from "@/lib/mongoose";
import { ExpertProfile } from "@/database/expert.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/database/user.model";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { expertise, bio, consultingRate } = await req.json();

    if (
      !expertise ||
      !Array.isArray(expertise) ||
      expertise.length === 0 ||
      !bio
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the MongoDB user
    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has an expert profile
    const existingProfile = await ExpertProfile.findOne({ user: user._id });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Expert profile already exists" },
        { status: 409 }
      );
    }

    // Create expert profile
    const expertProfile = await ExpertProfile.create({
      user: user._id,
      expertise,
      bio,
      consultingRate: consultingRate || 0,
      isVerified: false, // Requires admin approval
    });

    // Update user's role
    await User.findByIdAndUpdate(user._id, { $addToSet: { role: "expert" } });

    return NextResponse.json({
      success: true,
      message: "Expert profile created successfully. Awaiting verification.",
      profile: expertProfile,
    });
  } catch (error) {
    console.error("Error creating expert profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
