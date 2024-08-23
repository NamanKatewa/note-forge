const express = require("express");
const router = express.Router();
const db = require("../db");
const { isValidCatboxUrl } = require("../lib/url");

router.post("/exam", async (req, res) => {
  const { examId } = req.body;
  if (!examId) {
    res.status(400).json("Id is required");
  } else {
    try {
      const data = await db.paper.findMany({
        where: { examId },
        select: {
          title: true,
          id: true,
          link: true,
          user: {
            select: {
              name: true,
            },
          },
          userId: true,
        },
      });
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(400).json("Not Found");
      }
    } catch (err) {
      console.error("Error fetching papers: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/add", async (req, res) => {
  const { cookie, title, link, examId } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!title) {
    res.status(400).json("Paper title is required");
  } else if (!link) {
    res.status(400).json("Paper Link is required");
  } else if (!examId) {
    res.status(400).json("Exam id is required");
  } else if (!isValidCatboxUrl(link)) {
    res.status(400).json("Paper link should be a valid catbox url");
  } else {
    try {
      await db.paper.create({
        data: {
          title,
          link,
          exam: { connect: { id: examId } },
          user: { connect: { id: data.userId } },
        },
      });
      res.status(200).json("Paper Created");
    } catch (err) {
      console.error("Error adding paper: ", err);
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
    res.status(400).json("Paper id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const pap = await db.paper.findFirst({ where: { id } });
        if (!pap) {
          res.status(400).json("Paper doesn't exists");
        } else {
          await db.paper.delete({ where: { id } });
          res.status(200).json("Paper Deleted");
        }
      }
    } catch (err) {
      console.error("Error deleting paper", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/edit", async (req, res) => {
  const { cookie, id, title, link } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Paper id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      const pap = await db.paper.findFirst({ where: { id } });
      if (user.role !== "admin" && pap.userId !== data.userId) {
        res.status(401).json("Unauthorized");
      } else {
        if (!pap) {
          res.status(400).json("Paper doesn't exists");
        } else if (!isValidCatboxUrl(link)) {
          res.status(400).json("Paper link should be a valid catbox url");
        } else {
          await db.paper.update({
            where: { id },
            data: {
              title,
              link,
            },
          });
          res.status(200).json("Paper edited");
        }
      }
    } catch (err) {
      console.error("Error editing paper", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
