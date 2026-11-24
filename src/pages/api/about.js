// This endpoint just hands back the "about" section of my profile.json
// as JSON, so anything (like a browser or another app) can ask for it.
import profile from "@/data/profile.json";

export default function handler(req, res) {
  // Only GET makes sense here since we're just reading data, nothing gets changed.
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  res.status(200).json(profile.about);
}
