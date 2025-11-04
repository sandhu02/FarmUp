const express = require('express');
const cors = require('cors');
const authRouter = require("./routes/authRoutes")
const adminRouter = require("./routes/adminRoutes")
const farmerRouter = require("./routes/farmerRoutes")
const communityRouter = require("./routes/communityRoutes")
require('dotenv').config();

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors({
    origin: "*", // allow all origins
    methods: "*",
}));

require('./config/db');

app.use(express.json());

// routes
app.get('/' , (req,res) => {
    res.send("Welcome to Smart Agri Market Tracker")
});
app.use("/auth", authRouter)
app.use("/admin", adminRouter)
app.use("/farmer", farmerRouter)
app.use("/community", communityRouter)

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});