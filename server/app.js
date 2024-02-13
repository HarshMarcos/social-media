import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./route/authRoute.js";
import errorMiddleware from "./middleware/errorMiddleware.js"

config();

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);

app.all("*", (req, res) => {
  res.status(404).json("Oops!! Page not found!");
});

app.use(errorMiddleware);

export default app;
