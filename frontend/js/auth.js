document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const logoutButtons = document.querySelectorAll("#logout-btn, #settings-logout");

    logoutButtons.forEach(button => {
        button.addEventListener("click", logout);
    });

    loadSettings();
});


function handleRegister(event) {

    event.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const company = document.getElementById("register-company").value.trim();

    const message = document.getElementById("register-message");

    if (password.length < 6) {
        showMessage(message, "Password must contain at least 6 characters.", true);
        return;
    }

    const user = {
        name,
        email,
        password,
        company
    };

    localStorage.setItem("dca_user", JSON.stringify(user));
    localStorage.setItem("dca_logged_in", "true");

    window.location.href = "dashboard.html";
}


function handleLogin(event) {

    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const message = document.getElementById("login-message");

    const storedUser = JSON.parse(
        localStorage.getItem("dca_user")
    );

    if (!storedUser) {
        showMessage(
            message,
            "No account found. Please register first.",
            true
        );
        return;
    }

    if (
        storedUser.email !== email ||
        storedUser.password !== password
    ) {
        showMessage(
            message,
            "Invalid email or password.",
            true
        );
        return;
    }

    localStorage.setItem("dca_logged_in", "true");

    window.location.href = "dashboard.html";
}


function logout() {

    localStorage.removeItem("dca_logged_in");

    window.location.href = "login.html";
}


function loadSettings() {

    const nameInput = document.getElementById("settings-name");

    if (!nameInput) return;

    const user = JSON.parse(
        localStorage.getItem("dca_user")
    );

    if (!user) return;

    document.getElementById("settings-name").value =
        user.name || "";

    document.getElementById("settings-email").value =
        user.email || "";

    document.getElementById("settings-company").value =
        user.company || "";

    const form = document.getElementById("settings-form");

    form.addEventListener("submit", event => {

        event.preventDefault();

        user.name =
            document.getElementById("settings-name").value.trim();

        user.email =
            document.getElementById("settings-email").value.trim();

        user.company =
            document.getElementById("settings-company").value.trim();

        localStorage.setItem(
            "dca_user",
            JSON.stringify(user)
        );

        showMessage(
            document.getElementById("settings-message"),
            "Profile updated successfully."
        );
    });
}


function showMessage(element, message, error = false) {

    if (!element) return;

    element.textContent = message;

    element.className =
        error
            ? "form-message error"
            : "form-message success";
}