window.addEventListener("load", function () {

    const object = document.getElementById("bird7");
    const svg = object.contentDocument;

    const bird = svg.getElementById("bird");

    const eyes = svg.getElementById("eyes");
    const eyesClosed = svg.getElementById("eyesClosed");

    // -------------------------
    // BREATHING
    // -------------------------

    let scale = 1;
    let direction = 1;

    setInterval(() => {

        scale += direction * 0.003;

        if (scale > 1.04) direction = -1;
        if (scale < 0.96) direction = 1;

        bird.setAttribute(
            "transform",
            `translate(50 50) scale(${scale}) translate(-50 -50)`
        );

    }, 30);

    // -------------------------
    // BLINKING
    // -------------------------

    function blink() {

        eyes.setAttribute("visibility", "hidden");
        eyesClosed.setAttribute("visibility", "visible");

        setTimeout(() => {

            eyes.setAttribute("visibility", "visible");
            eyesClosed.setAttribute("visibility", "hidden");

        }, 150);

    }

    function scheduleBlink() {

        blink();

        const nextBlink = 2000 + Math.random() * 4000;

        setTimeout(scheduleBlink, nextBlink);

    }

    setTimeout(scheduleBlink, 2000);

});
