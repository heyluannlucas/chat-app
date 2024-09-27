import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: process.env.ORIGIN, // Aceita uma única origem
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Métodos permitidos
    credentials: true, // Permite cookies
}));

app.use(cookieParser());
app.use(express.json());

// Middleware para lidar com OPTIONS
app.options('*', cors()); // Permite todas as opções CORS

app.use("/api/auth", authRoutes);

const server = app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});

mongoose.connect(databaseURL)
    .then(() => console.log('DB connected'))
    .catch(err => console.error('DB connection error:', err));
