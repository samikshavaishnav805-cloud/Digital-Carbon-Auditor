const earth = document.getElementById("earth");
const planetHealth = document.getElementById("planet-health");

const wasteCount = document.getElementById("waste-count");
const deleteButton = document.getElementById("delete-waste-btn");
const wasteMessage = document.getElementById("waste-message");

let health = 24;
let digitalWaste = 100;

function updatePlanet() {
    if (!earth) return;

    const healthProgress = health / 100;

    // Update percentage
    if (planetHealth) {
        planetHealth.textContent = `${health}%`;
    }

    // Update waste count
    if (wasteCount) {
        wasteCount.textContent = digitalWaste;
    }

    // Send health value to CSS
    earth.style.setProperty("--health", healthProgress);

    // Make land greener
    const lands = document.querySelectorAll(".earth-land");

    lands.forEach((land) => {
        land.style.filter = `
            saturate(${0.3 + healthProgress * 1.5})
            brightness(${0.5 + healthProgress * 0.7})
        `;
    });

    // Remove pollution
    const pollution = document.querySelectorAll(".pollution");

    pollution.forEach((item, index) => {
        const opacity = Math.max(
            0,
            1 - healthProgress * 1.4 - index * 0.15
        );

        item.style.opacity = opacity;

        if (healthProgress > 0.65) {
            item.style.transform = "scale(0.5)";
        }

        if (healthProgress > 0.85) {
            item.style.transform = "scale(0)";
        }
    });

    // Change Earth itself
    earth.style.background = `
        radial-gradient(
            circle at 35% 30%,
            rgba(80, ${90 + healthProgress * 120}, 80, 0.8),
            transparent 35%
        ),
        radial-gradient(
            circle at 50% 50%,
            rgb(
                ${20 - healthProgress * 8},
                ${35 + healthProgress * 45},
                ${28 + healthProgress * 20}
            ),
            #050907 75%
        )
    `;

    // Change glow
    const glow = document.querySelector(".earth-glow");

    if (glow) {
        glow.style.opacity = 0.2 + healthProgress * 0.8;
        glow.style.transform =
            `scale(${0.9 + healthProgress * 0.15})`;
    }
}

function deleteDigitalWaste() {

    if (digitalWaste <= 0) {
        return;
    }

    digitalWaste -= 10;
    health += 5;

    if (digitalWaste < 0) {
        digitalWaste = 0;
    }

    if (health > 100) {
        health = 100;
    }

    updatePlanet();

    if (health >= 100) {

        if (wasteMessage) {
            wasteMessage.textContent =
                "The planet is completely clean. 🌍✨";
        }

        if (deleteButton) {
            deleteButton.disabled = true;
            deleteButton.innerHTML =
                "✓ Planet Clean";
        }

    } else {

        if (wasteMessage) {
            wasteMessage.textContent =
                "Digital waste removed. The planet is getting healthier. 🌱";
        }
    }
}

if (deleteButton) {
    deleteButton.addEventListener(
        "click",
        deleteDigitalWaste
    );
}

// Initial state
updatePlanet();