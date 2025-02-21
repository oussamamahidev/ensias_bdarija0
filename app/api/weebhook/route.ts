import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, generateUniqueUsername, updateUser } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing WEBHOOK_SECRET");
    return new Response("Missing WEBHOOK_SECRET", {
      status: 500,
    });
  }

  // Get the headers
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Missing svix headers", {
      status: 400,
    });
  }

  try {
    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new SVIX instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    // Verify the payload with the headers
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, image_url, first_name, last_name } = evt.data;
      
      try {
        const username = await generateUniqueUsername(first_name || '', last_name || '');
        
        const mongoUser = await createUser({
          clerkId: id,
          name: `${first_name || ''}${last_name ? ` ${last_name}` : ''}`.trim(),
          username,
          email: email_addresses[0]?.email_address,
          picture: image_url,
        });

        return NextResponse.json({ message: "User created successfully", user: mongoUser });
      } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, image_url, first_name, last_name } = evt.data;
      
      try {
        const username = await generateUniqueUsername(first_name || '', last_name || '');
        
        const mongoUser = await updateUser({
          clerkId: id,
          updateData: {
            name: `${first_name || ''}${last_name ? ` ${last_name}` : ''}`.trim(),
            username: username,
            email: email_addresses[0]?.email_address,
            picture: image_url,
          },
          path: `/profile/${id}`,
        });

        return NextResponse.json({ message: "User updated successfully", user: mongoUser });
      } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      
      try {
        const deletedUser = await deleteUser({
          clerkId: id!,
        });
        return NextResponse.json({ message: "User deleted successfully", user: deletedUser });
      } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", {
      status: 400,
    });
  }
}