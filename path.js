
// path.js
(function () {
    function buildStonePath() {
        const container = document.getElementById("stone-path-container");
        if (!container) return;
        
        // Prevent duplicate injection
        if (container.children.length > 0) return;

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
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildStonePath);
    } else {
        buildStonePath();
    }

    // Fallback observer in case container is populated dynamically later
    const observer = new MutationObserver(() => {
        const container = document.getElementById("stone-path-container");
        if (container && container.children.length === 0) {
            buildStonePath();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
