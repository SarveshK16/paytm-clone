const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to set cache-control headers for specific routes
app.use("/api/v1", (req, res, next) => {
    // Set cache-control headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
