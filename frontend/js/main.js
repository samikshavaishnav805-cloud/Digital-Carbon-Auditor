document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       LUCIDE ICONS
       ===================================================== */

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }


    /* =====================================================
       EARTH + DIGITAL WASTE
       ===================================================== */

    const earth = document.getElementById("earth");
    const planetHealth = document.getElementById("planet-health");
    const wasteCount = document.getElementById("waste-count");
    const deleteWasteBtn = document.getElementById("delete-waste-btn");
    const wasteMessage = document.getElementById("waste-message");

    let remainingWaste = 100;


    function calculatePlanetHealth() {

        /*
         * Initial state:
         * 100 files = 24% planet health
         *
         * Final state:
         * 0 files = 100% planet health
         */

        const health =
            24 + ((100 - remainingWaste) * 76) / 100;

        return Math.round(
            Math.min(100, Math.max(24, health))
        );
    }


    function updateEarth() {

        if (!earth) return;

        const health = calculatePlanetHealth();

        /* ---------------------------------------------
           Update numbers
        --------------------------------------------- */

        if (planetHealth) {
            planetHealth.textContent = `${health}%`;
        }

        if (wasteCount) {
            wasteCount.textContent = remainingWaste;
        }


        /* ---------------------------------------------
           Calculate visual state
        --------------------------------------------- */

        const pollution =
            0.82 - (health / 100) * 0.76;

        const brightness =
            0.68 + (health / 100) * 0.34;

        const saturation =
            0.70 + (health / 100) * 0.65;


        earth.style.setProperty(
            "--pollution",
            Math.max(0.05, pollution)
        );

        earth.style.setProperty(
            "--brightness",
            brightness
        );

        earth.style.setProperty(
            "--saturation",
            saturation
        );


        /* ---------------------------------------------
           Remove previous health states
        --------------------------------------------- */

        earth.classList.remove(
            "health-medium",
            "health-high",
            "health-perfect"
        );


        /* ---------------------------------------------
           Add current health state
        --------------------------------------------- */

        if (health >= 90) {

            earth.classList.add("health-perfect");

        } else if (health >= 65) {

            earth.classList.add("health-high");

        } else if (health >= 45) {

            earth.classList.add("health-medium");
        }


        /* ---------------------------------------------
           Atmospheric glow
        --------------------------------------------- */

        const atmosphere =
            document.querySelector(".earth-atmosphere");

        const glow =
            document.querySelector(".earth-glow");


        if (atmosphere) {

            const glowStrength =
                0.2 + (health / 100) * 0.7;

            atmosphere.style.boxShadow = `
                0 0 12px rgba(
                    80,
                    205,
                    255,
                    ${glowStrength}
                ),
                0 0 35px rgba(
                    30,
                    160,
                    255,
                    ${glowStrength * 0.5}
                ),
                inset 4px 0 12px
                rgba(80, 210, 255, 0.25)
            `;
        }


        if (glow) {

            const glowOpacity =
                0.08 + (health / 100) * 0.25;

            glow.style.background = `
                radial-gradient(
                    circle,
                    rgba(
                        55,
                        210,
                        150,
                        ${glowOpacity}
                    ) 0%,

                    rgba(
                        40,
                        150,
                        255,
                        0.08
                    ) 45%,

                    transparent 72%
                )
            `;
        }


        /* ---------------------------------------------
           Update message
        --------------------------------------------- */

        if (wasteMessage) {

            if (remainingWaste === 0) {

                wasteMessage.textContent =
                    "Your digital space is clean. The planet is healthier. 🌍";

            } else if (health >= 75) {

                wasteMessage.textContent =
                    "Amazing progress. Your digital footprint is getting cleaner.";

            } else if (health >= 50) {

                wasteMessage.textContent =
                    "Great work. Keep cleaning your digital footprint.";

            } else {

                wasteMessage.textContent =
                    "Clean your digital footprint and help the planet.";
            }
        }
    }


    /* =====================================================
       EARTH CLEANING ANIMATION
       ===================================================== */

    function animateEarth() {

        if (!earth) return;

        earth.classList.remove("earth-cleaning");

        /*
         * Force browser reflow so the animation
         * can restart every time the button is clicked.
         */

        void earth.offsetWidth;

        earth.classList.add("earth-cleaning");

        setTimeout(() => {

            earth.classList.remove("earth-cleaning");

        }, 900);
    }


    /* =====================================================
       DELETE DIGITAL WASTE
       ===================================================== */

    if (deleteWasteBtn) {

        deleteWasteBtn.addEventListener("click", () => {

            if (remainingWaste <= 0) {

                if (wasteMessage) {

                    wasteMessage.textContent =
                        "All digital waste has already been cleaned. 🌱";
                }

                return;
            }


            /*
             * TEMPORARY DEMO BEHAVIOR
             *
             * Each click represents 10 deleted files.
             *
             * This will later be replaced by the
             * real file/folder scanner.
             */

            remainingWaste =
                Math.max(0, remainingWaste - 10);


            /* Animate Earth */

            animateEarth();


            /* Update Earth */

            updateEarth();

        });
    }


    /* =====================================================
       INITIAL EARTH STATE
       ===================================================== */

    updateEarth();


    /* =====================================================
       BACKEND CONNECTION TEST
       ===================================================== */

    async function testBackend() {

        try {

            const response =
                await apiRequest("/health");

            console.log(
                "Backend connected:",
                response
            );

        } catch (error) {

            console.error(
                "Backend connection failed:",
                error.message
            );
        }
    }


    /*
     * Only test backend if apiRequest exists.
     * Prevents the frontend from crashing if
     * api.js hasn't loaded.
     */

    if (typeof apiRequest === "function") {

        testBackend();

    } else {

        console.warn(
            "apiRequest is not available. Check that api.js loads before main.js."
        );
    }

});