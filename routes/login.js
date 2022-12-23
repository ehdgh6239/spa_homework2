const express = require("express");
const router = express.Router();
const Signup = require("../schemas/signup.js");
const jwt = require("jsonwebtoken");
// 로그인
// router.post("/login", async(req,res) =>{
//     try {
//     //   const { loginId} = req.params;
//       const {nickname, password} = req.body;
    
//       const logins = await login.create({
//       nickname,
//       password,
//     });
//         res.send(logins);
//     }   
    
//     catch (error) {
//         console.error(error);
//         res.status(400).send({"errorMessage": "로그인에 실패하였습니다."});
//         }
//     });

    //로그인
  router.post("/login", async(req,res)=>{
    const {nickname, password} = req.body;

    const Login = await Signup.findOne({nickname});
    if (!Login || password !== Login.password){
      res.status(400).json({
        "errorMessage": "닉네임 또는 패스워드를 확인해주세요."
      });
      return;
    };

    const token = jwt.sign({postId:Login.post_Id},"sparta_secret_key");

    res.status(200).json({
      "token": token
      });
    });
module.exports = router;   