const express = require("express");
const router = express.Router();
const Signup = require("../schemas/signup.js");
// 회원가입 
router.post("/signup", async(req,res) =>{
    try {
      const { nickname,password,confirm } = req.body;

      if (Object.keys(req.body).length !== 3) {
        return 
      }
      const existNickname = await Signup.findOne ({
        $or: [{nickname: nickname}] //$or = 안에있는 값중에 하나라도 일치하면 보여준다.
        });
    
        if(existNickname){
          res.status(412).json({"errorMessage": "중복된 닉네임입니다."});
          return;
        };
      if (password !== confirm){
        return res.status(412).send({"errorMessage": "패스워드가 일치하지 않습니다."});
      }
      if (password === nickname){
        return res.status(412).send({"errorMessage": "패스워드에 닉네임이 포함되어 있습니다."});
      }
      const signup = new Signup ({nickname, password, confirm});
      await signup.save();
      res.send({"message": "회원 가입에 성공하였습니다."});
    } catch (error) {
      console.error(error);
      res.status(400).send({"errorMessage": "요청한 데이터 형식이 올바르지 않습니다."});
    }
  });

  
module.exports = router;   