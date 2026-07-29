// path.js
(function () {
    function initMilestonePath() {
        // Data or states for the 9 milestones
        // You can map your student progress or milestone status here
        const milestones = [
            { id: 1, title: "Step 1", status: "completed" },
            { id: 2, title: "Step 2", status: "completed" },
            { id: 3, title: "Step 3", status: "current" },
            { id: 4, title: "Step 4", status: "locked" },
            { id: 5, title: "Step 5", status: "locked" },
            { id: 6, title: "Step 6", status: "locked" },
            { id: 7, title: "Step 7", status: "locked" },
            { id: 8, title: "Step 8", status: "locked" },
            { id: 9, title: "Step 9", status: "locked" }
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
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMilestonePath);
    } else {
        initMilestonePath();
    }

    // Fallback observer in case container is loaded dynamically
    const observer = new MutationObserver(() => {
        const slot1 = document.getElementById("slot-1");
        if (slot1 && slot1.children.length === 0) {
            initMilestonePath();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
