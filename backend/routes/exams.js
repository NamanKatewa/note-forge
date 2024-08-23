const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/subject", async (req, res) => {
  const { subjectId } = req.body;
  if (!subjectId) {
    res.status(400).json("Id is required");
  } else {
    try {
      const data = await db.exam.findMany({
        where: { subjectId },
        orderBy: { deadline: "asc" },
      });
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(400).json("Not Found");
      }
    } catch (err) {
      console.error("Error fetching exams ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/add", async (req, res) => {
  const { cookie, title, deadline, subjectId } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!title) {
    res.status(400).json("Exam title is required");
  } else if (!deadline) {
    res.status(400).json("Exam deadline is required");
  } else if (!subjectId) {
    res.status(400).json("Subject id is required");
  } else {
    try {
      await db.exam.create({
        data: {
          title,
          deadline,
          subject: { connect: { id: subjectId } },
        },
      });
      res.status(200).json("Exam Created");
    } catch (err) {
      console.error("Error adding exam: ", err);
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
    res.status(400).json("Exam id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const ass = await db.exam.findFirst({ where: { id } });
        if (!ass) {
          res.status(400).json("Exam doesn't exist");
        } else {
          await db.exam.delete({
            where: { id },
          });
          res.status(200).json("Exam Deleted");
        }
      }
    } catch (err) {
      console.error("Error deleting exam: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/edit", async (req, res) => {
  const { cookie, id, title, deadline } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Exam id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      const ass = await db.exam.findFirst({ where: { id } });
      if (user.role !== "admin" && ass.userId !== data.userId) {
        res.status(401).json("Unauthorized");
      } else {
        if (!ass) {
          res.status(400).json("Examt doesn't exist");
        } else {
          await db.exam.update({
            where: { id },
            data: { title, deadline },
          });
          res.status(200).json("Exam edited");
        }
      }
    } catch (err) {
      console.error("Error editing Exam: ", err);
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
      const data = await db.exam.findUnique({
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
      console.error("Error fetching exam: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
