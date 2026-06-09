import express from "express";
import notificationRouter from "./routes/notification.js";

const app = express();

app.use(express.json());

app.use("/notifications", notificationRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});