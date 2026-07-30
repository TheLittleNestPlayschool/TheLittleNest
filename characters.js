window.addEventListener("load", function () {

    console.log("Page Loaded");

    const object = document.getElementById("bird7");

    const svg = object.contentDocument;

    console.log(svg);

    const body = svg.getElementById("body");

    console.log(body);

    body.setAttribute("fill", "#22C55E");

});
