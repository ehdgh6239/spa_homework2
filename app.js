const express = require("express");
const app = express();

const postRouter = require("./routes/post.js");
const loginRouter = require("./routes/login.js");
const commentsRouter = require("./routes/comments.js");
const signupRouter = require("./routes/signup.js");

const connect = require("./schemas/index.js");
connect();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.use("/api", [postRouter,loginRouter,commentsRouter,signupRouter]);

app.listen(3000, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});