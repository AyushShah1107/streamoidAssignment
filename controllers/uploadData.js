import fs from "fs";
import path from "path";
import multer from "multer";
import csv from "csv-parser";

// Get absolute path for the uploads folder
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure the folder exists before Multer runs
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Controller
const uploadData = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const filePath = req.file.path;
    const results = [];
    const missingRows = [];
    const requiredFields = ["Name", "Price", "Index"];

    console.log("Reading file from:", filePath);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
        const hasMissing = requiredFields.some(
          (key) => !row[key] || row[key].trim() === "" || row[key].toLowerCase() === "null"
        );
        if (hasMissing) missingRows.push(row);
      })
      .on("end", () => {
        res.json({
          message: "CSV uploaded and checked successfully!",
          totalRows: results.length,
          missingCount: missingRows.length,
          missingRows,
        });
      })
      .on("error", (err) => {
        console.error("Error reading file:", err);
        res.status(500).json({ message: "Error reading file", error: err.message });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { upload, uploadData };
