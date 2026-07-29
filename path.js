// path.js
(function () {
    function initMilestonePath() {
        // Data or states for the 9 milestones
        const milestones = [
            { id: 1, title: "Step 1", status: "current" },
            { id: 2, title: "Step 2", status: "current" },
            { id: 3, title: "Step 3", status: "current" },
            { id: 4, title: "Step 4", status: "current" },
            { id: 5, title: "Step 5", status: "current" },
            { id: 6, title: "Step 6", status: "current" },
            { id: 7, title: "Step 7", status: "current" },
            { id: 8, title: "Step 8", status: "current" },
            { id: 9, title: "Step 9", status: "current" }
        ];

        milestones.forEach((milestone) => {
            const slot = document.getElementById(`slot-${milestone.id}`);
            if (!slot) return;

            // Prevent duplicate rendering
            if (slot.children.length > 0) return;

            // Create the milestone node element
            const node = document.createElement("div");
            node.className = `milestone-node ${milestone.status}`;
            node.setAttribute("data-id", milestone.id);
            node.innerHTML = `<span>${milestone.id}</span>`;

            // Optional click handler for milestone interaction
            node.addEventListener("click", () => {
                console.log(`Milestone ${milestone.id} clicked`);
            });

            slot.appendChild(node);
        });

        // Data or states for the 9 badges
        const badges = [
            { id: 1, status: "completed", symbol: "★" },
            { id: 2, status: "completed", symbol: "★" },
            { id: 3, status: "completed", symbol: "★" },
            { id: 4, status: "completed", symbol: "★" },
            { id: 5, status: "completed", symbol: "★" },
            { id: 6, status: "completed", symbol: "★" },
            { id: 7, status: "completed", symbol: "★" },
            { id: 8, status: "completed", symbol: "★" },
            { id: 9, status: "completed", symbol: "★" }
        ];

        badges.forEach((badge) => {
            const slot = document.getElementById(`badge-slot-${badge.id}`);
            if (!slot) return;

            // Prevent duplicate rendering
            if (slot.children.length > 0) return;

            // Create the badge node element
            const badgeEl = document.createElement("div");
            badgeEl.className = `milestone-badge ${badge.status}`;
            badgeEl.setAttribute("data-badge-id", badge.id);
            badgeEl.innerHTML = `<span>${badge.symbol}</span>`;

            // Optional click handler for badge interaction
            badgeEl.addEventListener("click", () => {
                console.log(`Badge ${badge.id} clicked`);
            });

            slot.appendChild(badgeEl);
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
        if ((slot1 && slot1.children.length === 0) || (badgeSlot1 && badgeSlot1.children.length === 0)) {
            initMilestonePath();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
