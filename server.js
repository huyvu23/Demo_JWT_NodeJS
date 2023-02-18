import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Là một middleware để nhận dữ liệu json từ client gửi lên
app.use(express.json());

const books = [
  {
    name: "Chí Phèo",
  },
  {
    name: "Hello",
  },
];

const authentoken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) res.sendStatus(403);
      next();
    });
  }
};

app.get("/books", authentoken, (req, res) => {
  res.json({ status: "Success", books });
});

app.listen(PORT, () => {
  console.log(`Sever is running on PORT ${PORT}`);
});
