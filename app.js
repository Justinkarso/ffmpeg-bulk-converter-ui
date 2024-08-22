const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const http = require("http");
const socketIo = require("socket.io");
const { exec } = require("child_process");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = "uploads";
const OUTPUT_DIR = path.join(__dirname, "output");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "client/dist")));
app.use("/output", express.static(OUTPUT_DIR));
app.use(express.json());

fs.existsSync(OUTPUT_DIR) || fs.mkdirSync(OUTPUT_DIR);

app.post("/api/upload", upload.array("videos"), (req, res) => {
  if (!req.files?.length)
    return res.status(400).json({ error: "No files uploaded." });

  res.json({
    message: "Files uploaded successfully",
    files: req.files.map((f) => ({ name: f.originalname, path: f.path })),
  });
});

app.post("/api/convert", (req, res) => {
  const { files, outputFormat } = req.body;
  if (!files?.length)
    return res.status(400).json({ error: "No files to convert." });

  let completedConversions = 0;
  const results = [];

  files.forEach((file, index) => {
    const inputPath = file.path;
    const outputPath = path.join(
      OUTPUT_DIR,
      `${path.parse(file.name).name}.${outputFormat}`
    );

    ffmpeg(inputPath)
      .outputOptions("-c:v", "libx264")
      .outputOptions("-c:a", "aac")
      .output(outputPath)
      .on("progress", (progress) => {
        io.emit("conversionProgress", {
          file: file.name,
          index,
          percent: progress.percent,
        });
      })
      .on("end", () => {
        results.push({ name: file.name, status: "success" });
        fs.unlinkSync(inputPath);
        if (++completedConversions === files.length) {
          res.json({ message: "All conversions completed", results });
        }
      })
      .on("error", (err) => {
        console.error(`Error converting ${file.name}: ${err.message}`);
        results.push({ name: file.name, status: "error", error: err.message });
        fs.unlinkSync(inputPath);
        if (++completedConversions === files.length) {
          res.json({
            message: "Conversions completed with some errors",
            results,
          });
        }
      })
      .run();
  });
});

app.get("/api/videos", async (req, res) => {
  try {
    const files = await fsp.readdir(OUTPUT_DIR);
    const videos = files.filter((file) =>
      [".mp4", ".webm", ".avi"].includes(path.extname(file).toLowerCase())
    );
    res.json(videos);
  } catch (error) {
    console.error("Error reading output directory:", error);
    res.status(500).json({ error: "Failed to retrieve video list" });
  }
});

app.get("/api/open-file-location/:filename", (req, res) => {
  const filePath = path.join(OUTPUT_DIR, req.params.filename);
  const command = process.platform === "win32" ? "explorer" : "open";

  exec(`${command} "${path.dirname(filePath)}"`, (error) => {
    if (error) {
      console.error("Error opening file location:", error);
      return res.status(500).json({ error: "Failed to open file location" });
    }
    res.json({ message: "File location opened successfully" });
  });
});

app.post("/api/convert-to-audio", (req, res) => {
  const { files } = req.body;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files to convert." });
  }

  let completedConversions = 0;
  const totalFiles = files.length;
  const results = [];

  files.forEach((file) => {
    const inputPath = file.path;
    const outputPath = path.join(
      OUTPUT_DIR,
      `${path.parse(file.name).name}.mp3`
    );

    ffmpeg(inputPath)
      .outputOptions("-vn")
      .outputOptions("-acodec", "libmp3lame")
      .outputOptions("-ac", "2")
      .outputOptions("-ab", "160k")
      .outputOptions("-ar", "48000")
      .output(outputPath)
      .on("progress", (progress) => {
        io.emit("conversionProgress", {
          file: file.name,
          percent: progress.percent,
        });
      })
      .on("end", () => {
        completedConversions++;
        results.push({ name: file.name, status: "success" });
        if (completedConversions === totalFiles) {
          res.json({ message: "All conversions completed", results });
        }
        fs.unlinkSync(inputPath);
      })
      .on("error", (err) => {
        console.error(
          `An error occurred with file ${file.name}: ${err.message}`
        );
        completedConversions++;
        results.push({ name: file.name, status: "error", error: err.message });
        if (completedConversions === totalFiles) {
          res.json({
            message: "Conversions completed with some errors",
            results,
          });
        }
        fs.unlinkSync(inputPath);
      })
      .run();
  });
});

app.get("/api/audio", async (req, res) => {
  try {
    const files = await fsp.readdir(OUTPUT_DIR);
    const audios = files.filter((file) =>
      [".mp3", ".wav", ".ogg"].includes(path.extname(file).toLowerCase())
    );
    res.json(audios);
  } catch (error) {
    console.error("Error reading audio output directory:", error);
    res.status(500).json({ error: "Failed to retrieve audio list" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
