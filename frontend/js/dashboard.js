document.addEventListener("DOMContentLoaded", () => {

    const loggedIn =
        localStorage.getItem("dca_logged_in");

    if (!loggedIn) {
        window.location.href = "login.html";
        return;
    }

    loadDashboard();
});


// ============================================================
// GET LOCAL USER
// ============================================================

function getUser() {

    return JSON.parse(
        localStorage.getItem("dca_user") || "{}"
    );

}


// ============================================================
// LOAD DASHBOARD
// ============================================================

async function loadDashboard() {

    const user = getUser();

    const userName =
        document.getElementById("user-name");

    if (userName) {
        userName.textContent =
            user.name || "there";
    }

    try {

        // Get previous audits stored locally for now.
        // We will replace this with the PostgreSQL
        // history API in the next step.

        const audits = getAudits();

        const auditCount =
            document.getElementById("audit-count");

        if (auditCount) {
            auditCount.textContent =
                audits.length;
        }


        if (audits.length === 0) {
            loadEmptyDashboard();
            return;
        }


        const latest = audits[0];


        const totalEmissions =
            document.getElementById("total-emissions");

        if (totalEmissions) {
            totalEmissions.textContent =
                `${latest.emissions} kg`;
        }


        const carbonScore =
            document.getElementById("carbon-score");

        if (carbonScore) {
            carbonScore.textContent =
                latest.score;
        }


        const reductionValue =
            document.getElementById("reduction-value");

        if (reductionValue) {
            reductionValue.textContent =
                calculateReduction(audits) + "%";
        }


        renderRecentAudits(audits);

        renderCharts(audits);

    } catch (error) {

        console.error(
            "Dashboard loading failed:",
            error
        );

        loadEmptyDashboard();
    }
}


// ============================================================
// LOCAL AUDITS
// ============================================================

function getAudits() {

    return JSON.parse(
        localStorage.getItem("dca_audits") || "[]"
    );

}


// ============================================================
// CALCULATE REDUCTION
// ============================================================

function calculateReduction(audits) {

    if (audits.length < 2) {
        return 0;
    }

    const first =
        audits[audits.length - 1].emissions;

    const latest =
        audits[0].emissions;

    if (first <= 0) {
        return 0;
    }

    return Math.max(
        0,
        Math.round(
            ((first - latest) / first) * 100
        )
    );
}


// ============================================================
// EMPTY DASHBOARD
// ============================================================

function loadEmptyDashboard() {

    const totalEmissions =
        document.getElementById("total-emissions");

    if (totalEmissions) {
        totalEmissions.textContent = "0 kg";
    }


    const carbonScore =
        document.getElementById("carbon-score");

    if (carbonScore) {
        carbonScore.textContent = "—";
    }


    const reductionValue =
        document.getElementById("reduction-value");

    if (reductionValue) {
        reductionValue.textContent = "0%";
    }


    const recentAudits =
        document.getElementById("recent-audits");

    if (recentAudits) {

        recentAudits.innerHTML = `
            <div class="empty-state">

                <div>🌱</div>

                <h3>No audits yet</h3>

                <p>
                    Scan your digital files to discover
                    unnecessary digital waste.
                </p>

                <button
                    class="btn btn-primary"
                    onclick="startFileScan()"
                >
                    Scan Your Files
                </button>

            </div>
        `;
    }
}


// ============================================================
// RENDER RECENT AUDITS
// ============================================================

function renderRecentAudits(audits) {

    const container =
        document.getElementById("recent-audits");

    if (!container) {
        return;
    }


    container.innerHTML = audits
        .slice(0, 4)
        .map(audit => `

            <div class="audit-row">

                <div>

                    <strong>
                        ${escapeHTML(
                            audit.company || "Digital Scan"
                        )}
                    </strong>

                    <small>
                        ${formatDate(audit.date)}
                    </small>

                </div>

                <strong>
                    ${audit.emissions} kg
                </strong>

                <span class="score-badge">
                    ${audit.score}/100
                </span>

            </div>

        `)
        .join("");
}


// ============================================================
// CHARTS
// ============================================================

