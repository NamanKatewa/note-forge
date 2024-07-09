const express = require("express");
const router = express.Router();
const db = require("../db");
const { isValidCatboxUrl } = require("../lib/url");

router.post("/assignment", async (req, res) => {
  const { assignmentId } = req.body;
  if (!assignmentId) {
    res.status(400).json("Id is required");
  } else {
    try {
      const data = await db.solution.findMany({
        where: { assignmentId },
        select: {
          content: true,
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
      console.error("Error fetching solutions: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/add", async (req, res) => {
  const { cookie, content, link, assignmentId } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!content) {
    res.status(400).json("Solution content is required");
  } else if (!link) {
    res.status(400).json("Solution Link is required");
  } else if (!assignmentId) {
    res.status(400).json("Assignment id is required");
  } else if (!isValidCatboxUrl(link)) {
    res.status(400).json("Solution link should be a valid catbox url");
  } else {
    try {
      await db.solution.create({
        data: {
          content,
          link,
          assignment: { connect: { id: assignmentId } },
          user: { connect: { id: data.userId } },
        },
      });
      res.status(200).json("Solution Created");
    } catch (err) {
      console.error("Error adding assignment: ", err);
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
    res.status(400).json("Solution id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const sol = await db.solution.findFirst({ where: { id } });
        if (!sol) {
          res.status(400).json("Solution doesn't exists");
        } else {
          await db.solution.delete({ where: { id } });
          res.status(200).json("Solution Deleted");
        }
      }
    } catch (err) {
      console.error("Error deleting solution", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/edit", async (req, res) => {
  const { cookie, id, content, link } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Solution id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      const sol = await db.solution.findFirst({ where: { id } });
      if (user.role !== "admin" && sol.userId !== data.userId) {
        res.status(401).json("Unauthorized");
      } else {
        if (!sol) {
          res.status(400).json("Solution doesn't exists");
        } else if (!isValidCatboxUrl(link)) {
          res.status(400).json("Solution link should be a valid catbox url");
        } else {
          await db.solution.update({
            where: { id },
            data: {
              content,
              link,
            },
          });
          res.status(200).json("Solution edited");
        }
      }
    } catch (err) {
      console.error("Error editing solution", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
