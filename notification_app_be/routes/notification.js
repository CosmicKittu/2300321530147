import { Router } from "express";
import crypto from "crypto";
import Log from "../../logging_middleware/index.js";
import db from "../db/database.js";

const router = Router();

const mapNotification = (row) => ({
    id: row.id,
    type: row.type,
    message: row.message,
    read: !!row.is_read,
    timestamp: row.created_at,
});

router.get("/", async (req, res) => {
    const rows = db.prepare("SELECT * FROM notifications ORDER BY created_at DESC").all();
    const notifications = rows.map(mapNotification);

    await Log("backend", "info", "route", "Fetched notifications from DB");

    res.status(200).json({
        notifications,
    });
});

router.get("/:id", async (req, res) => {
    const row = db.prepare("SELECT * FROM notifications WHERE id = ?").get(req.params.id);

    if (!row) {
        await Log("backend", "error", "handler", "Notification not found in DB");

        return res.status(404).json({
            message: "Notification not found",
        });
    }

    res.status(200).json(mapNotification(row));
});

router.post("/", async (req, res) => {
    const { type, message } = req.body;

    if (!type || !message) {
        await Log("backend", "error", "handler", "Missing required fields");

        return res.status(400).json({
            message: "type and message are required",
        });
    }

    const id = crypto.randomUUID();
    db.prepare("INSERT INTO notifications (id, type, message) VALUES (?, ?, ?)").run(id, type, message);

    const row = db.prepare("SELECT * FROM notifications WHERE id = ?").get(id);

    await Log("backend", "info", "service", "Created notification in DB");

    res.status(201).json(mapNotification(row));
});

router.patch("/:id/read", async (req, res) => {
    const info = db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ?").run(req.params.id);

    if (info.changes === 0) {
        await Log("backend", "error", "handler", "Notification not found to mark read");

        return res.status(404).json({
            message: "Notification not found",
        });
    }

    const row = db.prepare("SELECT * FROM notifications WHERE id = ?").get(req.params.id);

    await Log("backend", "info", "service", "Marked notification read in DB");

    res.status(200).json(mapNotification(row));
});

router.patch("/read-all", async (req, res) => {
    db.prepare("UPDATE notifications SET is_read = 1").run();

    await Log("backend", "info", "service", "Marked all read in DB");

    res.status(200).json({
        message: "All notifications marked as read",
    });
});

router.delete("/:id", async (req, res) => {
    const info = db.prepare("DELETE FROM notifications WHERE id = ?").run(req.params.id);

    if (info.changes === 0) {
        await Log("backend", "error", "handler", "Notification not found to delete");

        return res.status(404).json({
            message: "Notification not found",
        });
    }

    await Log("backend", "info", "service", "Deleted notification from DB");

    res.status(200).json({
        message: "Notification deleted",
    });
});

export default router;