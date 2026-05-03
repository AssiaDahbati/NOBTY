const Notification = require("../models/Notification");

async function sendNotification(
  req,
  {
    recipient,
    sender = null,
    title,
    message,
    type = "system",
    relatedId = null,
    remindAt = null,
  }
) {
  const notification = await Notification.create({
    recipient,
    sender,
    title,
    message,
    type,
    relatedId,
    remindAt,
  });

  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");

  if (io && onlineUsers) {
    const socketId = onlineUsers.get(String(recipient));
    if (socketId) {
      io.to(socketId).emit("new_notification", notification);
    }
  }

  return notification;
}

module.exports = sendNotification;