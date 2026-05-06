import express from "express";
import cors from "cors";
import { agent } from "./agent.js";

const app = express();
const port = 3001;

app.use(express.json()); // bertujuan untuk membaca request berupa JSON seperti method (get, post)
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// post prompt user
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, thread_id } = req.body;
    const threadId = thread_id || crypto.randomUUID();

    const result = await agent.invoke(
      {
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        configurable: { thread_id: threadId }
      }
    );

    const aiMessage = result.messages.at(-1);

    res.json({
      success: true,
      data: aiMessage.content,
      thread_id: threadId,
      timestamp: Date.now()
    });

  } catch (err) {
    console.error("Error in post generate: ", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port (${port})`);
})