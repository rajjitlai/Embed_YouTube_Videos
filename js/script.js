// Configuration
const apiKey = "your_API_key"; // Replace with your YouTube Data API v3 key
const playlistId = "PLWKjhJtqVAbkm_77Y2NOf0jYisXvW6u9D"; // Example: FreeCodeCamp Python Playlist
const maxResults = 6;

const videosContainer = document.getElementById("vidContainer");

/**
 * Fetch and render videos
 */
async function fetchVideos() {
    try {
        // Show skeletons initially (already in HTML)
        
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Clear skeletons
        videosContainer.innerHTML = "";

        if (!data.items || data.items.length === 0) {
            videosContainer.innerHTML = `<div class="error-state">No videos found. Check your API key and Playlist ID.</div>`;
            return;
        }

        data.items.forEach((item, index) => {
            const videoId = item.snippet.resourceId.videoId;
            const videoTitle = item.snippet.title;
            const thumbnailUrl = item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : item.snippet.thumbnails.medium.url;

            const videoCard = document.createElement("div");
            videoCard.className = "video-card glass";
            videoCard.style.animationDelay = `${index * 0.1}s`;
            
            videoCard.innerHTML = `
                <div class="video-wrapper">
                    <iframe src="https://www.youtube.com/embed/${videoId}" 
                            title="${videoTitle}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen></iframe>
                </div>
                <h3>${videoTitle}</h3>
            `;

            videosContainer.appendChild(videoCard);
        });
    } catch (error) {
        console.error("Error fetching videos:", error);
        videosContainer.innerHTML = `
            <div class="error-message glass">
                <p>Failed to load videos</p>
                <small>${error.message}</small>
                <p style="margin-top: 10px; font-size: 0.8rem; opacity: 0.7;">Make sure to provide a valid YouTube API key and Playlist ID in <code>js/script.js</code>.</p>
            </div>
        `;
    }
}

// Initialize
if (apiKey === "your_API_key") {
    // If no key is provided, show a friendly setup message
    videosContainer.innerHTML = `
        <div class="setup-message glass" style="grid-column: 1 / -1; padding: 40px; text-align: center;">
            <h3 style="margin-bottom: 10px;">Ready for Connection</h3>
            <p>Please add your <strong>YouTube Data API v3 Key</strong> to <code>js/script.js</code> to see the dynamic Python playlist.</p>
            <div style="margin-top: 20px; font-size: 0.9rem; color: #3f72af;">
                <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" style="color: inherit;">Get an API Key here &rarr;</a>
            </div>
        </div>
    `;
} else {
    fetchVideos();
}
