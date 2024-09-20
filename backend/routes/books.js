const express = require("express");
const router = express.Router();
const db = require("../db");
const { isValidCatboxUrl } = require("../lib/url");

router.get("/all", async (req, res) => {
  try {
    const data = await db.book.findMany({
      select: { id: true, title: true, imgUrl: true, link: true },
    });
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching books: ", err);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/add", async (req, res) => {
  const { cookie, title, imgUrl, link } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!title) {
    res.status(400).json("Book title is required");
  } else if (!imgUrl) {
    res.status(400).json("Book image url is required");
  } else if (!link) {
    res.status(400).json("Book link is required");
  } else if (!isValidCatboxUrl(link)) {
    res.status(400).json("Book link should be a valid catbox url");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const boo = await db.book.findFirst({ where: { title } });
        if (boo) {
          res.status(400).json("Book already exists");
        } else {
          await db.book.create({
            data: {
              title,
              imgUrl,
              link,
            },
          });
          res.status(200).json("Book Created");
        }
      }
    } catch (err) {
      console.error("Error adding book: ", err);
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
    res.status(400).json("Book id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const boo = await db.book.findFirst({ where: { id } });
        if (!boo) {
          res.status(400).json("Book doesn't exist");
        } else {
          await db.book.delete({
            where: { id },
          });
          res.status(200).json("Book Deleted");
        }
      }
    } catch (err) {
      console.error("Error deleting book: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/edit", async (req, res) => {
  const { cookie, id, title, imgUrl, link } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Book id is required");
  } else if (!title) {
    res.status(400).json("Book title is required");
  } else if (!imgUrl) {
    res.status(400).json("Book image url is required");
  } else if (!link) {
    res.status(400).json("Book link is required");
  } else if (!isValidCatboxUrl(link)) {
    res.status(400).json("Book link should be a valid catbox url");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const boo = await db.book.findFirst({ where: { id } });
        if (!boo) {
          res.status(400).json("Book doesn't exist");
        } else {
          await db.book.update({
            where: { id },
            data: {
              title,
              imgUrl,
              link,
            },
          });
          res.status(200).json("Book edited");
        }
      }
    } catch (err) {
      console.error("Error editing book: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
