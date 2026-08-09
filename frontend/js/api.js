const API_BASE_URL =
    "https://digital-carbon-auditor.onrender.com/api";
    
async function apiRequest(endpoint, options = {}) {

    const token =
        localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };


    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );


    const contentType =
        response.headers.get("content-type") || "";


    if (!contentType.includes("application/json")) {

        const text = await response.text();

        console.error(
            "Server returned non-JSON:",
            text
        );

        throw new Error(
            `Server returned ${response.status}`
        );
    }


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Request failed"
        );
    }


    return data;
}