const express = require("express");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");

const router = express.Router();


// ============================================================
// JWT AUTHENTICATION MIDDLEWARE
// ============================================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}


// ============================================================
// CREATE SCAN
// ============================================================

router.post("/", authenticateToken, async (req, res) => {

    try {

        const {
            files = []
        } = req.body;


        if (!Array.isArray(files)) {
            return res.status(400).json({
                success: false,
                message: "Files must be an array"
            });
        }


        let totalFiles = files.length;

        let totalSize = 0;

        let wasteFiles = 0;

        let wasteSize = 0;

        let duplicateFiles = 0;

        let duplicateSize = 0;


        const processedFiles = [];

        const seenNames = new Map();


        // ====================================================
        // ANALYZE FILES
        // ====================================================

        for (const file of files) {

            const name = file.name || "Unknown";

            const size = Number(file.size) || 0;

            const type = file.type || "unknown";


            totalSize += size;


            let category = "normal";

            let reason = "";

            let isDuplicate = false;

            let isDeletable = false;


            // ------------------------------------------------
            // Detect duplicate names
            // ------------------------------------------------

            if (seenNames.has(name)) {

                isDuplicate = true;

                duplicateFiles++;

                duplicateSize += size;

                wasteFiles++;

                wasteSize += size;

                category = "duplicate";

                reason = "Duplicate file detected";

                isDeletable = true;

            } else {

                seenNames.set(name, true);
            }


            // ------------------------------------------------
            // Detect temporary files
            // ------------------------------------------------

            const lowerName = name.toLowerCase();

            if (
                lowerName.endsWith(".tmp") ||
                lowerName.endsWith(".temp") ||
                lowerName.endsWith(".cache") ||
                lowerName.includes("temp")
            ) {

                if (!isDuplicate) {

                    wasteFiles++;

                    wasteSize += size;
                }

                category = "temporary";

                reason = "Temporary or cache file";

                isDeletable = true;
            }


            // ------------------------------------------------
            // Detect common system junk
            // ------------------------------------------------

            if (
                lowerName === ".ds_store" ||
                lowerName === "thumbs.db" ||
                lowerName.endsWith(".log")
            ) {

                if (!isDuplicate) {

                    wasteFiles++;

                    wasteSize += size;
                }

                category = "system-junk";

                reason = "System-generated junk file";

                isDeletable = true;
            }


            processedFiles.push({

                name,

                type,

                size,

                category,

                reason,

                isDuplicate,

                isDeletable
            });
        }


        // ====================================================
        // CREATE SCAN RECORD
        // ====================================================

        const scanResult = await pool.query(
            `
            INSERT INTO scans
            (
                user_id,
                total_files,
                total_size,
                waste_files,
                waste_size,
                duplicate_files,
                duplicate_size
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
            `,
            [
                req.user.userId,
                totalFiles,
                totalSize,
                wasteFiles,
                wasteSize,
                duplicateFiles,
                duplicateSize
            ]
        );


        const scan = scanResult.rows[0];


        // ====================================================
        // STORE INDIVIDUAL FILE RESULTS
        // ====================================================

        for (const file of processedFiles) {

            await pool.query(
                `
                INSERT INTO scan_results
                (
                    scan_id,
                    file_name,
                    file_type,
                    file_size,
                    category,
                    reason,
                    is_duplicate,
                    is_deletable
                )
                VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8)
                `,
                [
                    scan.id,
                    file.name,
                    file.type,
                    file.size,
                    file.category,
                    file.reason,
                    file.isDuplicate,
                    file.isDeletable
                ]
            );
        }


        // ====================================================
        // RESPONSE
        // ====================================================

        res.status(201).json({

            success: true,

            message: "Scan completed",

            scan: {

                id: scan.id,

                totalFiles,

                totalSize,

                wasteFiles,

                wasteSize,

                duplicateFiles,

                duplicateSize,

                files: processedFiles
            }
        });


    } catch (error) {

        console.error("========== SCAN ERROR ==========");
        console.error(error);
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Detail:", error.detail);
        console.error("================================");

        res.status(500).json({

            success: false,

            message: "Scan failed"
        });
    }
});


module.exports = router;