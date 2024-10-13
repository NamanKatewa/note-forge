const compression = require("compression");
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const db = require("./db");
require("dotenv").config();

const auth = require("./routes/auth");
const subjects = require("./routes/subjects");
const assignments = require("./routes/assignments");
const solution = require("./routes/solution");
const search = require("./routes/search");
const notes = require("./routes/notes");
const exams = require("./routes/exams");
const papers = require("./routes/papers");
const resources = require("./routes/resources");
const books = require("./routes/books");
const announcements = require("./routes/announcements");

const app = express();

app.use(express.json());
app.use(cors());
app.use(compression());

const verificationTask = cron.schedule("*/10 * * * * *", async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  try {
    await db.verify.deleteMany({
      where: {
        createdAt: {
          lt: tenMinutesAgo,
        },
      },
    });
    console.log("Verification records cleaned");
  } catch (err) {
    console.error("Error occured during verification records cleanup: ", err);
  }
});
verificationTask.start();

const resetTask = cron.schedule("*/10 * * * * *", async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  try {
    await db.passwordReset.deleteMany({
      where: {
        createdAt: {
          lt: tenMinutesAgo,
        },
      },
    });
    console.log("Password Reset records cleaned");
  } catch (err) {
    console.error("Error occured during password reset records cleanup: ", err);
  }
});
resetTask.start();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("server started");
});

app.use("/auth", auth);
app.use("/subjects", subjects);
app.use("/assignments", assignments);
app.use("/solution", solution);
app.use("/search", search);
app.use("/notes", notes);
app.use("/exams", exams);
app.use("/papers", papers);
app.use("/resources", resources);
app.use("/books", books);
app.use("/announcements", announcements);
