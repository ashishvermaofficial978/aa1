// Load products on the home page
async function loadProducts() {
    try {
        const response = await fetch('js/products.json');
        const data = await response.json();
        const productsContainer = document.getElementById('products-grid');

        data.products.forEach(product => {
            const productCard = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price}</p>
                    <button onclick="viewProduct(${product.id})">View Details</button>
                </div>
            `;
            productsContainer.innerHTML += productCard;
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Navigate to product detail page
function viewProduct(productId) {
    window.location.href = `pages/product-detail.html?id=${productId}`;
}

// Load product details on the product detail page
async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    try {
        const response = await fetch('../js/products.json');
        const data = await response.json();
        const product = data.products.find(p => p.id === parseInt(productId));

        if (product) {
            // Main product details
            document.getElementById('product-details').innerHTML = `
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-badges">
                        <span class="badge new">New Arrival</span>
                        <span class="badge warranty">1 Year Warranty</span>
                    </div>
                </div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <div class="product-rating">
                        <div class="stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                        </div>
                        <span class="rating-count">(4.5/5 based on 24 reviews)</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        <span class="original-price">$${(product.price * 1.2).toFixed(2)}</span>
                        <span class="discount">20% OFF</span>
                    </div>
                    <div class="product-description">
                        ${product.description}
                    </div>
                    <div class="product-features">
                        <div class="feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Premium Quality</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-truck"></i>
                            <span>Free Shipping</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-undo"></i>
                            <span>30-Day Returns</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <div class="quantity-selector">
                            <button class="qty-btn minus"><i class="fas fa-minus"></i></button>
                            <input type="number" value="1" min="1" max="10">
                            <button class="qty-btn plus"><i class="fas fa-plus"></i></button>
                        </div>
                        <button class="add-to-cart-btn">
                            <i class="fas fa-cart-plus"></i>
                            Add to Cart
                        </button>
                        <button class="buy-now-btn" onclick="buyProduct()">
                            <i class="fas fa-bolt"></i>
                            Buy Now
                        </button>
                    </div>
                </div>
            `;

            // Load similar products
            const similarProducts = data.products
                .filter(p => p.id !== parseInt(productId))
                .slice(0, 4);

            const similarProductsHTML = similarProducts.map(p => `
                <div class="trending-card">
                    <div class="trending-image">
                        <span class="trending-badge">Similar</span>
                        <img src="${p.image}" alt="${p.name}">
                    </div>
                    <div class="trending-content">
                        <h3>${p.name}</h3>
                        <p class="price">$${p.price}</p>
                        <button onclick="viewProduct(${p.id})">View Details</button>
                    </div>
                </div>
            `).join('');

            document.querySelector('.trending-wrapper').innerHTML = similarProductsHTML;

            // Initialize quantity selector
            initQuantitySelector();
        }
    } catch (error) {
        console.error('Error loading product details:', error);
    }
}

// Handle buy button click
function buyProduct() {
    window.location.href = 'thank-you.html';
}

// Initialize the page
if (document.getElementById('products-grid')) {
    loadProducts();
}
if (document.getElementById('product-details')) {
    loadProductDetails();
    initializeTabs();
}

// Initialize tabs functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding panel
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Add this at the beginning of main.js
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('/components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Initialize hamburger menu after header is loaded
            initializeHamburgerMenu();
        });

    // Load footer
    fetch('/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});

function initializeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// FAQ Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });
});

// Add tab functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and panels
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked button and corresponding panel
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Handle category filtering
function filterByCategory(category) {
    // You can implement filtering logic here
    console.log(`Filtering by category: ${category}`);
    // For now, just scroll to products section
    document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth' });
}

// Trending slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.querySelector('.trending-wrapper');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (sliderWrapper && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            sliderWrapper.scrollBy({
                left: -320,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            sliderWrapper.scrollBy({
                left: 320,
                behavior: 'smooth'
            });
        });
    }
});

// Initialize quantity selector
function initQuantitySelector() {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.quantity-selector input');

    if (minusBtn && plusBtn && qtyInput) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(qtyInput.value);
            if (currentValue > 1) {
                qtyInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(qtyInput.value);
            if (currentValue < 10) {
                qtyInput.value = currentValue + 1;
            }
        });

        qtyInput.addEventListener('change', () => {
            const value = parseInt(qtyInput.value);
            if (value < 1) qtyInput.value = 1;
            if (value > 10) qtyInput.value = 10;
        });
    }
} 