require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const pool = require("./config/database");

const app = express();

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

app.use(cors({
    origin: "https://keen-shortbread-710f1e.netlify.app",
    credentials: true
}));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Digital Carbon Auditor API is running"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            message: "Database connected",
            time: result.rows[0].now
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});