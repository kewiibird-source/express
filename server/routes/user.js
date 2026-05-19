const express = require('express');
const oracledb = require('oracledb');
const db = require("../db"); // server - db 참조
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;

module.exports = router;

// user 로그인 보안상 post 사용
router.post('/login', async (req, res) => {
  const { userId, pwd } = req.body;
  try {
    // 쿼리 결과 result에 담김
    let connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT * FROM TBL_USER WHERE USERID=:userId`,
      [userId], // 입력받은 값 어디에 넣을지
      // result 안에 rows는 키 안에 json형태로 db데이터를 반환
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );

    console.log(result.rows); // undefined or []
    let message = "";
    let info = {} 

    if(result.rows.length > 0){
      let match = await bcrypt.compare(pwd, result.rows[0].PWD)
      if(match){
        message = "success";
        info = {
          userId : result.rows[0].USERID,
          userName : result.rows[0].USERNAME
        }
      } else {

      }

      message = "success";
      info = {
        userId : result.rows[0].USERID,
        userName : result.rows[0].USERNAME
      }
    } else {
      // 로그인실패 - 아이디도 맞는거 없음
      message = "fail";
    }
    
    res.json({
        message : message,
        info : info
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});

// user 등록
router.post('/join', async (req, res) => {
  const { userId, pwd, userName } = req.body;
  const hashPwd = await bcrypt.hash(pwd, saltRounds);
  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO TBL_USER(USERID, PWD, USERNAME) VALUES(:userId, :hashPwd, :userName)`,
      [userId, hashPwd, userName],
      {autoCommit : true}
    );
    console.log(result);
    // { lastRowid: 'AAATEkAABAAAifRAAM', rowsAffected: 1 }
    if(result.rowsAffected > 0){

    } else {

    }
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