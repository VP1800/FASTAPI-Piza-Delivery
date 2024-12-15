document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const searchInput = document.querySelector('input[type="text"]');
    const statusFilter = document.querySelector('select');
    const dateFilter = document.querySelector('input[type="date"]');
    const filterButton = document.querySelector('.btn-secondary');
    const newOrderButton = document.querySelector('.btn-primary');
    const table = document.querySelector('.table');
    const tbody = table.querySelector('tbody');

    // Sample orders data with dates
    let orders = [
        {
            id: '#ORD-001',
            customer: 'John Doe',
            items: '2x Pepperoni, 1x Margherita',
            total: '$45.98',
            status: 'preparing',
            date: '2024-01-20', // Added date
            time: '10:30 AM'
        },
        {
            id: '#ORD-002',
            customer: 'Jane Smith',
            items: '1x Hawaiian, 1x BBQ Chicken',
            total: '$38.99',
            status: 'pending',
            date: '2024-01-20', // Added date
            time: '10:45 AM'
        }
    ];

    // Format date function
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Function to get status badge
    function getStatusBadge(status) {
        const badges = {
            'pending': 'bg-primary',
            'preparing': 'bg-warning',
            'delivering': 'bg-info',
            'delivered': 'bg-success',
            'cancelled': 'bg-danger'
        };
        return `<span class="badge ${badges[status]}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
    }

    // Function to render orders
    function renderOrders(ordersToRender) {
        tbody.innerHTML = '';
        ordersToRender.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.items}</td>
                <td>${order.total}</td>
                <td>${getStatusBadge(order.status)}</td>
                <td>${formatDate(order.date)}</td>
                <td>${order.time}</td>
                <td>
                    <button class="btn btn-sm btn-info me-2 view-order" data-id="${order.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success me-2 approve-order" data-id="${order.id}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger cancel-order" data-id="${order.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Filter orders
    function filterOrders() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusTerm = statusFilter.value;
        const dateTerm = dateFilter.value;

        let filteredOrders = orders.filter(order => {
            const matchesSearch = order.customer.toLowerCase().includes(searchTerm) ||
                                order.id.toLowerCase().includes(searchTerm) ||
                                order.items.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusTerm || order.status === statusTerm;
            
            // Enhanced date filtering
            const matchesDate = !dateTerm || order.date === dateTerm;
            
            return matchesSearch && matchesStatus && matchesDate;
        });

        renderOrders(filteredOrders);
    }

    // View Order Modal
    function showOrderModal(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const modalHtml = `
            <div class="modal fade" id="orderModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Order Details - ${order.id}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <strong>Customer:</strong> ${order.customer}
                            </div>
                            <div class="mb-3">
                                <strong>Items:</strong> ${order.items}
                            </div>
                            <div class="mb-3">
                                <strong>Total:</strong> ${order.total}
                            </div>
                            <div class="mb-3">
                                <strong>Status:</strong> ${getStatusBadge(order.status)}
                            </div>
                            <div class="mb-3">
                                <strong>Date:</strong> ${formatDate(order.date)}
                            </div>
                            <div class="mb-3">
                                <strong>Time:</strong> ${order.time}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Update Status</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('orderModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to document
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.show();
    }

    // New Order Form
    newOrderButton.addEventListener('click', function() {
        const modalHtml = `
            <div class="modal fade" id="newOrderModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">New Order</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="newOrderForm">
                                <div class="mb-3">
                                    <label class="form-label">Customer Name</label>
                                    <input type="text" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Items</label>
                                    <textarea class="form-control" required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Total Amount</label>
                                    <input type="number" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Date</label>
                                    <input type="date" class="form-control" required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" form="newOrderForm" class="btn btn-primary">Create Order</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('newOrderModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to document
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('newOrderModal'));
        modal.show();

        // Set default date to today
        const dateInput = document.querySelector('#newOrderForm input[type="date"]');
        dateInput.value = new Date().toISOString().split('T')[0];

        // Handle form submission
        document.getElementById('newOrderForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add new order (in real application, this would be sent to a backend)
            const newOrder = {
                id: '#ORD-' + (orders.length + 1).toString().padStart(3, '0'),
                customer: this.querySelector('input[type="text"]').value,
                items: this.querySelector('textarea').value,
                total: '$' + this.querySelector('input[type="number"]').value,
                status: 'pending',
                date: this.querySelector('input[type="date"]').value,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            orders.unshift(newOrder);
            renderOrders(orders);
            modal.hide();
        });
    });

    // Event listeners for filters
    searchInput.addEventListener('input', filterOrders);
    statusFilter.addEventListener('change', filterOrders);
    dateFilter.addEventListener('change', filterOrders);
    filterButton.addEventListener('click', filterOrders);

    // Handle order actions (same as before)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-order')) {
            const orderId = e.target.closest('.view-order').dataset.id;
            showOrderModal(orderId);
        }

        if (e.target.closest('.approve-order')) {
            const orderId = e.target.closest('.approve-order').dataset.id;
            const order = orders.find(o => o.id === orderId);
            if (order) {
                if (order.status === 'pending') order.status = 'preparing';
                else if (order.status === 'preparing') order.status = 'delivering';
                else if (order.status === 'delivering') order.status = 'delivered';
                renderOrders(orders);
            }
        }

        if (e.target.closest('.cancel-order')) {
            const orderId = e.target.closest('.cancel-order').dataset.id;
            if (confirm('Are you sure you want to cancel this order?')) {
                const order = orders.find(o => o.id === orderId);
                if (order) {
                    order.status = 'cancelled';
                    renderOrders(orders);
                }
            }
        }
    });

    // Initial render
    renderOrders(orders);
});
