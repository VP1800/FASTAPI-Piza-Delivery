document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const filterBtn = document.getElementById('filterBtn');
    const addProductBtn = document.getElementById('addProductBtn');
    const exportBtn = document.getElementById('exportBtn');
    let currentProducts = [];

    // Sample products data (replace with API call in production)
    let products = [
        {
            id: 1,
            name: 'Margherita Pizza',
            category: 'pizza',
            description: 'Classic tomato sauce, fresh mozzarella, basil',
            price: 12.99,
            status: 'active',
            image: 'https://via.placeholder.com/300x200'
        },
        {
            id: 2,
            name: 'Pepperoni Pizza',
            category: 'pizza',
            description: 'Tomato sauce, mozzarella, pepperoni',
            price: 14.99,
            status: 'active',
            image: 'https://via.placeholder.com/300x200'
        },
        // Add more sample products as needed
    ];

    // Render products grid
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = '';
        currentProducts = productsToRender;

        if (productsToRender.length === 0) {
            productsGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-pizza-slice fa-3x text-muted mb-3"></i>
                    <h3 class="text-muted">No products found</h3>
                </div>
            `;
            return;
        }

        productsToRender.forEach(product => {
            const productCard = `
                <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                    <div class="card h-100 product-card">
                        <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-1">
                                <h5 class="card-title mb-0">${product.name}</h5>
                                <span class="badge ${getStatusBadgeClass(product.status)}">${capitalizeFirst(product.status)}</span>
                            </div>
                            <p class="card-text text-muted product-description">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="product-price">$${product.price.toFixed(2)}</span>
                                <span class="badge category-badge ${product.category}">${capitalizeFirst(product.category)}</span>
                            </div>
                            <div class="btn-group w-100">
                                <button class="btn btn-outline-primary" onclick="editProduct(${product.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-danger" onclick="deleteProduct(${product.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productsGrid.insertAdjacentHTML('beforeend', productCard);
        });
    }

    // Helper functions
    function getStatusBadgeClass(status) {
        const classes = {
            'active': 'bg-success',
            'inactive': 'bg-secondary',
            'out-of-stock': 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    }

    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Filter and sort products
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const status = statusFilter.value;
        const sortBy = sortFilter.value;

        let filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || product.category === category;
            const matchesStatus = !status || product.status === status;
            
            return matchesSearch && matchesCategory && matchesStatus;
        });

        // Sort products
        filtered.sort((a, b) => {
            switch(sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                default:
                    return 0;
            }
        });

        renderProducts(filtered);
    }

    // Handle product form submission
    function handleProductSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const productData = {
            id: form.dataset.productId || products.length + 1,
            name: formData.get('name'),
            category: formData.get('category'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            status: formData.get('status'),
            image: formData.get('image') || 'https://via.placeholder.com/300x200'
        };

        if (form.dataset.productId) {
            // Update existing product
            const index = products.findIndex(p => p.id === parseInt(form.dataset.productId));
            products[index] = productData;
        } else {
            // Add new product
            products.push(productData);
        }

        // Close modal and refresh grid
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();
        filterProducts();
        showToast('Product saved successfully!', 'success');
    }

    // Edit product
    window.editProduct = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const form = document.getElementById('productForm');
        form.dataset.productId = productId;
        
        // Fill form with product data
        form.elements['name'].value = product.name;
        form.elements['category'].value = product.category;
        form.elements['description'].value = product.description;
        form.elements['price'].value = product.price;
        form.elements['status'].value = product.status;

        // Show image preview
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = `<img src="${product.image}" alt="Product preview">`;

        // Update modal title
        document.querySelector('#productModal .modal-title').textContent = 'Edit Product';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    };

    // Delete product
    window.deleteProduct = function(productId) {
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        
        document.getElementById('confirmDelete').onclick = function() {
            products = products.filter(p => p.id !== productId);
            deleteModal.hide();
            filterProducts();
            showToast('Product deleted successfully!', 'success');
        };

        deleteModal.show();
    };

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = `
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.innerHTML = toast;
        document.body.appendChild(toastContainer);

        const toastElement = toastContainer.querySelector('.toast');
        const bsToast = new bootstrap.Toast(toastElement);
        bsToast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastContainer.remove();
        });
    }

    // Export products
    function exportProducts() {
        const exportData = currentProducts.map(({ id, name, category, price, status }) => ({
            id,
            name,
            category,
            price,
            status
        }));

        const csv = [
            ['ID', 'Name', 'Category', 'Price', 'Status'],
            ...exportData.map(item => [
                item.id,
                item.name,
                item.category,
                item.price,
                item.status
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'products.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Products exported successfully!', 'success');
    }

    // Image preview
    document.querySelector('input[name="image"]').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listeners
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    statusFilter.addEventListener('change', filterProducts);
    sortFilter.addEventListener('change', filterProducts);
    filterBtn.addEventListener('click', filterProducts);
    exportBtn.addEventListener('click', exportProducts);
    addProductBtn.addEventListener('click', () => {
        const form = document.getElementById('productForm');
        form.reset();
        delete form.dataset.productId;
        document.getElementById('imagePreview').innerHTML = '';
        document.querySelector('#productModal .modal-title').textContent = 'Add New Product';
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    });

    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.clear();
        window.location.href = 'admin_login.html?logout=success';
    });

    // Initial render
    renderProducts(products);
});
