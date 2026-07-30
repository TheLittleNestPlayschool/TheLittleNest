window.addEventListener("load", function () {

    const object = document.getElementById("bird7");
    const svg = object.contentDocument;
    const body = svg.getElementById("body");

    body.setAttribute("fill", "#22C55E");

    let scale = 1;
    let direction = 1;

    setInterval(() => {

        scale += direction * 0.01;

        if (scale > 1.08) direction = -1;
        if (scale < 0.92) direction = 1;

        body.setAttribute(
            "transform",
            `translate(50 50) scale(${scale}) translate(-50 -50)`
        );

    }, 30);

});
