// Dynamic Product Loading System for VPOWER
// This script loads products from LocalStorage and integrates with existing HTML

// Product data structure matches the admin interface
let dynamicProducts = [];

// Product categories
const productCategories = {
    'wall-sconces': 'Wall Sconces',
    'chandeliers': 'Chandeliers', 
    'table-lamps': 'Table Lamps',
    'outdoor-lighting': 'Outdoor Lighting',
    'custom-designs': 'Custom Designs'
};

// Default products that show for everyone
const defaultProducts = [
    {
        id: 'default_2',
        name: 'Rustic Rope Wall Sconce',
        price: 2200.00,
        category: 'wall-sconces',
        description: 'A handcrafted wooden sconce featuring natural jute rope and a vintage filament bulb.',
        bestFor: 'Bedrooms, hallways, Living rooms, Bnbs',
        features: [
            'Natural jute rope accent',
            'Vintage filament bulb included',
            'Handcrafted wooden base'
        ],
        images: [
            'assets/images/Rustic Rope Wall sconce/image.webp',
            'assets/images/Rustic Rope Wall sconce/image (1).webp',
            'assets/images/Rustic Rope Wall sconce/image (6).webp'
        ],
        video: null
    }
];

// Filter out products with no valid images
function filterProductsWithImages(products) {
    return products.filter(product => {
        // Check if product has images array with at least one valid image
        if (!product.images || product.images.length === 0) {
            console.log(`Filtering out product "${product.name}" - no images`);
            return false;
        }
        
        // Check if first image exists and is not a placeholder
        const firstImage = product.images[0].data || product.images[0];
        if (!firstImage || firstImage.includes('No Image') || firstImage.includes('data:image/svg+xml')) {
            console.log(`Filtering out product "${product.name}" - invalid image`);
            return false;
        }
        
        return true;
    });
}

// Load products from LocalStorage
function loadDynamicProducts() {
    const savedProducts = localStorage.getItem('vpower_products');
    if (savedProducts) {
        dynamicProducts = JSON.parse(savedProducts);
        console.log('Loaded', dynamicProducts.length, 'products from LocalStorage');
    }
    
    // If no custom products, use defaults
    if (dynamicProducts.length === 0) {
        dynamicProducts = defaultProducts;
        console.log('Using default products for visitors');
    }
    
    // Filter out products with no valid images
    const originalCount = dynamicProducts.length;
    dynamicProducts = filterProductsWithImages(dynamicProducts);
    console.log(`Filtered out ${originalCount - dynamicProducts.length} products with no images`);
}

// Generate product HTML for the gallery
function generateProductHTML(product) {
    const mainImage = product.images && product.images.length > 0 
        ? (product.images[0].data || product.images[0])
        : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\' viewBox=\'0 0 400 300\'%3E%3Crect width=\'400\' height=\'300\' fill=\'%23ddd\'/%3E%3Ctext x=\'200\' y=\'150\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23666\' font-family=\'Arial\' font-size=\'16\'%3ENo Image%3C/text%3E%3C/svg%3E';
    
    const categoryBadge = product.category 
        ? `<span class="category-badge">${productCategories[product.category] || product.category}</span>`
        : '';
    
    const videoElement = product.video 
        ? `<video class="product-video" muted loop playsinline onclick="event.stopPropagation()">
             <source src="${product.video}" type="video/mp4">
           </video>`
        : '';
    
    const videoIcon = product.video 
        ? `<div class="video-indicator" onclick="playProductVideo('${product.id}'); event.stopPropagation();">🎥</div>`
        : '';
    
    const featuresHTML = product.features && product.features.length > 0 
        ? `<div class="product-features">
            <h4>Features:</h4>
            <ul>
                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>`
        : '';

    return `
        <div class="etsy-card" data-category="${product.category || 'all'}">
            <div class="etsy-card-image" onclick="openDynamicPackageModal('${product.id}')">
                <img src="${mainImage}" alt="${product.name}">
                ${videoElement ? `
                    <div class="video-overlay" onmouseenter="this.querySelector('video').play()" onmouseleave="this.querySelector('video').pause(); this.querySelector('video').currentTime = 0;">
                        ${videoElement}
                    </div>
                ` : ''}
                <button class="etsy-heart" data-product-id="${product.id}" onclick="toggleWishlist('${product.id}'); event.stopPropagation();">🤍</button>
            </div>
            <div class="etsy-card-content">
                <h3 class="etsy-title">${product.name}</h3>
                <div class="etsy-price">KES ${product.price.toFixed(2)}</div>
                <div class="etsy-seller">VPOWER Lighting & Decor</div>
                <div class="etsy-more" onclick="filterByCategory('${product.category || 'all'}')">more like this...</div>
            </div>
        </div>
    `;
}

