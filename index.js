require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/auth");
const deviceRouter = require("./routes/device");
const activityRouter = require("./routes/activity");
const roomRouter = require("./routes/room");

const connectDB = async () => {
  try {
    console.log("connect success");

    await mongoose.connect(
      // `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dlj4r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      `mongodb+srv://luanluan:Luanluan123@cluster0.dlj4r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
  } catch (err) {
    console.log({ error: err });
  }
};

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/auth", authRouter);
app.use("/api/devices", deviceRouter);
app.use("/api/activities", activityRouter);
app.use("/api/rooms", roomRouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
