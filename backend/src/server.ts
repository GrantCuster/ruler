import express, { Application, Request, Response } from "express";
import fs from "fs";

const app: Application = express();

app.use(express.json());

app.get("/example", (req: Request, res: Response): void => {
  res.status(200).json({ message: "Hello from TypeScript backend!" });
});

// Endpoint to upload canvas data URL
app.post("/api/upload", (req: Request, res: Response): void => {
  const { dataUrl, filename } = req.body;

  if (!dataUrl || !filename) {
    res.status(400).json({ error: "Missing dataUrl or filename in request" });
  }

  // Extract base64 data from the Data URL
  const matches = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    res.status(400).json({ error: "Invalid data URL" });
  }

  const fileType = matches[1]; // e.g., 'png'
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  // Save the file
  const filePath = `uploads/${filename}.${fileType}`;
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ error: "Failed to save file" });
    }

    console.log(`File saved: ${filePath}`);
    res.json({ message: "File uploaded successfully", path: filePath });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
