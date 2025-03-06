const express = require("express");
const AWS = require("aws-sdk");

const PORT = 8000;

const app = express();

app.use(express.json());

const s3 = new AWS.S3({
  accessKeyId: "<YOUR_AwsAccessKey_HERE>",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  region: "us-east-1",
  endpoint: "XXXXXXXXXXXXXXXXXXXXX",
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

app.post("/generate", (req, res) => {
  const randomNumber = Math.floor(Math.random() * 1000);

  res.json({ randomNumber });
});

app.get("/video", async (req, res) => {
  const videId = req.query.videId;

  if (!videId) {
    return res.status(400).json({ error: "videId is required" });
  }

  const params = {
    Bucket: "your-bucket-name",
    key: videId,
  };
  try {
    const s3Stream = s3.getObject(params).createReadStream();
    res.setHeader("Content-Type", "video/mp4");
    console.log();
    wislongto("res", res);
    s3Stream.pipe(res);
  } catch (error) {
    console.error("Error generating signed URL", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

descible;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
