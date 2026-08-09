/* =========================================================
   DIGITAL CARBON AUDITOR
   3D EARTH
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       WAIT FOR THREE.JS
    ====================================================== */

    if (typeof THREE === "undefined") {
        console.error(
            "Digital Carbon Auditor: Three.js is not loaded."
        );
        return;
    }


    /* =====================================================
       FIND EARTH CONTAINER
    ====================================================== */

    const container =
        document.getElementById("earth-canvas");

    if (!container) {
        console.error(
            "Digital Carbon Auditor: #earth-canvas not found."
        );
        return;
    }


    /* =====================================================
       CLEAN PREVIOUS EARTH
    ====================================================== */

    container.innerHTML = "";


    /* =====================================================
       SCENE
    ====================================================== */

    const scene = new THREE.Scene();


    /* =====================================================
       CAMERA
    ====================================================== */

    const camera = new THREE.PerspectiveCamera(
        38,
        container.clientWidth /
        Math.max(container.clientHeight, 1),
        0.1,
        100
    );

    camera.position.set(
        0,
        0,
        5.2
    );


    /* =====================================================
       RENDERER
    ====================================================== */

    const renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);


    /* =====================================================
       EARTH GROUP
    ====================================================== */

    const earthGroup =
        new THREE.Group();

    scene.add(earthGroup);


    /* =====================================================
       EARTH
    ====================================================== */

    const earthGeometry =
        new THREE.SphereGeometry(
            1.55,
            96,
            96
        );


    /*
       Procedural Earth texture.

       We generate the appearance locally instead of
       depending on an external image URL.
    */

    const earthCanvas =
        document.createElement("canvas");

    earthCanvas.width = 1024;
    earthCanvas.height = 512;

    const earthContext =
        earthCanvas.getContext("2d");


    /* =====================================================
       OCEAN BASE
    ====================================================== */

    const oceanGradient =
        earthContext.createLinearGradient(
            0,
            0,
            0,
            earthCanvas.height
        );

    oceanGradient.addColorStop(
        0,
        "#123f65"
    );

    oceanGradient.addColorStop(
        0.35,
        "#0877a6"
    );

    oceanGradient.addColorStop(
        0.65,
        "#05668b"
    );

    oceanGradient.addColorStop(
        1,
        "#092f52"
    );

    earthContext.fillStyle =
        oceanGradient;

    earthContext.fillRect(
        0,
        0,
        earthCanvas.width,
        earthCanvas.height
    );


    /* =====================================================
       LAND MASSES
    ====================================================== */

    /*
       These are intentionally irregular procedural
       land shapes so the Earth doesn't look like
       random green blobs.
    */

    function drawLandMass(
        points,
        color
    ) {

        earthContext.beginPath();

        points.forEach(
            (point, index) => {

                const x =
                    point[0] *
                    earthCanvas.width;

                const y =
                    point[1] *
                    earthCanvas.height;

                if (index === 0) {
                    earthContext.moveTo(
                        x,
                        y
                    );
                } else {
                    earthContext.lineTo(
                        x,
                        y
                    );
                }

            }
        );

        earthContext.closePath();

        earthContext.fillStyle =
            color;

        earthContext.fill();
    }


    /* North America */

    drawLandMass(
        [
            [0.08, 0.18],
            [0.15, 0.12],
            [0.22, 0.14],
            [0.27, 0.20],
            [0.25, 0.27],
            [0.29, 0.32],
            [0.24, 0.36],
            [0.20, 0.32],
            [0.16, 0.34],
            [0.13, 0.29],
            [0.08, 0.27],
            [0.06, 0.22]
        ],
        "#4f7d3a"
    );


    /* Central America */

    drawLandMass(
        [
            [0.25, 0.34],
            [0.29, 0.37],
            [0.30, 0.42],
            [0.27, 0.45],
            [0.25, 0.41]
        ],
        "#6e8738"
    );


    /* South America */

    drawLandMass(
        [
            [0.29, 0.43],
            [0.35, 0.45],
            [0.39, 0.51],
            [0.40, 0.59],
            [0.37, 0.68],
            [0.33, 0.77],
            [0.29, 0.72],
            [0.27, 0.63],
            [0.29, 0.56],
            [0.27, 0.49]
        ],
        "#5f8438"
    );


    /* Europe */

    drawLandMass(
        [
            [0.47, 0.20],
            [0.51, 0.18],
            [0.54, 0.21],
            [0.55, 0.26],
            [0.52, 0.29],
            [0.48, 0.27]
        ],
        "#658a42"
    );


    /* Africa */

    drawLandMass(
        [
            [0.48, 0.29],
            [0.54, 0.30],
            [0.58, 0.37],
            [0.57, 0.47],
            [0.54, 0.57],
            [0.49, 0.64],
            [0.46, 0.56],
            [0.45, 0.46],
            [0.47, 0.38]
        ],
        "#7b7135"
    );


    /* Asia */

    drawLandMass(
        [
            [0.54, 0.18],
            [0.63, 0.13],
            [0.73, 0.15],
            [0.79, 0.22],
            [0.77, 0.30],
            [0.69, 0.34],
            [0.61, 0.30],
            [0.55, 0.26]
        ],
        "#66813b"
    );


    /* India */

    drawLandMass(
        [
            [0.65, 0.32],
            [0.69, 0.35],
            [0.67, 0.43],
            [0.63, 0.39]
        ],
        "#6e8b3d"
    );


    /* Southeast Asia */

    drawLandMass(
        [
            [0.70, 0.35],
            [0.75, 0.37],
            [0.76, 0.45],
            [0.72, 0.48],
            [0.69, 0.42]
        ],
        "#4e7737"
    );


    /* Australia */

    drawLandMass(
        [
            [0.76, 0.55],
            [0.83, 0.53],
            [0.88, 0.58],
            [0.87, 0.67],
            [0.81, 0.71],
            [0.76, 0.66]
        ],
        "#7c7838"
    );


    /* Greenland */

    drawLandMass(
        [
            [0.35, 0.06],
            [0.42, 0.05],
            [0.45, 0.11],
            [0.41, 0.17],
            [0.36, 0.14]
        ],
        "#b4c6b3"
    );


    /* =====================================================
       LAND DETAIL
    ====================================================== */

    /*
       Add subtle darker/lighter patches to avoid
       flat cartoon-looking continents.
    */

    for (let i = 0; i < 120; i++) {

        const x =
            Math.random() *
            earthCanvas.width;

        const y =
            Math.random() *
            earthCanvas.height;

        const radius =
            Math.random() * 12 + 3;

        earthContext.beginPath();

        earthContext.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        earthContext.fillStyle =
            Math.random() > 0.5
                ? "rgba(25,70,30,0.12)"
                : "rgba(170,145,60,0.08)";

        earthContext.fill();
    }


    /* =====================================================
       CLOUDS
    ====================================================== */

    for (let i = 0; i < 180; i++) {

        const x =
            Math.random() *
            earthCanvas.width;

        const y =
            Math.random() *
            earthCanvas.height;

        const width =
            Math.random() * 35 + 8;

        const height =
            Math.random() * 5 + 2;

        earthContext.beginPath();

        earthContext.ellipse(
            x,
            y,
            width,
            height,
            Math.random(),
            0,
            Math.PI * 2
        );

        earthContext.fillStyle =
            "rgba(255,255,255,0.055)";

        earthContext.fill();
    }


    /* =====================================================
       POLAR ICE
    ====================================================== */

    earthContext.fillStyle =
        "rgba(235,248,245,0.8)";

    earthContext.fillRect(
        0,
        0,
        earthCanvas.width,
        16
    );

    earthContext.fillRect(
        0,
        earthCanvas.height - 16,
        earthCanvas.width,
        16
    );


    /* =====================================================
       TEXTURE
    ====================================================== */

    const earthTexture =
        new THREE.CanvasTexture(
            earthCanvas
        );

    earthTexture.colorSpace =
        THREE.SRGBColorSpace;

    earthTexture.anisotropy =
        renderer.capabilities.getMaxAnisotropy();


    /* =====================================================
       EARTH MATERIAL
    ====================================================== */

    const earthMaterial =
        new THREE.MeshPhongMaterial({

            map: earthTexture,

            shininess: 15,

            specular:
                new THREE.Color(
                    "#183b52"
                )

        });


    const earth =
        new THREE.Mesh(
            earthGeometry,
            earthMaterial
        );

    earthGroup.add(earth);


    /* =====================================================
       ATMOSPHERE
    ====================================================== */

    const atmosphereGeometry =
        new THREE.SphereGeometry(
            1.64,
            96,
            96
        );

    const atmosphereMaterial =
        new THREE.MeshBasicMaterial({

            color: "#4eb9ff",

            transparent: true,

            opacity: 0.10,

            side:
                THREE.BackSide,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });

    const atmosphere =
        new THREE.Mesh(
            atmosphereGeometry,
            atmosphereMaterial
        );

    earthGroup.add(atmosphere);


    /* =====================================================
       INNER ATMOSPHERE GLOW
    ====================================================== */

    const glowGeometry =
        new THREE.SphereGeometry(
            1.59,
            96,
            96
        );

    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: "#2a9cff",

            transparent: true,

            opacity: 0.045,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });

    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );

    earthGroup.add(glow);


    /* =====================================================
       LIGHTING
    ====================================================== */

    const ambientLight =
        new THREE.AmbientLight(
            "#a9d6ff",
            1.15
        );

    scene.add(ambientLight);


    /* Main sunlight */

    const sunLight =
        new THREE.DirectionalLight(
            "#ffffff",
            3.2
        );

    sunLight.position.set(
        -4,
        2.5,
        5
    );

    scene.add(sunLight);


    /* Soft green reflection */

    const greenLight =
        new THREE.DirectionalLight(
            "#65d995",
            0.35
        );

    greenLight.position.set(
        4,
        -2,
        -3
    );

    scene.add(greenLight);


    /* =====================================================
       STARS
    ====================================================== */

    const starGeometry =
        new THREE.BufferGeometry();

    const starCount = 900;

    const starPositions =
        new Float32Array(
            starCount * 3
        );

    for (
        let i = 0;
        i < starCount;
        i++
    ) {

        const radius =
            9 +
            Math.random() * 18;

        const theta =
            Math.random() *
            Math.PI *
            2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );

        starPositions[i * 3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        starPositions[i * 3 + 1] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        starPositions[i * 3 + 2] =
            radius *
            Math.cos(phi);

    }

    starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            starPositions,
            3
        )
    );

    const starMaterial =
        new THREE.PointsMaterial({

            color: "#ffffff",

            size: 0.025,

            transparent: true,

            opacity: 0.75,

            sizeAttenuation: true

        });

    const stars =
        new THREE.Points(
            starGeometry,
            starMaterial
        );

    scene.add(stars);


    /* =====================================================
       INITIAL ROTATION
    ====================================================== */

    earth.rotation.y = -0.65;

    earth.rotation.x = 0.05;

    atmosphere.rotation.y =
        earth.rotation.y;

    glow.rotation.y =
        earth.rotation.y;


    /* =====================================================
       MOUSE / TOUCH ROTATION
    ====================================================== */

    let dragging = false;

    let previousX = 0;

    let targetRotationY =
        earth.rotation.y;

    let targetRotationX =
        earth.rotation.x;


    renderer.domElement.addEventListener(
        "pointerdown",
        function (event) {

            dragging = true;

            previousX =
                event.clientX;

            renderer.domElement.setPointerCapture(
                event.pointerId
            );

        }
    );


    renderer.domElement.addEventListener(
        "pointermove",
        function (event) {

            if (!dragging) {
                return;
            }

            const movement =
                event.clientX -
                previousX;

            previousX =
                event.clientX;

            targetRotationY +=
                movement * 0.008;

        }
    );


    renderer.domElement.addEventListener(
        "pointerup",
        function () {

            dragging = false;

        }
    );


    renderer.domElement.addEventListener(
        "pointercancel",
        function () {

            dragging = false;

        }
    );


    /* Touch vertical movement */

    let previousTouchY = 0;

    renderer.domElement.addEventListener(
        "touchstart",
        function (event) {

            if (
                event.touches &&
                event.touches.length
            ) {

                previousTouchY =
                    event.touches[0].clientY;

            }

        },
        {
            passive: true
        }
    );


    renderer.domElement.addEventListener(
        "touchmove",
        function (event) {

            if (
                event.touches &&
                event.touches.length
            ) {

                const currentY =
                    event.touches[0].clientY;

                targetRotationX +=
                    (currentY -
                        previousTouchY) *
                    0.004;

                previousTouchY =
                    currentY;

                targetRotationX =
                    THREE.MathUtils.clamp(
                        targetRotationX,
                        -0.7,
                        0.7
                    );

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       RESIZE
    ====================================================== */

    function resize() {

        const width =
            container.clientWidth;

        const height =
            container.clientHeight;

        if (
            width <= 0 ||
            height <= 0
        ) {
            return;
        }

        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
            width,
            height,
            false
        );

    }


    window.addEventListener(
        "resize",
        resize
    );

    resize();


    /* =====================================================
       ANIMATION
    ====================================================== */

    let lastTime =
        performance.now();

    function animate(
        currentTime
    ) {

        requestAnimationFrame(
            animate
        );

        const delta =
            Math.min(
                (currentTime -
                    lastTime) /
                1000,
                0.05
            );

        lastTime =
            currentTime;


        /* Automatic rotation */

        if (!dragging) {

            targetRotationY +=
                delta * 0.12;

        }


        /* Smooth rotation */

        earth.rotation.y +=
            (
                targetRotationY -
                earth.rotation.y
            ) * 0.08;

        earth.rotation.x +=
            (
                targetRotationX -
                earth.rotation.x
            ) * 0.08;


        atmosphere.rotation.y =
            earth.rotation.y;

        atmosphere.rotation.x =
            earth.rotation.x;

        glow.rotation.y =
            earth.rotation.y;

        glow.rotation.x =
            earth.rotation.x;


        /* Slight star movement */

        stars.rotation.y +=
            delta * 0.003;


        renderer.render(
            scene,
            camera
        );

    }


    animate(
        performance.now()
    );


    /* =====================================================
       PLANET HEALTH API
    ====================================================== */

    /*
       Your scanner can call:

       window.updatePlanetHealth(75);

       to change the dashboard Earth state.

       Example:

       updatePlanetHealth(90);
    */

    window.updatePlanetHealth =
        function (health) {

            health =
                Number(health);

            if (
                Number.isNaN(health)
            ) {
                return;
            }

            health =
                Math.max(
                    0,
                    Math.min(
                        100,
                        health
                    )
                );


            const healthElement =
                document.getElementById(
                    "planet-health"
                );

            if (healthElement) {

                healthElement.textContent =
                    Math.round(
                        health
                    ) + "%";

            }


            /*
               The atmosphere becomes slightly
               brighter as the planet recovers.
            */

            atmosphereMaterial.opacity =
                0.07 +
                (
                    health / 100
                ) * 0.10;

            glowMaterial.opacity =
                0.025 +
                (
                    health / 100
                ) * 0.055;

        };


    /* =====================================================
       INITIAL HEALTH
    ====================================================== */

    window.updatePlanetHealth(
        24
    );


    console.log(
        "Digital Carbon Auditor: 3D Earth initialized."
    );

})();