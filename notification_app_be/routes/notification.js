import { Router } from "express";
import crypto from "crypto";
import Log from "../../logging_middleware/index.js";

const router = Router();


const notifications = [];


router.get("/", async (req, res) => {
  await Log("backend", "info", "route", "Fetched notifications");

  res.status(200).json({
    notifications,
  });
});


router.get("/:id", async (req, res) => {
  const notification = notifications.find(
    (n) => n.id === req.params.id
  );

  if (!notification) {
    await Log("backend", "error", "handler", "Notification not found");

    return res.status(404).json({
      message: "Notification not found",
    });
  }

  res.status(200).json(notification);
});


router.post("/", async (req, res) => {
  const { type, message } = req.body;

  if (!type || !message) {
    await Log("backend", "error", "handler", "Missing required fields");

    return res.status(400).json({
      message: "type and message are required",
    });
  }

  const notification = {
    id: crypto.randomUUID(),
    type,
    message,
    timestamp: new Date().toISOString(),
    read: false,
  };

  notifications.push(notification);

  await Log("backend", "info", "service", "Created notification");

  res.status(201).json(notification);
});


router.patch("/:id/read", async (req, res) => {
  const notification = notifications.find(
    (n) => n.id === req.params.id
  );

  if (!notification) {
    await Log("backend", "error", "handler", "Notification not found");

    return res.status(404).json({
      message: "Notification not found",
    });
  }

  notification.read = true;

  await Log("backend", "info", "service", "Marked notification read");

  res.status(200).json(notification);
});

router.patch("/read-all", async (req, res) => {
  notifications.forEach((n) => {
    n.read = true;
  });

  await Log("backend", "info", "service", "Marked all read");

  res.status(200).json({
    message: "All notifications marked as read",
  });
});


router.delete("/:id", async (req, res) => {
  const index = notifications.findIndex(
    (n) => n.id === req.params.id
  );

  if (index === -1) {
    await Log("backend", "error", "handler", "Notification not found");

    return res.status(404).json({
      message: "Notification not found",
    });
  }

  notifications.splice(index, 1);

  await Log("backend", "info", "service", "Deleted notification");

  res.status(200).json({
    message: "Notification deleted",
  });
});

export default router;