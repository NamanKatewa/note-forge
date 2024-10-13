const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/all", async (req, res) => {
  try {
    const data = await db.announcement.findMany({
      select: {
        id: true,
        title: true,
        message: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching announcements: ", err);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/add", async (req, res) => {
  const { cookie, title, message } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!title) {
    res.status(400).json("Announcement title is required");
  } else if (!message) {
    res.status(400).json("Announcement message is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        await db.announcement.create({
          data: {
            title,
            message,
          },
        });
        res.status(200).json("Announcement Created");
      }
    } catch (err) {
      console.error("Error adding announcement: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/remove", async (req, res) => {
  const { cookie, id } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Announcement id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const ann = await db.announcement.findFirst({ where: { id } });
        if (!ann) {
          res.status(400).json("Announcement doesn't exist");
        } else {
          await db.announcement.delete({
            where: { id },
          });
          res.status(200).json("Announcement Deleted");
        }
      }
    } catch (err) {
      console.error("Error deleting announcement: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/edit", async (req, res) => {
  const { cookie, id, title, message } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Announcement id is required");
  } else if (!title) {
    res.status(400).json("Announcement title is required");
  } else if (!message) {
    res.status(400).json("Announcement message is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const ann = await db.announcement.findFirst({ where: { id } });
        if (!ann) {
          res.status(400).json("Announcement doesn't exist");
        } else {
          await db.announcement.update({
            where: { id },
            data: {
              title,
              message,
            },
          });
          res.status(200).json("Announcement edited");
        }
      }
    } catch (err) {
      console.error("Error editing announcement: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
