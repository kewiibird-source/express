const express = require('express');
const oracledb = require('oracledb');
const db = require("../db"); // server - db 참조
const router = express.Router();

module.exports = router;

// 게시글 목록
router.get('/', async (req, res) => {
  const { keyword, orderkey } = req.query;
  let order = " ORDER BY ";
  if(orderkey == "date"){
    order += "CDATETIME DESC"
  } else if(orderkey == "title") {
    order += "TITLE ASC"
  } else if(orderkey == "cnt"){
    order += "CNT DESC"
  }
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
    `
        SELECT 
            BOARDNO AS "boardNo",
            USERID AS "userId",
            TITLE AS "title",
            CNT AS "cnt",
            TO_CHAR(CDATETIME, 'YYYY-MM-DD') AS "cDateTime"
        FROM TBL_BOARD
        WHERE TITLE LIKE '%' || :keyword || '%'
      ` + order,
      [keyword],
      // result 안에 rows는 키 안에 json형태로 db데이터를 반환
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    [keyword],
    res.json({
        result : "success",
        list : result.rows
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});

// 게시글 상세보기
router.get('/:boardNo', async (req, res) => {
  const { boardNo } = req.params;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
    `
        SELECT 
            BOARDNO AS "boardNo",
            USERID AS "userId",
            TITLE AS "title",
            CNT AS "cnt",
            TO_CHAR(CDATETIME, 'YYYY-MM-DD') AS "cDateTime",
            CONTENTS AS "contents"
        FROM TBL_BOARD
        WHERE BOARDNO = :boardNo
      `,  
      [boardNo],
      // result 안에 rows는 키 안에 json형태로 db데이터를 반환
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    res.json({
        result : "success",
        info : result.rows[0]
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});

// 게시글>상세보기>삭제
router.delete('/:boardNo', async (req, res) => {
  console.log("DELETE 호출!")
  console.log(req.params)
  const { boardNo } = req.params;

  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM TBL_BOARD WHERE BOARDNO = :boardNo`,
      [boardNo],
      {autoCommit : true}
    );

    res.json({
        result : "success",
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});

// 게시글수정
router.put('/:boardNo', async (req, res) => {
  const { boardNo } = req.params;
  const { title, contents } = req.body;

  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `
        UPDATE TBL_BOARD SET
          TITLE = :title,
          CONTENTS = :contents,
        WHERE BOARDNO = :boardNo
      `,
      [title, contents, boardNo],
      {autoCommit : true}
    );

    res.json({
        result : "success",
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});
