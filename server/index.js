import express from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser"
import dotenv from 'dotenv';
import cors from "cors"
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

/* Confugirations */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });


const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGOURL;


mongoose
   .connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true }) 
   .then(() => {
      console.log("Database connected successfully");
      app.listen(PORT, () => {
         console.log(`Server is listening on port: ${PORT}`);
      });
   })
   .catch((error) => {
      console.error("Database connection error:", error);
   });