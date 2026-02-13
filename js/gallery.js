// Gallery Media Loader
class GalleryLoader {
    constructor() {
        this.galleryFolder = 'assets/gallery/';
        this.mediaFiles = [];
        this.init();
    }

    async init() {
        try {
            await this.loadGalleryMedia();
            this.renderGallery();
        } catch (error) {
            console.error('Error loading gallery:', error);
        }
    }

    async loadGalleryMedia() {
        // List of files in the gallery folder (from directory listing)
        // Note: GitHub Pages may have restrictions on large video files
        const files = [
            'WhatsApp Image 2026-02-10 at 5.12.17 PM.jpeg',
            'WhatsApp Image 2026-02-10 at 5.12.18 PM.jpeg',
            'WhatsApp Image 2026-02-10 at 5.27.34 PM.jpeg',
            // Include smaller video files first for GitHub Pages compatibility
            'WhatsApp Video 2026-02-10 at 2.53.44 PM.mp4',
            'WhatsApp Video 2026-02-10 at 5.27.33 PM.mp4',
            'WhatsApp Video 2026-02-10 at 5.12.52 PM.mp4',
            'WhatsApp Video 2026-02-10 at 5.12.51 PM.mp4',
            'WhatsApp Video 2026-02-10 at 5.12.50 PM.mp4',
            'WhatsApp Video 2026-02-10 at 2.53.43 PM (3).mp4',
            'WhatsApp Video 2026-02-10 at 5.27.34 PM (1).mp4',
            'WhatsApp Video 2026-02-10 at 5.27.34 PM.mp4',
            'WhatsApp Video 2026-02-10 at 5.27.30 PM (1).mp4',
            'WhatsApp Video 2026-02-10 at 5.27.30 PM.mp4',
            'WhatsApp Video 2026-02-10 at 5.27.29 PM (1).mp4',
            'WhatsApp Video 2026-02-10 at 5.27.29 PM.mp4',
            'WhatsApp Video 2026-02-10 at 5.27.25 PM.mp4',
            'WhatsApp Video 2026-02-10 at 2.53.43 PM (2).mp4',
            'WhatsApp Video 2026-02-10 at 2.53.43 PM (1).mp4',
            'WhatsApp Video 2026-02-10 at 2.53.43 PM.mp4',
            'WhatsApp Video 2026-02-10 at 2.53.42 PM.mp4',
            'WhatsApp Video 2026-02-10 at 2.53.28 PM.mp4',
            'WhatsApp Video 2026-02-10 at 2.53.04 PM.mp4',
            'WhatsApp Video 2026-02-10 at 2.28.18 PM.mp4',
            'WhatsApp Video 2026-02-10 at 2.28.11 PM.mp4',
            'WhatsApp Video 2026-02-10 at 5.12.19 PM.mp4',
            'WhatsApp Video 2026-02-10 at 5.12.17 PM (1).mp4',
            'WhatsApp Video 2026-02-10 at 5.12.17 PM.mp4',
            'WhatsApp Video 2026-02-10 at 5.12.16 PM (1).mp4',
            'WhatsApp Video 2026-02-10 at 5.12.16 PM.mp4',
            'image (1).png',
            'image (2).png',
            'image (3).png',
            'image (4).png',
            'image.png'
        ];

        this.mediaFiles = files.map(file => {
            const extension = file.split('.').pop().toLowerCase();
            const isVideo = ['mp4', 'webm', 'ogg'].includes(extension);
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
            
            return {
                name: file,
                path: this.galleryFolder + file,
                type: isVideo ? 'video' : (isImage ? 'image' : 'unknown'),
                extension: extension
            };
        }).filter(file => file.type !== 'unknown');
    }

    renderGallery() {
        const mediaGallery = document.getElementById('mediaGallery');
        if (!mediaGallery) {
            console.error('Media gallery container not found');
            return;
        }

        const galleryHTML = `
            <div class="media-gallery-header">
                <h3>VPOWER Media Gallery</h3>
                <p>Behind the scenes of our craft - images and videos of our lighting creations</p>
            </div>
            <div class="media-gallery-grid">
                ${this.mediaFiles.map(media => this.createMediaItem(media)).join('')}
            </div>
        `;

        mediaGallery.innerHTML = galleryHTML;
        this.setupMediaInteractions();
    }

