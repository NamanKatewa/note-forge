const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/subject", async (req, res) => {
  const { subjectId } = req.body;
  if (!subjectId) {
    res.status(400).json("Id is required");
  } else {
    try {
      const data = await db.assignment.findMany({
        where: { subjectId },
        orderBy: { deadline: "asc" },
      });
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(400).json("Not Found");
      }
    } catch (err) {
      console.error("Error fetching assignments: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/add", async (req, res) => {
  const { cookie, title, deadline, subjectId } = req.body;

  if (!title) {
    res.status(400).json("Assignment title is required");
  } else if (!deadline) {
    res.status(400).json("Assignment deadline is required");
  } else if (!subjectId) {
    res.status(400).json("Subject id is required");
  } else {
    try {
      const data = await db.session.findFirst({
        where: { cookie },
        select: { userId: true },
      });
      if (!data) {
        res.status(401).json("Unauthorized");
      }
      await db.assignment.create({
        data: {
          title,
          deadline,
          subject: { connect: { id: subjectId } },
          user: { connect: { id: data.userId } },
        },
      });
      res.status(200).json("Assignment Created");
    } catch (err) {
      console.error("Error adding Assignment: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/remove", async (req, res) => {
  const { cookie, id } = req.body;

  if (!cookie) {
    res.status(400).json("Session cookie is required");
  } else if (!id) {
    res.status(400).json("Assignment id is required");
  } else {
    try {
      const data = await db.session.findFirst({
        where: { cookie },
        select: { userId: true },
      });
      if (!data) {
        res.status(400).json("Unauthorized");
      }

      const user = await db.user.findUnique({
        where: { id: data.userId },
        select: { role: true },
      });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const ass = await db.assignment.findFirst({ where: { id } });
        if (!ass) {
          res.status(400).json("Assignment doesn't exist");
        } else {
          await db.assignment.delete({
            where: { id },
          });
          res.status(200).json("Assignment Deleted");
        }
      }
    } catch (err) {
      console.error("Error deleting assignment: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/edit", async (req, res) => {
  const { cookie, id, title, deadline } = req.body;

  const data = await db.session.findFirst({
    where: { cookie },
    select: { userId },
  });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Assignment id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      const ass = await db.assignment.findFirst({ where: { id } });
      if (user.role !== "admin" && ass.userId !== data.userId) {
        res.status(401).json("Unauthorized");
      } else {
        if (!ass) {
          res.status(400).json("Assignment doesn't exist");
        } else {
          await db.assignment.update({
            where: { id },
            data: { title, deadline },
          });
          res.status(200).json("Assignment edited");
        }
      }
    } catch (err) {
      console.error("Error editing Assignment: ", err);
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
      const data = await db.assignment.findUnique({
        where: { id },
        select: {
          deadline: true,
          title: true,
          subject: {
            select: { name: true },
          },
        },
      });
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(400).json("Not Found");
      }
    } catch (err) {
      console.error("Error fetching assignment: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
