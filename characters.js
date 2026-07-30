console.log("characters.js loaded");

window.addEventListener("load", () => {

    const object = document.getElementById("bird7");

    object.addEventListener("load", () => {

        const svg = object.contentDocument;

        const body = svg.getElementById("body");

        body.setAttribute("fill", "#22C55E");

        console.log("Bird loaded!");

    });

});
