// path.js
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("stone-path-container");
    if (!container) return;

    let html = '';

    // Step 1: Starting point (Left)
    html += `
        <div class="path-step-row left-side">
            <div class="stone-step-graphic"></div>
        </div>
    `;

    // 5 steps going down and to the right
    for (let i = 0; i < 5; i++) {
        html += `
            <div class="path-step-row right-side">
                <div class="stone-step-graphic"></div>
            </div>
        `;
    }

    // 5 steps going down to the left
    for (let i = 0; i < 5; i++) {
        html += `
            <div class="path-step-row left-side">
                <div class="stone-step-graphic"></div>
            </div>
        `;
    }

    container.innerHTML = html;
});
