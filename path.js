// path.js
(function () {
    function initMilestonePath() {
        // Data for the 9 milestones
        const milestones = [
            { id: 1, title: "Step 1" },
            { id: 2, title: "Step 2" },
            { id: 3, title: "Step 3" },
            { id: 4, title: "Step 4" },
            { id: 5, title: "Step 5" },
            { id: 6, title: "Step 6" },
            { id: 7, title: "Step 7" },
            { id: 8, title: "Step 8" },
            { id: 9, title: "Step 9" }
        ];

        milestones.forEach((milestone) => {
            const slot = document.getElementById(`slot-${milestone.id}`);
            if (!slot) return;

            // Prevent duplicate rendering
            if (slot.children.length > 0) return;

            // Create the milestone node element
            const node = document.createElement("div");
            node.className = "milestone-node";
            node.setAttribute("data-id", milestone.id);
            node.innerHTML = `<span>${milestone.id}</span>`;

            // Optional click handler for milestone interaction
            node.addEventListener("click", () => {
                console.log(`Milestone ${milestone.id} clicked`);
            });

            slot.appendChild(node);
        });

        // Data for the 9 badges
        const badges = [
            { id: 1, symbol: "★" },
            { id: 2, symbol: "★" },
            { id: 3, symbol: "★" },
            { id: 4, symbol: "★" },
            { id: 5, symbol: "★" },
            { id: 6, symbol: "★" },
            { id: 7, symbol: "★" },
            { id: 8, symbol: "★" },
            { id: 9, symbol: "★" }
        ];

        badges.forEach((badge) => {
            const slot = document.getElementById(`badge-slot-${badge.id}`);
            if (!slot) return;

            // Prevent duplicate rendering
            if (slot.children.length > 0) return;

            // Create the badge node element
            const badgeEl = document.createElement("div");
            badgeEl.className = "milestone-badge";
            badgeEl.setAttribute("data-badge-id", badge.id);
            badgeEl.innerHTML = `<span>${badge.symbol}</span>`;

            // Optional click handler for badge interaction
            badgeEl.addEventListener("click", () => {
                console.log(`Badge ${badge.id} clicked`);
            });

            slot.appendChild(badgeEl);
        });

        // Data for the 10 animations (5 left, 5 right)
        const animations = [
            { id: 1, label: "A1" },
            { id: 2, label: "A2" },
            { id: 3, label: "A3" },
            { id: 4, label: "A4" },
            { id: 5, label: "A5" },
            { id: 6, label: "A6" },
            { id: 7, label: "A7" },
            { id: 8, label: "A8" },
            { id: 9, label: "A9" },
            { id: 10, label: "A10" }
        ];

        animations.forEach((anim) => {
            const slot = document.getElementById(`anim-slot-${anim.id}`);
            if (!slot) return;

            // Prevent duplicate rendering
            if (slot.children.length > 0) return;

            // Create the animation element
            const animEl = document.createElement("div");
            animEl.className = "path-animation-item";
            animEl.setAttribute("data-anim-id", anim.id);
            animEl.innerHTML = `<span>${anim.label}</span>`;

            // Optional click handler for animation item interaction
            animEl.addEventListener("click", () => {
                console.log(`Animation item ${anim.id} clicked`);
            });

            slot.appendChild(animEl);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMilestonePath);
    } else {
        initMilestonePath();
    }

    // Fallback observer in case container is loaded dynamically
    const observer = new MutationObserver(() => {
        const slot1 = document.getElementById("slot-1");
        const badgeSlot1 = document.getElementById("badge-slot-1");
        const animSlot1 = document.getElementById("anim-slot-1");
        if (
            (slot1 && slot1.children.length === 0) || 
            (badgeSlot1 && badgeSlot1.children.length === 0) ||
            (animSlot1 && animSlot1.children.length === 0)
        ) {
            initMilestonePath();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
