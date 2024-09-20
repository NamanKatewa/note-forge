const express = require("express");
const router = express.Router();
const db = require("../db");
const { isValidUrl } = require("../lib/url");

router.get("/all", async (req, res) => {
  try {
    const data = await db.resource.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        link: true,
      },
    });
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching resources: ", err);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/add", async (req, res) => {
  const { cookie, title, content, link } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });

  if (!data) {
    res.status(401).json("Unauthorized");
  } else if (!title) {
    res.status(400).json("Resource title is required");
  } else if (!content) {
    res.status(400).json("Resource content is required");
  } else if (!link) {
    res.status(400).json("Resource link is required");
  } else if (!isValidUrl(link)) {
    res.status(400).json("Resource link should be a valid link");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const sub = await db.resource.findFirst({ where: { title } });
        if (sub) {
          res.status(400).json("Resource already exists");
        } else {
          await db.resource.create({
            data: {
              title,
              content,
              link,
              user: {
                connect: { id: user.id },
              },
            },
          });
          res.status(200).json("Resource Created");
        }
      }
    } catch (err) {
      console.error("Error adding resource: ", err);
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
    res.status(400).json("Resource id is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const reso = await db.resource.findFirst({ where: { id } });
        if (!reso) {
          res.status(400).json("Resource doesn't exist");
        } else {
          await db.resource.delete({
            where: { id },
          });
          res.status(200).json("Resource Deleted");
        }
      }
    } catch (err) {
      console.error("Error deleting resource: ", err);
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
    res.status(400).json("Resource id is required");
  } else if (!title) {
    res.status(400).json("Resource title is required");
  } else if (!content) {
    res.status(400).json("Resource content is required");
  } else if (!link) {
    res.status(400).json("Resource link is required");
  } else {
    try {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (user.role !== "admin") {
        res.status(401).json("Unauthorized");
      } else {
        const reso = await db.resource.findFirst({ where: { id } });
        if (!reso) {
          res.status(400).json("Resource doesn't exist");
        } else {
          await db.resource.update({
            where: { id },
            data: {
              title,
              content,
              link,
            },
          });
          res.status(200).json("Resource edited");
        }
      }
    } catch (err) {
      console.error("Error editing resource: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = router;
