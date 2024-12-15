document.getElementById('logoutBtn').addEventListener('click', async function(e) {
    e.preventDefault();
    
    const logoutBtn = this;
    const originalText = logoutBtn.innerHTML;
    
    // Show loading state
    logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging out...';
    logoutBtn.disabled = true;
    
    // Simulate logout delay
    setTimeout(() => {
        sessionStorage.clear();
        window.location.href = 'index.html?logout=success';
    }, 1000);
    if (confirm('Are you sure you want to logout?')) {
        // Clear session storage
        sessionStorage.clear();
        // Redirect to login page
        window.location.href = 'index.html?logout=success';
    }
});
document.addEventListener('DOMContentLoaded', function() 

{
    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    // Check if user is logged in
    if (!sessionStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickInsideToggle = sidebarToggle.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickInsideToggle && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    // Active link highlighting
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-link');
    
    menuItems.forEach(link => {
        if(link.href === currentLocation) {
            link.classList.add('active');
        }
    });

      // Logout functionality
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
          logoutBtn.addEventListener('click', function(e) {
              e.preventDefault();
              
              // Clear session storage
              sessionStorage.clear();
              
              // Redirect to login page with logout message
              window.location.href = 'index.html?logout=success';
          });
      }
      // Example of how to handle logout with a server (add to script.js)
async function handleLogout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            sessionStorage.clear();
            window.location.href = 'index.html?logout=success';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

  });


