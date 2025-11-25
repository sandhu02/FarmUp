const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/iplocation", async (req, res) => {
  try {
    const resp = await axios.get("https://ipwho.is/");
    const data = resp.data; // already JSON
    
    res.send(data)
  } 
  catch (err) {
    console.error("IP fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch IP location" });
  }
});

module.exports = router;
