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
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT * FROM PRODUCT WHERE PRODUCT_ID = :productId`,
      [productId],
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
    connection.close();
  }
});

// 제품추가
router.post('/', async (req, res) => {
  const { id, name, brand, price, desc } = req.body;
  let pId = id;
  let desciption = desc;
  console.log(req.body);
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `
        INSERT INTO PRODUCT(PRODUCT_ID, PRODUCT_NAME, BRAND, PRICE, DESCRIPTION) 
        VALUES(:pId, :name, :brand, :price, :desciption)
      `,
      [ pId, name, brand, price, desciption ],
      // result 안에 rows는 키 안에 json형태로 db데이터를 반환
      {autoCommit : true}
    );
    
    res.json({
        result : "success"
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    connection.close();
  }
});