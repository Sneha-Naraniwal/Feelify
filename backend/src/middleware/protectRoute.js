import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      // Auto-create user if not found (replaces Inngest webhook dependency)
      if (!user) {
        try {
          const clerkUser = await clerkClient.users.getUser(clerkId);
          const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User";
          const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
          const profileImage = clerkUser.imageUrl || "";

          user = await User.create({ clerkId, name, email, profileImage });

          // Also register in Stream
          try {
            await upsertStreamUser({ id: clerkId, name, image: profileImage });
          } catch (streamErr) {
            console.warn("Stream user upsert failed (non-fatal):", streamErr.message);
          }

          console.log(`Auto-created user: ${name} (${clerkId})`);
        } catch (createErr) {
          console.error("Failed to auto-create user:", createErr.message);
          return res.status(500).json({ message: "Failed to initialize user account" });
        }
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];