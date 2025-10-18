import fs from "fs";
import path from "path";
import multer from "multer";
import csv from "csv-parser";
import { fileURLToPath } from "url";
import { Product } from "../models/product.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); 
  console.log("Created uploads folder at:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
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

const uploadData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const filePath = req.file.path;
    console.log("File uploaded to:", filePath);
    console.log("Exists?", fs.existsSync(filePath));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Uploaded file not found on server" });
    }

    const results = [];
    const validRows = [];
    const missingRows = [];
    const requiredFields = ["Name", "Price", "Index"];

    console.log("Reading and parsing CSV...");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const cleanedRow = Object.fromEntries(
          Object.entries(row).map(([key, val]) => [key.trim(), val?.trim() ?? ""])
        );

        const hasMissing = requiredFields.some(
          (key) => !cleanedRow[key] || cleanedRow[key].toLowerCase() === "null"
        );

        if (hasMissing) missingRows.push(cleanedRow);
        else validRows.push(cleanedRow);

        results.push(cleanedRow);
      })
      .on("end", async () => {
        console.log(`Parsed ${results.length} rows. Valid: ${validRows.length}`);

        try {
          if (validRows.length > 0) {
            const docs = validRows.map((row) => ({
              sku: Number(row.Index),
              Name: row.Name,
              Description: row.Description || "",
              Brand: row.Brand || "",
              Category: row.Category || "",
              Price: Number(row.Price) || 0,
              Currency: row.Currency || "USD",
              Stock: Number(row.Stock) || 0,
              EAN: row.EAN ? String(row.EAN) : "",
              Color: row.Color || "",
              Size: row.Size || "",
              Availability: row.Availability || "in_stock",
              InternalID: row["Internal ID"] || "",
            }));

            await Product.insertMany(docs, { ordered: false });
          }

          res.json({
            message: "CSV processed successfully!",
            totalRows: results.length,
            savedCount: validRows.length,
            missingCount: missingRows.length,
            missingRows,
          });
        } catch (dbError) {
          console.error("Database Error:", dbError);
          res.status(500).json({
            message: "Error saving data to database",
            error: dbError.message,
          });
        } finally {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
            else console.log("Deleted uploaded file:", filePath);
          });
        }
      })
      .on("error", (err) => {
        console.error("CSV Read Error:", err);
        res.status(500).json({ message: "Error reading file", error: err.message });
      });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { upload, uploadData };
