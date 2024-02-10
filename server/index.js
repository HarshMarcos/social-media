import { config } from "dotenv";
import app from "./app.js";
import connectdb from "./config/db.js";
config();

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  await connectdb();
  console.log(`Sever is listening on ${port}`);
});
