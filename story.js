// story.js
(function () {
    function initStoryReel() {
        const track = document.getElementById("story-reel-track");
        if (!track) return;

        // Prevent duplicate population
        if (track.children.length > 0) return;

        // List of the 10 assets provided (photo5 is mp4, others are jpg)
        const mediaAssets = [
            { id: 1, type: "image", src: "photo1.jpg", alt: "Class Memory 1" },
            { id: 2, type: "image", src: "photo2.jpg", alt: "Class Memory 2" },
            { id: 3, type: "image", src: "photo3.jpg", alt: "Class Memory 3" },
            { id: 4, type: "image", src: "photo4.jpg", alt: "Class Memory 4" },
            { id: 5, type: "video", src: "photo5.mp4", alt: "Class Memory Video 5" },
            { id: 6, type: "image", src: "photo6.jpg", alt: "Class Memory 6" },
            { id: 7, type: "image", src: "photo7.jpg", alt: "Class Memory 7" },
            { id: 8, type: "image", src: "photo8.jpg", alt: "Class Memory 8" },
            { id: 9, type: "image", src: "photo9.jpg", alt: "Class Memory 9" },
            { id: 10, type: "image", src: "photo10.jpg", alt: "Class Memory 10" }
        ];

        mediaAssets.forEach((asset) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "story-item";
            itemDiv.setAttribute("data-id", asset.id);

            if (asset.type === "video") {
                const videoEl = document.createElement("video");
                videoEl.src = asset.src;
                videoEl.muted = true;
                videoEl.loop = true;
                videoEl.playsInline = true;
                // Auto-play muted video preview on loop
                videoEl.autoplay = true;
                itemDiv.appendChild(videoEl);
            } else {
                const imgEl = document.createElement("img");
                imgEl.src = asset.src;
                imgEl.alt = asset.alt;
                itemDiv.appendChild(imgEl);
            }

            // Click interaction handler for individual memory preview/lightbox
            itemDiv.addEventListener("click", () => {
                console.log(`Story item ${asset.id} clicked`);
            });

            track.appendChild(itemDiv);
        });

        // Enable mouse-drag-to-scroll functionality for desktop convenience
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener("mousedown", (e) => {
            isDown = true;
            track.classList.add("active");
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener("mouseleave", () => {
            isDown = false;
        });

        track.addEventListener("mouseup", () => {
            isDown = false;
        });

        track.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            track.scrollLeft = scrollLeft - walk;
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initStoryReel);
    } else {
        initStoryReel();
    }

    // Mutation observer fallback for dynamic rendering
    const observer = new MutationObserver(() => {
        const track = document.getElementById("story-reel-track");
        if (track && track.children.length === 0) {
            initStoryReel();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
