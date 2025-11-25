const mongoose = require('mongoose')

const connection = mongoose.connect(process.env.MONGODB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "Smart_Agriculture_Market_Tracker"
    })
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

module.exports = connection