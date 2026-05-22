const express = require('express');
const oracledb = require('oracledb');
const db = require("../db"); // server - db 참조
const router = express.Router();

module.exports = router;

// 제품리스트
router.get('/', async (req, res) => {
  const { } = req.query;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT * FROM PRODUCT`,
      [],
      // result 안에 rows는 키 안에 json형태로 db데이터를 반환
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    
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

// 제품상세보기
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `
        SELECT 
          STU_NO AS "stuNo",  
          STU_NAME AS "stuName",
          STU_DEPT AS "stuDept",
          STU_GRADE AS "stuGrade"
        FROM STUDENT WHERE STU_NO = :stuNo
      `,
      [stuNo],
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    console.log(result)
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