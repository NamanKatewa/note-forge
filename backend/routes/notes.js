const express = require("express");
const router = express.Router();
const db = require("../db");
const { isValidCatboxUrl } = require("../lib/url");

router.post("/subject", async (req, res) => {
  const { subjectId } = req.body;
  if (!subjectId) {
    res.status(400).json("Id is required");
  } else {
    try {
      const data = await db.note.findMany({
        where: { subjectId },
      });
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(400).json("Not Found");
      }
    } catch (err) {
      console.error("Error fetching notes: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/add", async (req, res) => {
  const { cookie, title, content, link, subjectId } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!title) {
    res.status(400).json("Note title is required");
  } else if (!link) {
    res.status(400).json("Note link is required");
  } else if (!subjectId) {
    res.status(400).json("Subject id is required");
  } else if (!content) {
    res.status(400).json("Note content is required");
  } else if (!isValidCatboxUrl(link)) {
    res.status(400).json("Note link should be a valid catbox url");
  } else {
    try {
      await db.note.create({
        data: {
          title,
          content,
          link,
          subject: { connect: { id: subjectId } },
          user: { connect: { id: data.userId } },
        },
      });
      res.status(200).json("Note Created");
    } catch (err) {
      console.error("Error adding Note: ", err);
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
    res.status(400).json("Note id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const not = await db.note.findUnique({ where: { id } });
        if (!not) {
          res.status(400).json("Note doesn't exist");
        } else {
          await db.note.delete({ where: { id } });
          res.status(200).json("Note Deleted");
        }
      }
    } catch (err) {
      console.error("Error deleting note: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/edit", async (req, res) => {
  const { cookie, id, title, content, link } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Note id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      const not = await db.note.findFirst({ where: { id } });

      if (user.role !== "admin" && not.userId !== data.userId) {
        res.status(401).json("Unauthorized");
      } else {
        if (!not) {
          res.status(400).json("Note doesn't exist");
        } else if (!isValidCatboxUrl(link)) {
          res.status(400).json("Note link should be a valid catbox url");
        } else {
          await db.note.update({
            where: { id },
            data: { title, content, link },
          });
          res.status(200).json("Note edited");
        }
      }
    } catch (err) {
      console.error("Error editing Note: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/detail", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json("Id is required");
  } else {
    try {
      const data = await db.note.findUnique({
        where: { id },
        select: {
          title: true,
          content: true,
          link: true,
          subject: {
            select: { name: true },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(400).json("Not Found");
      }
    } catch (err) {
      console.error("Error fetching note: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
