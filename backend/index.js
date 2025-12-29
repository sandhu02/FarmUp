const express = require('express');
const cors = require('cors');
const path = require("path");
const authRouter = require("./routes/authRoutes")
const adminRouter = require("./routes/adminRoutes")
const farmerRouter = require("./routes/farmerRoutes")
const communityRouter = require("./routes/communityRoutes")
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

require('./config/db');

app.use(express.json());

app.use("/auth", authRouter)
app.use("/admin", adminRouter)
app.use("/farmer", farmerRouter)
app.use("/community", communityRouter)

// Serve React static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));
// For React routing (important!)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});