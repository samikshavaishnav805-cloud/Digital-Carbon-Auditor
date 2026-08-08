document.addEventListener("DOMContentLoaded", () => {

    const audits = JSON.parse(
        localStorage.getItem("dca_audits") || "[]"
    );

    const table =
        document.getElementById("history-table");

    if (!audits.length) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">
                    No audits have been created yet.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = audits.map((audit, index) => `

        <tr>

            <td>
                <strong>Audit #${audits.length - index}</strong>
                <small>${escapeHTML(audit.company)}</small>
            </td>

            <td>
                ${formatDate(audit.date)}
            </td>

            <td>
                ${audit.emissions} kg
            </td>

            <td>
                ${audit.score}/100
            </td>

            <td>
                <span class="status-badge">
                    Completed
                </span>
            </td>

            <td>
                <a
                    href="reports.html"
                    class="table-action"
                >
                    View
                </a>
            </td>

        </tr>

    `).join("");

});


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