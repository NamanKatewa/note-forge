const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    res.status(400).json("Query is required");
  } else {
    try {
      const subjects = await db.subject.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
        },
        select: {
          id: true,
          name: true,
        },
      });

      const assignments = await db.assignment.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

      const solutions = await db.solution.findMany({
        where: {
          content: { contains: query, mode: "insensitive" },
        },
        select: { id: true, content: true, link: true },
      });

      res.status(200).json({
        subjects,
        assignments,
        solutions,
      });
    } catch (err) {
      console.error("Error performing search: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
