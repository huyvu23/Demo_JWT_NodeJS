import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = 3500;

// Thực tế  là cần phải lưu array này vào bên trong DB
let arrRefreshToken = [];

// Là một middleware để nhận dữ liệu json từ client gửi lên
app.use(express.json());

app.post("/refreshToken", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    res.sendStatus(401);
  }
  if (!arrRefreshToken.includes(refreshToken)) {
    res.sendStatus(403);
  } else {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const accessToken = jwt.sign(
          { userName: data.userName },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "30s",
          }
        );
        res.json({ accessToken });
      }
    });
  }
});

app.post("/login", (req, res) => {
  const data = req.body;

  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  arrRefreshToken.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

app.listen(PORT, () => {
  console.log(`Sever is running on PORT ${PORT}`);
});
