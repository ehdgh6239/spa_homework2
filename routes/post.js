const express = require("express");
const router = express.Router();
const Post = require("../schemas/post.js");
const Comments = require("../schemas/comments.js");
const Signup = require("../schemas/signup.js");

//게시글 작성
router.post("/post", async(req,res) =>{
  try {
    const { title,content } = req.body;
    if (Object.keys(req.body).length !== 2) {
      return res.status(412).send({"errorMessage": "데이터 형식이 올바르지 않습니다."});
    }
    const maxOrderBypostId = await Post.findOne().sort("-postId").exec();
    // 하나를 찾는데 역순으로 정렬해서 찾을거고 실행할거다(exec)
    const postId = maxOrderBypostId ? 
        maxOrderBypostId.postId +=1 : // maxOrderBypostId 있으면 postId+1
        1; // 없으면 1
    const userId = maxOrderBypostId ?
        maxOrderBypostId.userId +=1:1;
    // const {nickname} = req.params;    
    // const nicknames= await Signup.findOne(nickname);
    const post = new Post({postId,userId,title,content});
    await post.save();

    res.send({"massage" : "게시글 작성에 성공하였습니다."});
  } catch (error) {
    console.error(error);

    res.status(400).send({"errorMessage": "게시글 작성에 실패하였습니다."});
  }
});

// 게시글 조회
router.get("/post", async (req, res) => {
  try {
    const post = await Post.find({}).sort({ createdAt: -1 });
    res.send(post);
  } catch (error) {
    console.error(error);
    res.status(400).send({"errorMessage": "게시글 조회에 실패하였습니다."}); 
  }
});

// 게시글 상세 조회
router.get("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    res.send(post);
  } catch (error) {
    console.error(error);

    res.status(400).send({"errorMessage": "게시글 조회에 실패하였습니다."});
  }
});

// 게시글 수정
router.put("/post/:postId", async (req, res) => {
  
  try {
    const { postId } = req.params;
    const { title } = req.body;

    const post = await Post.findById(postId);
    if (post === null) {
      return res.status(400).send({ message: " 게시글이 없습니다." });
    }

    if (Object.keys(req.body).length !== 1) {
      return res.status(412).send({"errorMessage": "데이터 형식이 올바르지 않습니다."});
    }

    const result = await Post.findByIdAndUpdate(
      postId,
      {title },
      {
        new: true,
      }
    );

    console.log("result", result);

    res.send({"message": "게시글을 수정하였습니다."});
  } catch (error) {
    console.error(error);

    res.status(400).send({"errorMessage": "게시글 수정에 실패하였습니다."});
  }
});

// 게시글 삭제
router.delete("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
   
    const _post = await Post.findById(postId);
    if (_post === null) {
      return res.status(404).send({"errorMessage": "게시글이 존재하지 않습니다."});
    }

    // 게시글 삭제
    const post = await Post.findByIdAndDelete(postId);
    // 게시글에 속한 댓글들 삭제
    const comments = await Comments.deleteMany({ postId });

    res.send({  "message": "게시글을 삭제하였습니다."});
  } catch (error) {
    console.error(error);

    res.status(400).send({"errorMessage": "게시글 작성에 실패하였습니다."});
  }
});

// 전체 게시글 삭제
router.delete("/post", async (req, res) => {
  try {
    const post_delete_result = await Post.deleteMany();
    const comments_delete_result = await Comments.deleteMany();

    console.log("post_delete_result", post_delete_result);
    console.log("Comments_delete_result", comments_delete_result);

    if (post_delete_result.deletedCount > 0) {
      return res.send({ message: "success" });
    } else {
      return res.send({ message: "nothing to delete" });
    }
  } catch (error) {
    console.error(error);

    res.status(400).send({ message: error.message });
  }
});


module.exports = router;   