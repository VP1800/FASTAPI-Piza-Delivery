document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const customerTable = document.getElementById('customerTableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const filterBtn = document.getElementById('filterBtn');
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    const exportBtn = document.getElementById('exportBtn');
    const customerModal = document.getElementById('customerModal');
    const customerForm = document.getElementById('customerForm');
    const saveCustomerBtn = document.getElementById('saveCustomer');

    // Sample customers data
    let customers = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 234-567-8900',
            address: '123 Main St, New York, NY 10001',
            status: 'active',
            joinDate: '2023-01-15'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1 234-567-8901',
            address: '456 Park Ave, Boston, MA 02101',
            status: 'active',
            joinDate: '2023-02-20'
        }
    ];

    // Add Customer button click handler
    addCustomerBtn.addEventListener('click', function() {
        customerForm.reset();
        customerForm.dataset.customerId = '';
        document.querySelector('#customerModal .modal-title').textContent = 'Add New Customer';
        const modal = new bootstrap.Modal(customerModal);
        modal.show();
    });

    // Save customer handler
    saveCustomerBtn.addEventListener('click', function() {
        const formData = new FormData(customerForm);
        const customerId = customerForm.dataset.customerId;

        const customerData = {
            id: customerId ? parseInt(customerId) : customers.length + 1,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            status: formData.get('status'),
            joinDate: customerId 
                ? customers.find(c => c.id === parseInt(customerId))?.joinDate 
                : new Date().toISOString().split('T')[0]
        };

        if (customerId) {
            const index = customers.findIndex(c => c.id === parseInt(customerId));
            if (index !== -1) {
                customers[index] = customerData;
            }
        } else {
            customers.push(customerData);
        }

        const modal = bootstrap.Modal.getInstance(customerModal);
        modal.hide();
        renderCustomers(customers);
        showToast('Customer saved successfully!', 'success');
    });

    // Render customers table
    function renderCustomers(customersToRender) {
        customerTable.innerHTML = '';
        
        if (customersToRender.length === 0) {
            customerTable.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-5">
                        <i class="fas fa-users fa-3x text-muted mb-3"></i>
                        <h3 class="text-muted">No customers found</h3>
                    </td>
                </tr>
            `;
            return;
        }

        customersToRender.forEach(customer => {
            const row = `
                <tr>
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.address}</td>
                    <td><span class="badge bg-${customer.status === 'active' ? 'success' : 'secondary'}">${customer.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editCustomer(${customer.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${customer.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            customerTable.insertAdjacentHTML('beforeend', row);
        });
    }

    // Edit customer function
    window.editCustomer = function(customerId) {
        const customer = customers.find(c => c.id === customerId);
        if (!customer) return;

        customerForm.dataset.customerId = customerId;
        customerForm.elements['name'].value = customer.name;
        customerForm.elements['email'].value = customer.email;
        customerForm.elements['phone'].value = customer.phone;
        customerForm.elements['address'].value = customer.address;
        customerForm.elements['status'].value = customer.status;

        document.querySelector('#customerModal .modal-title').textContent = 'Edit Customer';
        const modal = new bootstrap.Modal(customerModal);
        modal.show();
    };

    // Delete customer function
    window.deleteCustomer = function(customerId) {
        if (confirm('Are you sure you want to delete this customer?')) {
            customers = customers.filter(c => c.id !== customerId);
            renderCustomers(customers);
            showToast('Customer deleted successfully!', 'success');
        }
    };

    // Filter customers
    function filterCustomers() {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const sortBy = sortFilter.value;

        let filtered = customers.filter(customer => {
            const matchesSearch = customer.name.toLowerCase().includes(searchTerm) ||
                                customer.email.toLowerCase().includes(searchTerm) ||
                                customer.phone.includes(searchTerm);
            const matchesStatus = !status || customer.status === status;
            return matchesSearch && matchesStatus;
        });

        // Sort customers
        filtered.sort((a, b) => {
            switch(sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'date-asc':
                    return new Date(a.joinDate) - new Date(b.joinDate);
                case 'date-desc':
                    return new Date(b.joinDate) - new Date(a.joinDate);
                default:
                    return 0;
            }
        });

        renderCustomers(filtered);
    }

    // Event listeners for filters
    searchInput.addEventListener('keyup', filterCustomers);
    statusFilter.addEventListener('change', filterCustomers);
    sortFilter.addEventListener('change', filterCustomers);
    filterBtn.addEventListener('click', filterCustomers);

    // Toast notification function
    function showToast(message, type = 'success') {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '5';
        
        toastContainer.innerHTML = `
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        document.body.appendChild(toastContainer);
        const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
        toast.show();
        
        toast._element.addEventListener('hidden.bs.toast', () => {
            toastContainer.remove();
        });
    }

    // Initial render
    renderCustomers(customers);
});
