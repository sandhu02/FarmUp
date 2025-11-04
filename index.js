const express = require('express');
const authRouter = require("./routes/authRoutes")
const adminRouter = require("./routes/adminRoutes")
const farmerRouter = require("./routes/farmerRoutes")
require('dotenv').config();


require('./config/db');


const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

// routes
app.get('/');
app.use("/auth", authRouter)
app.use("/admin", adminRouter)
app.use("/farmer", farmerRouter)

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});