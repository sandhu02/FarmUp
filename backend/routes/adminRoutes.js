// routes/admin.js
const express = require("express");
const router = express.Router();
const Market = require("../model/market");
const verifyToken = require("../middleware/verifyToken"); // if you want admin-only access
const { verify } = require("jsonwebtoken");

// 🟩 Get all market data
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

// 🟩 Add new market data
router.post("/marketdata", verifyToken ,async (req, res) => {
  try {
    const { itemName, category, price, region, unit } = req.body;

    if (!itemName || !category || !price || !region) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const newEntry = await Market.create({
      itemName,
      category,
      price,
      region,
      unit,
      priceHistory: [
        { date: new Date(), price },
        // can add simulated previous 6 days here if needed
      ],
    });

    res.status(201).json({
      success: true,
      message: "Market data added successfully",
      data: newEntry,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error adding market data",
    });
  }
});

// Update existing market data
router.put("/marketdata/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If price is being updated, we need to handle price history
    if (updates.price) {
      // First get the current market entry
      const currentEntry = await Market.findById(id);
      
      if (!currentEntry) {
        return res.status(404).json({
          success: false,
          message: "Market entry not found",
        });
      }

      // Check if price actually changed
      if (currentEntry.price !== updates.price) {
        // Create new price history entry
        const newPriceHistory = {
          date: new Date(),
          price: updates.price
        };

        // Append to existing priceHistory array (don't overwrite)
        updates.priceHistory = [...currentEntry.priceHistory, newPriceHistory];
      }
    }

    const updated = await Market.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: "Market data updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error updating market data",
    });
  }
});

// 🟩 Delete market data
router.delete("/marketdata/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Market.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Market entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Market data deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error deleting market data",
    });
  }
});

module.exports = router;