    createMediaItem(media) {
        if (media.type === 'video') {
            return `
                <div class="media-item video-item" data-media-path="${media.path}">
                    <video 
                        class="media-video" 
                        muted 
                        loop 
                        playsinline
                        preload="metadata"
                        onloadeddata="console.log('Video loaded successfully:', '${media.path}')"
                        onerror="console.error('Video failed to load:', '${media.path}'); this.parentElement.classList.add('video-error');"
                        onmouseenter="if(this.readyState >= 2) { this.play(); this.parentElement.querySelector('.play-icon').style.display = 'none'; } else { console.log('Video not ready for playback'); }"
                        onmouseleave="this.pause(); this.currentTime = 0; this.parentElement.querySelector('.play-icon').style.display = 'flex';"
                        onclick="galleryLoader.openLightbox('${media.path}', '${media.type}')">
                        <source src="${media.path}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="media-overlay">
                        <div class="play-icon">▶️</div>
                        <div class="media-title">${this.formatFileName(media.name)}</div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="media-item image-item" data-media-path="${media.path}">
                    <img 
                        src="${media.path}" 
                        alt="${this.formatFileName(media.name)}"
                        class="media-image"
                        onclick="galleryLoader.openLightbox('${media.path}', '${media.type}')"
                        loading="lazy">
                    <div class="media-overlay">
                        <div class="expand-icon">🔍</div>
                        <div class="media-title">${this.formatFileName(media.name)}</div>
                    </div>
                </div>
            `;
        }
    }

    formatFileName(fileName) {
        return fileName
            .replace(/\.(jpg|jpeg|png|mp4)$/i, '')
            .replace(/WhatsApp (Image|Video) \d{4}-\d{2}-\d{2} at \d{1,2}\.\d{2}\.\d{2} (AM|PM)/i, 'VPOWER Creation')
            .replace(/\s*\(\d+\)/g, '')
            .replace(/image\s*\(\d+\)/i, 'Design Sketch')
            .trim();
    }

    setupMediaInteractions() {
        // Add hover effects and other interactions
        const mediaItems = document.querySelectorAll('.media-item');
        mediaItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const overlay = item.querySelector('.media-overlay');
                if (overlay) {
                    overlay.style.opacity = '1';
                }
                
                // Handle video hover
                const video = item.querySelector('.media-video');
                const playIcon = item.querySelector('.play-icon');
                if (video && playIcon) {
                    video.play().catch(e => console.log('Video play failed:', e));
                    playIcon.style.display = 'none';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const overlay = item.querySelector('.media-overlay');
                if (overlay) {
                    overlay.style.opacity = '0';
                }
                
                // Handle video leave
                const video = item.querySelector('.media-video');
                const playIcon = item.querySelector('.play-icon');
                if (video && playIcon) {
                    video.pause();
                    video.currentTime = 0;
                    playIcon.style.display = 'flex';
                }
            });
        });
    }

    playVideo(videoElement) {
        if (videoElement.paused) {
            videoElement.play();
            videoElement.parentElement.querySelector('.play-icon').style.display = 'none';
        } else {
            videoElement.pause();
            videoElement.parentElement.querySelector('.play-icon').style.display = 'block';
        }
    }

    openLightbox(mediaPath, mediaType) {
        const lightbox = document.createElement('div');
        lightbox.className = 'media-lightbox active';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="this.parentElement.parentElement.remove()">×</button>
                ${mediaType === 'video' 
                    ? `<video controls autoplay muted><source src="${mediaPath}" type="video/mp4"></video>`
                    : `<img src="${mediaPath}" alt="Gallery Image">`
                }
            </div>
        `;
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.remove();
            }
        });
        
        document.body.appendChild(lightbox);
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.galleryLoader = new GalleryLoader();
});