function renderCharts(audits) {

    if (typeof Chart === "undefined") {
        console.warn("Chart.js is not loaded.");
        return;
    }


    const emissionCanvas =
        document.getElementById("emissions-chart");

    const categoryCanvas =
        document.getElementById("category-chart");


    if (!emissionCanvas || !categoryCanvas) {
        return;
    }


    const latest = audits[0];


    new Chart(emissionCanvas, {

        type: "line",

        data: {

            labels: audits
                .slice(0, 6)
                .reverse()
                .map(audit =>
                    formatDate(audit.date)
                ),

            datasets: [{

                label: "CO₂e emissions",

                data: audits
                    .slice(0, 6)
                    .reverse()
                    .map(audit =>
                        audit.emissions
                    ),

                tension: 0.35,

                fill: true
            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                }

            }

        }

    });


    const categories =
        latest.categories || {};


    new Chart(categoryCanvas, {

        type: "doughnut",

        data: {

            labels: [
                "Electricity",
                "Fuel",
                "Transportation",
                "Travel",
                "Waste"
            ],

            datasets: [{

                data: [

                    (categories.electricity || 0) * 0.4,

                    (categories.fuel || 0) * 2.3,

                    (categories.transportation || 0) * 0.12,

                    (categories.travel || 0) * 0.15,

                    (categories.waste || 0) * 0.5

                ]

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });
}


// ============================================================
// START FILE SCAN
// ============================================================

async function startFileScan() {

    try {

        const files =
            await selectFiles();

        if (!files || files.length === 0) {

            console.log(
                "No files selected."
            );

            return;
        }


        showScanningState(files.length);


        const fileData =
            files.map(file => ({

                name: file.name,

                size: file.size,

                type: file.type || "unknown"

            }));


        const result =
            await apiRequest(
                "/scans",
                {
                    method: "POST",

                    body: JSON.stringify({
                        files: fileData
                    })
                }
            );


        console.log(
            "Scan completed:",
            result
        );


        displayScanResults(
            result.scan
        );


    } catch (error) {

        console.error(
            "File scan failed:",
            error
        );

        alert(
            error.message ||
            "Unable to scan files."
        );
    }
}


// ============================================================
// FILE SELECTOR
// ============================================================

function selectFiles() {

    return new Promise((resolve) => {

        const input =
            document.createElement("input");

        input.type = "file";

        input.multiple = true;

        input.style.display = "none";


        input.addEventListener(
            "change",
            () => {

                const files =
                    Array.from(
                        input.files || []
                    );

                resolve(files);

                input.remove();
            }
        );


        document.body.appendChild(input);

        input.click();
    });
}


// ============================================================
// SHOW SCANNING STATE
// ============================================================

function showScanningState(fileCount) {

    const recentAudits =
        document.getElementById(
            "recent-audits"
        );

    if (!recentAudits) {
        return;
    }


    recentAudits.innerHTML = `

        <div class="empty-state">

            <div class="scan-loader">
                🔍
            </div>

            <h3>
                Scanning your digital files...
            </h3>

            <p>
                Analyzing ${fileCount}
                selected file${fileCount === 1 ? "" : "s"}.
            </p>

        </div>

    `;
}


// ============================================================
// DISPLAY SCAN RESULTS
// ============================================================

function displayScanResults(scan) {

    const recentAudits =
        document.getElementById(
            "recent-audits"
        );

    if (!recentAudits) {
        return;
    }


    recentAudits.innerHTML = `

        <div class="scan-result-card">

            <div class="scan-result-header">

                <div>
                    <span class="section-label">
                        SCAN COMPLETE
                    </span>

                    <h3>
                        Your Digital Waste Report
                    </h3>
                </div>

                <div class="scan-success">
                    ✓
                </div>

            </div>


            <div class="scan-result-stats">

                <div class="scan-stat">

                    <strong>
                        ${scan.totalFiles}
                    </strong>

                    <span>
                        Files Scanned
                    </span>

                </div>


                <div class="scan-stat">

                    <strong>
                        ${scan.wasteFiles}
                    </strong>

                    <span>
                        Waste Files
                    </span>

                </div>


                <div class="scan-stat">

                    <strong>
                        ${formatBytes(
                            scan.wasteSize
                        )}
                    </strong>

                    <span>
                        Recoverable Space
                    </span>

                </div>

            </div>


            <button
                class="btn btn-primary"
                onclick="viewScanFiles()"
            >
                Review Digital Waste
            </button>

        </div>

    `;


    updateDashboardStats(scan);
}


// ============================================================
// UPDATE DASHBOARD STATS
// ============================================================

function updateDashboardStats(scan) {

    const auditCount =
        document.getElementById("audit-count");

    if (auditCount) {

        auditCount.textContent =
            scan.totalFiles;
    }


    const totalEmissions =
        document.getElementById(
            "total-emissions"
        );

    if (totalEmissions) {

        totalEmissions.textContent =
            `${calculateDigitalCarbon(scan)} kg`;
    }


    const carbonScore =
        document.getElementById(
            "carbon-score"
        );

    if (carbonScore) {

        const score =
            calculateDigitalScore(scan);

        carbonScore.textContent =
            score;
    }
}


// ============================================================
// DIGITAL CARBON ESTIMATE
// ============================================================

function calculateDigitalCarbon(scan) {

    /*
     * This is currently an ESTIMATE.
     *
     * We will replace this with a documented
     * carbon methodology later.
     */

    const gb =
        scan.wasteSize /
        (1024 * 1024 * 1024);

    return Number(
        (gb * 0.06).toFixed(2)
    );
}


// ============================================================
// DIGITAL HEALTH SCORE
// ============================================================

function calculateDigitalScore(scan) {

    if (!scan.totalFiles) {
        return 100;
    }


    const wasteRatio =
        scan.wasteFiles /
        scan.totalFiles;


    return Math.max(
        0,
        Math.round(
            100 - wasteRatio * 100
        )
    );
}


// ============================================================
// VIEW SCAN FILES
// ============================================================

function viewScanFiles() {

    alert(
        "Your scan results are ready. " +
        "The file cleanup interface will be added next."
    );
}


// ============================================================
// FORMAT BYTES
// ============================================================

function formatBytes(bytes) {

    if (!bytes || bytes <= 0) {
        return "0 B";
    }


    const units = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        parseFloat(
            (
                bytes /
                Math.pow(1024, index)
            ).toFixed(2)
        )
        + " "
        + units[index]
    );
}


// ============================================================
// DATE
// ============================================================

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
}


// ============================================================
// HTML ESCAPING
// ============================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}
// ============================================================
// SCANNER BUTTONS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const folderButton =
        document.getElementById("choose-folder-btn");

    const fileButton =
        document.getElementById("choose-file-btn");


    if (folderButton) {

        folderButton.addEventListener(
            "click",
            startFileScan
        );

    }


    if (fileButton) {

        fileButton.addEventListener(
            "click",
            startFileScan
        );

    }

});