// routes/admin.js
const express = require("express");
const router = express.Router();
const Market = require("../model/market");
const verifyToken = require("../middleware/verifyToken"); // if you want admin-only access
const { verify } = require("jsonwebtoken");


router.get("/marketdata", verifyToken ,async (req, res) => {
  try {
    const data = await Market.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      message: "Market data fetched successfully",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching market data",
    });
  }
});
