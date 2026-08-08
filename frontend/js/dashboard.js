document.addEventListener("DOMContentLoaded", () => {

    const loggedIn =
        localStorage.getItem("dca_logged_in");

    if (!loggedIn) {
        window.location.href = "login.html";
        return;
    }

    loadDashboard();

});


function getAudits() {

    return JSON.parse(
        localStorage.getItem("dca_audits") || "[]"
    );
}


function loadDashboard() {

    const user =
        JSON.parse(
            localStorage.getItem("dca_user") || "{}"
        );

    const audits = getAudits();

    document.getElementById("user-name").textContent =
        user.name || "there";

    document.getElementById("audit-count").textContent =
        audits.length;

    if (audits.length === 0) {
        loadEmptyDashboard();
        return;
    }

    const latest = audits[0];

    document.getElementById("total-emissions").textContent =
        `${latest.emissions} kg`;

    document.getElementById("carbon-score").textContent =
        latest.score;

    document.getElementById("reduction-value").textContent =
        calculateReduction(audits) + "%";

    renderRecentAudits(audits);

    renderCharts(audits);
}


function calculateReduction(audits) {

    if (audits.length < 2) return 0;

    const first = audits[audits.length - 1].emissions;
    const latest = audits[0].emissions;

    if (first <= 0) return 0;

    return Math.max(
        0,
        Math.round(((first - latest) / first) * 100)
    );
}


function loadEmptyDashboard() {

    document.getElementById("total-emissions").textContent =
        "0 kg";

    document.getElementById("carbon-score").textContent =
        "—";

    document.getElementById("reduction-value").textContent =
        "0%";

    document.getElementById("recent-audits").innerHTML = `
        <div class="empty-state">
            <div>🌱</div>
            <h3>No audits yet</h3>
            <p>Create your first carbon audit to see your impact.</p>
            <a href="calculator.html" class="btn btn-primary">
                Create Audit
            </a>
        </div>
    `;
}


function renderRecentAudits(audits) {

    const container =
        document.getElementById("recent-audits");

    container.innerHTML = audits
        .slice(0, 4)
        .map(audit => `
            <div class="audit-row">

                <div>
                    <strong>${escapeHTML(audit.company)}</strong>
                    <small>${formatDate(audit.date)}</small>
                </div>

                <strong>${audit.emissions} kg</strong>

                <span class="score-badge">
                    ${audit.score}/100
                </span>

            </div>
        `)
        .join("");
}


function renderCharts(audits) {

    const emissionCanvas =
        document.getElementById("emissions-chart");

    const categoryCanvas =
        document.getElementById("category-chart");

    const latest = audits[0];

    new Chart(emissionCanvas, {

        type: "line",

        data: {

            labels: audits
                .slice(0, 6)
                .reverse()
                .map(audit => formatDate(audit.date)),

            datasets: [{
                label: "CO₂e emissions",
                data: audits
                    .slice(0, 6)
                    .reverse()
                    .map(audit => audit.emissions),
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
                    latest.categories.electricity * 0.4,
                    latest.categories.fuel * 2.3,
                    latest.categories.transportation * 0.12,
                    latest.categories.travel * 0.15,
                    latest.categories.waste * 0.5
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


function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}