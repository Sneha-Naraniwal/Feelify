import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import { inngest, functions } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

const __dirname = path.resolve();

/// middleware
app.use(express.json());

app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true
}));

app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);


/// -------- NEW CODE RUN API --------
app.post("/api/run", async (req, res) => {
  const { code, language } = req.body;

  try {

    const languageMap = {
      javascript: { language: "nodejs", versionIndex: "4" },
      python: { language: "python3", versionIndex: "4" },
      java: { language: "java", versionIndex: "4" }
    };

    const selected = languageMap[language] || languageMap.javascript;

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        script: code,
        language: selected.language,
        versionIndex: selected.versionIndex,
        clientId: process.env.JD_CLIENT_ID,
        clientSecret: process.env.JD_CLIENT_SECRET
      })
    });

    const data = await response.json();

    console.log("JDoodle response:", data);

    res.json({
      output: data.output || "No output"
    });

  } catch (error) {

    console.error("Execution error:", error);

    res.status(500).json({
      output: "Code execution failed"
    });

  }
});
/// -------- END OF RUN API --------


app.get("/health", (req, res) => {
  res.status(200).json({ msg: "Success from api" });
});


/// For deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist/index.html")
    );
  });

} else {

  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));

}

const startServer = async () => {
  try {

    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log("Server is reachable on port", ENV.PORT);
    });

  } catch (err) {

    console.log("Error in starting server", err);
    process.exit(1);

  }
};

startServer();