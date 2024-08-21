const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/all", async (req, res) => {
  try {
    const data = await db.subject.findMany();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching subjects: ", err);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/add", async (req, res) => {
  const { cookie, name } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!name) {
    res.status(400).json("Subject name is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const sub = await db.subject.findFirst({ where: { name } });
        if (sub) {
          res.status(400).json("Subject already exists");
        } else {
          await db.subject.create({
            data: {
              name,
            },
          });
          res.status(200).json("Subject Created");
        }
      }
    } catch (err) {
      console.error("Error adding subject: ", err);
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
    res.status(400).json("Subject id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const sub = await db.subject.findFirst({ where: { id } });
        if (!sub) {
          res.status(400).json("Subject doesn't exists");
        } else {
          await db.subject.delete({
            where: { id },
          });
          res.status(200).json("Subject Deleted");
        }
      }
    } catch (err) {
      console.error("Error deleting subject: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/edit", async (req, res) => {
  const { cookie, id, name } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Subject id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const sub = await db.subject.findFirst({ where: { id } });
        if (!sub) {
          res.status(400).json("Subject doesn't exists");
        } else {
          await db.subject.update({
            where: { id },
            data: { name },
          });
          res.status(200).json("Subject edited");
        }
      }
    } catch (err) {
      console.error("Error editing subject: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.get("/detail", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json("Id is required");
  } else {
    try {
      const data = await db.subject.findUnique({ where: { id } });
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(400).json("Not Found");
      }
    } catch (err) {
      console.error("Error fetching subject: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/save", async (req, res) => {
  const { cookie, id } = req.body;
  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Subject id is required");
  } else {
    try {
      const sub = await db.user.findFirst({
        where: { id: data.userId, subjects: { some: { id } } },
      });
      if (sub) {
        res.status(400).json("Subject already saved");
      } else {
        await db.user.update({
          where: { id: data.userId },
          data: { subjects: { connect: { id } } },
        });
        res.status(200).json("Subject saved");
      }
    } catch (err) {
      console.error("Error saving subject: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/removesave", async (req, res) => {
  const { cookie, id } = req.body;
  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!id) {
    res.status(400).json("Subject id is required");
  } else {
    try {
      const sub = await db.user.findFirst({
        where: { id: data.userId, subjects: { some: { id } } },
      });
      if (!sub) {
        res.status(400).json("Subject is not saved");
      } else {
        await db.user.update({
          where: { id: data.userId },
          data: { subjects: { disconnect: { id } } },
        });
        res.status(200).json("Subject removed");
      }
    } catch (err) {
      console.error("Error removing subject: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/getsaved", async (req, res) => {
  const { cookie } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });
  if (!cookie) {
    res.status(401).json("Unauthroized");
  } else if (!data) {
    res.status(401).json("Unauthorized");
  } else {
    try {
      subjects = await db.user.findUnique({
        where: { id: data.userId },
        include: { subjects: true },
      });
      res.status(200).json(subjects);
    } catch (err) {
      console.error("Error fetching subjects for user: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