// Render dynamic products to the gallery
function renderDynamicProducts() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) {
        console.error('Gallery grid not found!');
        return;
    }

    // Get existing static products HTML
    const staticProductsHTML = galleryGrid.innerHTML;
    
    // Add dynamic products
    const dynamicProductsHTML = dynamicProducts.map(product => generateProductHTML(product)).join('');
    
    // Combine static and dynamic products
    galleryGrid.innerHTML = staticProductsHTML + dynamicProductsHTML;
    
    console.log('Total dynamic products:', dynamicProducts.length);
    console.log('Dynamic products HTML length:', dynamicProductsHTML.length);
    
    if (dynamicProducts.length === 0) {
        console.log('No dynamic products found in LocalStorage');
    } else {
        console.log('Successfully rendered dynamic products');
    }
}

// Enhanced package modal for dynamic products
function openDynamicPackageModal(productId) {
    const product = dynamicProducts.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Create package data in the format expected by existing modal
    const dynamicPackageData = {
        [product.name]: {
            title: product.name,
            description: product.description,
            price: `KES ${product.price.toFixed(2)}`,
            images: product.images ? product.images.map(img => img.data) : []
        }
    };

    // Merge with existing package data
    const mergedPackageData = { ...window.packageData, ...dynamicPackageData };
    window.packageData = mergedPackageData;

    // Open the existing modal
    openPackageModal(product.name);
}

// Wishlist management
let wishlist = JSON.parse(localStorage.getItem('vpower_wishlist') || '[]');

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist!', 'success');
    }
    localStorage.setItem('vpower_wishlist', JSON.stringify(wishlist));
    updateWishlistButtons();
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        const isInWishlist = wishlist.includes(productId);
        btn.innerHTML = isInWishlist ? '❤️' : '🤍';
        btn.classList.toggle('active', isInWishlist);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: 'Georgia', serif;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize dynamic products when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadDynamicProducts();
    
    // Wait a bit for existing content to load, then render dynamic products
    setTimeout(() => {
        renderDynamicProducts();
        initializeCategoryFilters();
        updateWishlistButtons();
    }, 100);
});

// Export functions for global access
window.loadDynamicProducts = loadDynamicProducts;
window.renderDynamicProducts = renderDynamicProducts;
window.openDynamicPackageModal = openDynamicPackageModal;

// Category filtering
function filterByCategory(category) {
    const allCards = document.querySelectorAll('.product-card');
    
    allCards.forEach(card => {
        const cardCategory = card.dataset.category || 'all';
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update active filter button
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

// Video player
function playProductVideo(productId) {
    const product = dynamicProducts.find(p => p.id === productId);
    if (!product || !product.video) return;
    
    // Create video modal
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
        <div class="video-modal-content">
            <span class="video-close" onclick="closeVideoModal()">&times;</span>
            <video controls autoplay style="width: 100%; max-width: 800px;">
                <source src="${product.video}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    `;
    
    document.body.appendChild(videoModal);
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.remove();
    }
}

// Initialize category filters
function initializeCategoryFilters() {
    const gallerySection = document.querySelector('#gallery');
    if (!gallerySection) return;
    
    // Create category filter buttons with price filter
    const filterHTML = `
        <div class="category-filters">
            <button class="category-filter active" data-category="all" onclick="filterByCategory('all')">All Products</button>
            ${Object.entries(productCategories).map(([key, value]) => 
                `<button class="category-filter" data-category="${key}" onclick="filterByCategory('${key}')">${value}</button>`
            ).join('')}
            <div class="price-filter-container">
                <label for="priceFilter">Price:</label>
                <input type="range" id="priceFilter" min="0" max="50000" value="50000" step="1000" oninput="filterByPrice(this.value)">
                <span id="priceValue">KES 50,000</span>
            </div>
        </div>
    `;
    
    // Insert filters before gallery grid
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        galleryGrid.insertAdjacentHTML('beforebegin', filterHTML);
    }
}

// Price filtering
function filterByPrice(maxPrice) {
    const priceValue = document.getElementById('priceValue');
    priceValue.textContent = `KES ${parseInt(maxPrice).toLocaleString()}`;
    
    const allCards = document.querySelectorAll('.product-card');
    allCards.forEach(card => {
        const priceText = card.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace('KES ', '').replace(',', ''));
        
        if (price <= maxPrice) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Manual reload function for debugging
window.reloadProducts = function() {
    console.log('Manually reloading products...');
    loadDynamicProducts();
    renderDynamicProducts();
};
