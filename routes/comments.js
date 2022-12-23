const express = require("express");
const router = express.Router();

const Post = require("../schemas/post.js");
const Comments = require("../schemas/comments.js");

// 댓글 생성
router.post("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const {nickname,comment} = req.body;
    
    const post = await Post.findById(postId);
    if (Object.keys(req.body).length !== 2 || req.body === "") {
      return res.status(412).send({"errorMessage": "데이터 형식이 올바르지 않습니다."});
    }
    const maxOrderBycommentId = await Comments.findOne().sort("-commentId").exec();
    
    const commentId = maxOrderBycommentId ? 
        maxOrderBycommentId.commentId +=1 : 1;

    const userId = maxOrderBycommentId ?
        maxOrderBycommentId.userId +=1:1;

    const comments = new Comments({commentId,userId,nickname,comment});
    await comments.save();

    res.send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({"errorMessage": "댓글 작성에 실패하였습니다."});
  }
});


// 댓글 목록 조회
router.get("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    
    // 조기 리턴
    const post = await Post.findById(postId);
    if (post === null) {
      return res.status(400).send({ message: "🛑 게시글이 없습니다." });
    }

    const comments = await Comments.find({ postId }).sort({ createdAt: -1 });

    res.send(comments);
  } catch (error) {
    console.error(error);

    res.status(400).send({"errorMessage": "댓글 조회에 실패하였습니다."});
  }
});



// 댓글 수정
router.put("/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;

    // 조기 리턴
    const _post = await Comments.findById(commentId);
    if (_post === null) {
      return res.status(400).send({ message: "댓글이 없습니다." });
    }
    
    if (Object.keys(req.body).length !== 1) {
      return res.status(412).send({"errorMessage": "데이터 형식이 올바르지 않습니다."});
    }

    const _comments = await Comments.findById(commentId);
    if (_comments === null) {
      return res.status(404).send({"errorMessage": "댓글이 존재하지 않습니다."});
    }

    const result = await Comments.findByIdAndUpdate(
      _comments,
      {
        comment
      },
      { new: true }
    );

    console.log("result", result);

    res.send({ "message": "댓글을 수정하였습니다."});
  } catch (error) {
    console.error(error);

    res.status(400).send({"errorMessage": "댓글 수정에 실패하였습니다."});
  }
});

// 댓글 삭제
router.delete("/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;

    // 조기 리턴
    const _comments = await Comments.findById(commentId);
    if (_comments === null) {
      return res.status(404).send({"errorMessage": "댓글이 존재하지 않습니다."});
    }

    const comments = await Comments.findByIdAndDelete(commentId);

    res.send(comments);
  } catch (error) {
    console.error({"message": "댓글을 삭제하였습니다."});

    res.status(400).send({"errorMessage": "댓글 삭제에 실패하였습니다."});
  }
});
// 전체 댓글 조회
router.get("/comments", async (req, res) => {
  try {
    const comments = await Comments.find({}).sort({ createdAt: -1 });

    res.send(comments);
  } catch (error) {
    console.error(error);

    res.status(400).send({ message: error.message });
  }
});

// 전체 댓글 삭제
router.delete("/comments", async (req, res) => {
  try {
    const result = await Comments.deleteMany();

    console.log("result", result);

    if (result.deletedCount > 0) {
      return res.send({ message: "success" });
    } else {
      return res.send({ message: "nothing to delete" });
    }
  } catch (error) {
    console.error(error);

    res.status(400).send(error.message);
  }
});

module.exports = router;