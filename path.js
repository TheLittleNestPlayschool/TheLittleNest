// path.js
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("stone-path-container");
    if (!container) return;

    // Structure mapping based on your path description:
    // 1. First step (Left) with circle location placeholder
    // 2. 5 steps going down and to the right
    // 3. Next circle location placeholder (Right)
    // 4. 5 steps going down to the left
    // 5. Final circle location placeholder (Left)
    
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
