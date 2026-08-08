document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("calculator-form");

    if (!form) return;

    const inputs = [
        "electricity",
        "fuel",
        "transportation",
        "travel",
        "waste"
    ];

    inputs.forEach(id => {

        const input = document.getElementById(id);

        input.addEventListener("input", calculateEmissions);

    });

    form.addEventListener("submit", saveAudit);

});


function getValues() {

    return {
        electricity: Number(
            document.getElementById("electricity").value
        ),

        fuel: Number(
            document.getElementById("fuel").value
        ),

        transportation: Number(
            document.getElementById("transportation").value
        ),

        travel: Number(
            document.getElementById("travel").value
        ),

        waste: Number(
            document.getElementById("waste").value
        )
    };
}


function calculateEmissions() {

    const values = getValues();

    /*
     * TEMPORARY DEMO FACTORS
     *
     * These are NOT the final authoritative factors.
     * Backend calculation will replace this later.
     */

    const emissions =
        values.electricity * 0.4 +
        values.fuel * 2.3 +
        values.transportation * 0.12 +
        values.travel * 0.15 +
        values.waste * 0.5;

    document.getElementById(
        "calculated-emissions"
    ).textContent =
        `${emissions.toFixed(2)} kg CO₂e`;

    return emissions;
}


function saveAudit(event) {

    event.preventDefault();

    const emissions = calculateEmissions();

    const company =
        document.getElementById("company-name").value.trim();

    const period =
        document.getElementById("audit-period").value;

    if (!company) return;

    const values = getValues();

    const score = Math.max(
        0,
        Math.min(
            100,
            Math.round(100 - emissions / 10)
        )
    );

    const audit = {
        id: Date.now(),
        company,
        period,
        emissions: Number(emissions.toFixed(2)),
        score,
        date: new Date().toISOString(),
        categories: values
    };

    const audits = JSON.parse(
        localStorage.getItem("dca_audits") || "[]"
    );

    audits.unshift(audit);

    localStorage.setItem(
        "dca_audits",
        JSON.stringify(audits)
    );

    document.getElementById(
        "calculator-message"
    ).textContent =
        "Audit saved successfully.";

    document.getElementById(
        "calculator-message"
    ).className =
        "form-message success";

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 800);
}