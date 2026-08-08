document.addEventListener("DOMContentLoaded", () => {

    const audits = JSON.parse(
        localStorage.getItem("dca_audits") || "[]"
    );

    if (!audits.length) return;

    const audit = audits[0];

    document.getElementById("report-company").textContent =
        audit.company;

    document.getElementById("report-emissions").textContent =
        `${audit.emissions} kg`;

    document.getElementById("report-score").textContent =
        `${audit.score}/100`;

    document.getElementById("report-period").textContent =
        audit.period;

    renderSources(audit);

    document.getElementById("print-report")
        .addEventListener("click", () => {
            window.print();
        });

});


function renderSources(audit) {

    const categories = audit.categories;

    const sources = [
        {
            name: "Electricity",
            value: categories.electricity * 0.4
        },
        {
            name: "Fuel",
            value: categories.fuel * 2.3
        },
        {
            name: "Transportation",
            value: categories.transportation * 0.12
        },
        {
            name: "Travel",
            value: categories.travel * 0.15
        },
        {
            name: "Waste",
            value: categories.waste * 0.5
        }
    ];

    sources.sort((a, b) => b.value - a.value);

    document.getElementById("report-sources").innerHTML =
        sources
            .filter(source => source.value > 0)
            .map(source => `
                <div class="source-item">
                    <span>${source.name}</span>
                    <strong>${source.value.toFixed(2)} kg CO₂e</strong>
                </div>
            `)
            .join("");
}