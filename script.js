// Default data for inventory management
const defaultInventoryData = {
    items: [
        {
            id: 1,
            name: "Composite Filling Material",
            category: "consumables",
            quantity: 45,
            unit: "Syringe",
            minQuantity: 10,
            status: "in-stock",
            expiry: "08/2025",
            price: 28.50,
            location: "Cabinet A-3",
            description: "Light-cured composite resin for dental restorations"
        },
        {
            id: 2,
            name: "Dental Anesthetic",
            category: "medications",
            quantity: 5,
            unit: "Box",
            minQuantity: 8,
            status: "low-stock",
            expiry: "05/2025",
            price: 42.75,
            location: "Medication Cabinet",
            description: "Local anesthetic for dental procedures"
        },
        {
            id: 3,
            name: "Examination Gloves",
            category: "consumables",
            quantity: 480,
            unit: "Pieces",
            minQuantity: 100,
            status: "in-stock",
            expiry: "12/2026",
            price: 0.15,
            location: "Supply Room B",
            description: "Disposable nitrile examination gloves"
        },
        {
            id: 4,
            name: "Dental Floss",
            category: "consumables",
            quantity: 0,
            unit: "Box",
            minQuantity: 5,
            status: "out-of-stock",
            expiry: "N/A",
            price: 3.25,
            location: "Supply Room A",
            description: "Waxed dental floss for patient use"
        },
        {
            id: 5,
            name: "Dental Drill",
            category: "equipment",
            quantity: 2,
            unit: "Piece",
            minQuantity: 1,
            status: "in-stock",
            expiry: "N/A",
            price: 450.00,
            location: "Equipment Room",
            description: "High-speed dental handpiece for restorative procedures"
        }
    ],
    categories: ["consumables", "instruments", "equipment", "medications"],
    activities: [
        {
            date: "02/25/2025",
            item: "Composite Filling Material",
            action: "Stock Reduced (5 units)",
            user: "Dr. Smith"
        },
        {
            date: "02/24/2025",
            item: "Dental Anesthetic",
            action: "Reordered (20 units)",
            user: "Office Manager"
        },
        {
            date: "02/23/2025",
            item: "Examination Gloves",
            action: "Added (500 units)",
            user: "Inventory Staff"
        }
    ],
    users: [
        {
            name: "Dr. Smith",
            email: "dr.smith@dentalclinic.com",
            role: "Admin",
            status: "Active"
        },
        {
            name: "Office Manager",
            email: "manager@dentalclinic.com",
            role: "Manager",
            status: "Active"
        },
        {
            name: "Inventory Staff",
            email: "inventory@dentalclinic.com",
            role: "Staff",
            status: "Active"
        }
    ]
};

// Load data from localStorage or use default
let inventoryData = loadInventoryData();

// Functions for data persistence
function saveInventoryData() {
    localStorage.setItem('dentalInventoryData', JSON.stringify(inventoryData));
}

function loadInventoryData() {
    const storedData = localStorage.getItem('dentalInventoryData');
    return storedData ? JSON.parse(storedData) : {...defaultInventoryData};
}

// Generate unique IDs for new items
function generateId() {
    const items = inventoryData.items;
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// Update item status based on quantity
function updateItemStatus(item) {
    if (item.quantity <= 0) {
        item.status = 'out-of-stock';
    } else if (item.quantity <= item.minQuantity) {
        item.status = 'low-stock';
    } else {
        item.status = 'in-stock';
    }
    return item;
}

// Add activity log entry
function logActivity(itemName, action, user = 'Admin User') {
    const activity = {
        date: new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}),
        item: itemName,
        action: action,
        user: user
    };
    
    inventoryData.activities.unshift(activity);
    saveInventoryData();
    return activity;
}

// Export inventory to CSV
function exportToCSV() {
    // Column headers
    const headers = ['ID', 'Name', 'Category', 'Quantity', 'Unit', 'Min Quantity', 'Status', 'Expiry', 'Price', 'Location', 'Description'];
    
    // Convert data to CSV rows
    const rows = inventoryData.items.map(item => [
        item.id,
        item.name,
        item.category,
        item.quantity,
        item.unit,
        item.minQuantity,
        item.status,
        item.expiry,
        item.price,
        item.location,
        item.description || ''
    ]);
    
    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create downloadable link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dental-inventory-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Navigation and Section Handling
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main > section');
    
    // Tab handling for settings
    const settingsTabs = document.querySelectorAll('.settings-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to show a specific section
    function showSection(sectionId) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        }
        
        // Update active link
        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Initialize by showing the dashboard
    showSection('dashboard');
    
    // Add click listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    
    // Tab switching in settings
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            settingsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Form Submission Handling
    const addItemForm = document.getElementById('add-item-form');
    if (addItemForm) {
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(this);
            const itemData = {
                id: inventoryData.items.length + 1,
                name: document.getElementById('item-name').value,
                category: document.getElementById('item-category').value,
                quantity: parseInt(document.getElementById('item-quantity').value),
                unit: document.getElementById('item-unit').value,
                minQuantity: parseInt(document.getElementById('item-min-quantity').value) || 0,
                price: parseFloat(document.getElementById('item-price').value) || 0,
                expiry: document.getElementById('item-expiry').value 
                    ? new Date(document.getElementById('item-expiry').value).toLocaleDateString('en-US', {month: '2-digit', year: 'numeric'})
                    : 'N/A',
                location: document.getElementById('item-location').value || 'Not specified'
            };
            
            // Determine item status
            if (itemData.quantity <= 0) {
                itemData.status = 'out-of-stock';
            } else if (itemData.quantity <= itemData.minQuantity) {
                itemData.status = 'low-stock';
            } else {
                itemData.status = 'in-stock';
            }
            
            // In a real app, you would send this data to a server
            console.log('New item added:', itemData);
            
            // Add to our mock data
            inventoryData.items.push(itemData);
            
            // Add to activity log
            inventoryData.activities.unshift({
                date: new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}),
                item: itemData.name,
                action: `Added (${itemData.quantity} ${itemData.unit})`,
                user: 'Admin User'
            });
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.textContent = `${itemData.name} has been added to inventory.`;
            successMessage.style.cssText = 'background-color: #4caf50; color: white; padding: 1rem; border-radius: 4px; margin-top: 1rem;';
            
            this.reset(); // Clear the form
            this.appendChild(successMessage);
            
            // Update inventory table
            renderInventoryTable();
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }
    
    // Inventory filtering
    const searchInput = document.getElementById('search-inventory');
    const categoryFilter = document.getElementById('category-filter');
    const statusFilter = document.getElementById('status-filter');
    
    function filterInventory() {
        const searchText = searchInput.value.toLowerCase();
        const categoryValue = categoryFilter.value;
        const statusValue = statusFilter.value;
        
        let filteredItems = inventoryData.items;
        
        // Filter by search text
        if (searchText) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(searchText) || 
                item.category.toLowerCase().includes(searchText)
            );
        }
        
        // Filter by category
        if (categoryValue) {
            filteredItems = filteredItems.filter(item => item.category === categoryValue);
        }
        
        // Filter by status
        if (statusValue) {
            filteredItems = filteredItems.filter(item => item.status === statusValue);
        }
        
        // Render the filtered items
        renderInventoryTable(filteredItems);
    }
    
    // Add event listeners to filters
    if (searchInput && categoryFilter && statusFilter) {
        searchInput.addEventListener('input', filterInventory);
        categoryFilter.addEventListener('change', filterInventory);
        statusFilter.addEventListener('change', filterInventory);
    }
    
    // Render inventory table
    function renderInventoryTable(items = inventoryData.items) {
        const tableBody = document.querySelector('#inventory-table tbody');
        if (!tableBody) return;
        
        // Clear current table content
        tableBody.innerHTML = '';
        
        // Add items to table
        items.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td class="status ${item.status}">${item.status.replace('-', ' ').replace(
                    /\b\w/g, l => l.toUpperCase()
                )}</td>
                <td>${item.expiry}</td>
                <td>
                    <button class="btn-small edit-item" data-id="${item.id}">Edit</button>
                    <button class="btn-small ${item.quantity > 0 ? 'use-item' : 'order-item'}" data-id="${item.id}">
                        ${item.quantity > 0 ? 'Use' : 'Order'}
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners for item actions
        document.querySelectorAll('.edit-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const item = inventoryData.items.find(i => i.id === itemId);
                if (item) {
                    showEditItemModal(item);
                }
            });
        });
        
        document.querySelectorAll('.use-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const item = inventoryData.items.find(i => i.id === itemId);
                if (item && item.quantity > 0) {
                    showUseItemModal(item);
                }
            });
        });
        
        document.querySelectorAll('.order-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const item = inventoryData.items.find(i => i.id === itemId);
                if (item) {
                    showOrderItemModal(item);
                }
            });
        });
    }
    
    // Render categories
    function renderCategories() {
        const categoriesList = document.getElementById('categories-list');
        if (!categoriesList) return;
        
        categoriesList.innerHTML = '';
        
        inventoryData.categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <div class="actions">
                    <button class="btn-small edit-category" data-category="${category}">Edit</button>
                    <button class="btn-small delete-category" data-category="${category}">Delete</button>
                </div>
            `;
            categoriesList.appendChild(li);
        });
        
        // Add event listeners
        document.querySelectorAll('.edit-category').forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                alert(`Edit category: ${category}`);
                // In a real app, this would open an edit form
            });
        });
        
        document.querySelectorAll('.delete-category').forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                const itemsInCategory = inventoryData.items.filter(item => item.category === category).length;
                
                if (itemsInCategory > 0) {
                    alert(`Cannot delete category: ${category}. It contains ${itemsInCategory} item(s).`);
                } else {
                    if (confirm(`Are you sure you want to delete the category: ${category}?`)) {
                        // Remove category from array
                        const index = inventoryData.categories.indexOf(category);
                        if (index > -1) {
                            inventoryData.categories.splice(index, 1);
                            alert(`Category ${category} has been deleted.`);
                            renderCategories();
                        }
                    }
                }
            });
        });
    }
    
    // Add category form
    const addCategoryForm = document.getElementById('add-category-form');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const categoryName = document.getElementById('category-name').value.trim().toLowerCase();
            
            if (categoryName && !inventoryData.categories.includes(categoryName)) {
                inventoryData.categories.push(categoryName);
                renderCategories();
                this.reset();
                
                // Add success message
                const successMessage = document.createElement('div');
                successMessage.textContent = `Category "${categoryName}" has been added.`;
                successMessage.style.cssText = 'color: #4caf50; margin-top: 1rem;';
                
                this.appendChild(successMessage);
                
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            } else if (inventoryData.categories.includes(categoryName)) {
                alert('This category already exists.');
            }
        });
    }
    
    // Update dashboard
    function updateDashboard() {
        // Update item counts
        document.querySelector('.dashboard-grid .card:nth-child(1) .count').textContent = 
            inventoryData.items.length;
        
        document.querySelector('.dashboard-grid .card:nth-child(2) .count').textContent = 
            inventoryData.items.filter(item => item.status === 'low-stock').length;
        
        document.querySelector('.dashboard-grid .card:nth-child(3) .count').textContent = 
            inventoryData.items.filter(item => 
                item.expiry !== 'N/A' && 
                new Date(item.expiry) < new Date(new Date().setMonth(new Date().getMonth() + 3))
            ).length;
        
        // Calculate total inventory value
        const totalValue = inventoryData.items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );
        
        document.querySelector('.dashboard-grid .card:nth-child(4) .count').textContent = 
            '$' + totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        // Update activity table
        const activityTableBody = document.querySelector('.recent-activity table tbody');
        if (activityTableBody) {
            activityTableBody.innerHTML = '';
            
            // Show the 3 most recent activities
            const recentActivities = inventoryData.activities.slice(0, 3);
            
            recentActivities.forEach(activity => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${activity.date}</td>
                    <td>${activity.item}</td>
                    <td>${activity.action}</td>
                    <td>${activity.user}</td>
                `;
                activityTableBody.appendChild(row);
            });
        }
    }
    
    // Handle report generation
    const reportButtons = document.querySelectorAll('.report-card .btn');
    if (reportButtons) {
        reportButtons.forEach(button => {
            button.addEventListener('click', function() {
                const reportType = this.parentElement.querySelector('h3').textContent;
                const reportPreview = document.getElementById('report-preview');
                
                if (reportPreview) {
                    reportPreview.innerHTML = `
                        <h3>${reportType}</h3>
                        <p>Generating ${reportType.toLowerCase()}...</p>
                        <div class="report-loading">
                            <div class="spinner"></div>
                        </div>
                    `;
                    
                    // Simulate report generation (would connect to backend in real app)
                    setTimeout(() => {
                        let reportContent = '';
                        
                        switch (reportType) {
                            case 'Inventory Status':
                                // Group items by category
                                const categories = {};
                                inventoryData.items.forEach(item => {
                                    if (!categories[item.category]) {
                                        categories[item.category] = [];
                                    }
                                    categories[item.category].push(item);
                                });
                                
                                reportContent = `
                                    <p>Report generated on ${new Date().toLocaleDateString()}</p>
                                    <h4>Summary</h4>
                                    <ul>
                                        <li>Total Items: ${inventoryData.items.length}</li>
                                        <li>Categories: ${Object.keys(categories).length}</li>
                                        <li>Total Value: $${inventoryData.items.reduce((sum, item) => 
                                            sum + (item.price * item.quantity), 0
                                        ).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</li>
                                    </ul>
                                    
                                    <h4>Breakdown by Category</h4>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Items</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${Object.entries(categories).map(([category, items]) => `
                                                <tr>
                                                    <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                                                    <td>${items.length}</td>
                                                    <td>$${items.reduce((sum, item) => 
                                                        sum + (item.price * item.quantity), 0
                                                    ).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                `;
                                break;
                                
                            case 'Consumption Trends':
                                reportContent = `
                                    <p>Report generated on ${new Date().toLocaleDateString()}</p>
                                    <p>This report would show consumption patterns over time.</p>
                                    <div style="height: 200px; background-color: #f5f5f5; display: flex; justify-content: center; align-items: center;">
                                        [Consumption Chart Would Appear Here]
                                    </div>
                                    <p>In a real application, this would include charts and graphs showing usage trends.</p>
                                `;
                                break;
                                
                            case 'Expiry Report':
                                const expiringItems = inventoryData.items.filter(item => 
                                    item.expiry !== 'N/A' && 
                                    new Date(item.expiry) < new Date(new Date().setMonth(new Date().getMonth() + 6))
                                ).sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
                                
                                reportContent = `
                                    <p>Report generated on ${new Date().toLocaleDateString()}</p>
                                    <h4>Items Expiring Within 6 Months</h4>
                                    ${expiringItems.length > 0 ? `
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Expiry</th>
                                                    <th>Days Left</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${expiringItems.map(item => {
                                                    const expiryDate = new Date(item.expiry);
                                                    const today = new Date();
                                                    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                                                    
                                                    return `
                                                        <tr>
                                                            <td>${item.name}</td>
                                                            <td>${item.quantity} ${item.unit}</td>
                                                            <td>${item.expiry}</td>
                                                            <td style="color: ${daysLeft < 30 ? 'red' : daysLeft < 90 ? 'orange' : 'green'}">
                                                                ${daysLeft} days
                                                            </td>
                                                        </tr>
                                                    `;
                                                }).join('')}
                                            </tbody>
                                        </table>
                                    ` : '<p>No items expiring within the next 6 months.</p>'}
                                `;
                                break;
                                
                            case 'Reorder Report':
                                const lowStockItems = inventoryData.items.filter(item => 
                                    item.status === 'low-stock' || item.status === 'out-of-stock'
                                );
                                
                                reportContent = `
                                    <p>Report generated on ${new Date().toLocaleDateString()}</p>
                                    <h4>Items Needing Reorder</h4>
                                    ${lowStockItems.length > 0 ? `
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Current Stock</th>
                                                    <th>Minimum Level</th>
                                                    <th>Suggested Order</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${lowStockItems.map(item => {
                                                    const suggestedOrder = Math.max(item.minQuantity * 2 - item.quantity, 0);
                                                    
                                                    return `
                                                        <tr>
                                                            <td>${item.name}</td>
                                                            <td class="status ${item.status}">${item.quantity} ${item.unit}</td>
                                                            <td>${item.minQuantity} ${item.unit}</td>
                                                            <td>${suggestedOrder} ${item.unit}</td>
                                                        </tr>
                                                    `;
                                                }).join('')}
                                            </tbody>
                                        </table>
                                    ` : '<p>No items currently need reordering.</p>'}
                                `;
                                break;
                        }
                        
                        reportPreview.innerHTML = `
                            <h3>${reportType}</h3>
                            <div class="report-content">
                                ${reportContent}
                            </div>
                            <div class="report-actions" style="margin-top: 1rem;">
                                <button class="btn secondary print-report">Print Report</button>
                                <button class="btn export-csv">Export CSV</button>
                            </div>
                        `;
                        
                        // Add event listener to export button
                        reportPreview.querySelector('.export-csv').addEventListener('click', function() {
                            exportToCSV();
                            showToast('Inventory data exported to CSV');
                        });
                        
                        // Add event listener to print button
                        reportPreview.querySelector('.print-report').addEventListener('click', function() {
                            window.print();
                        });
                    }, 1500);
                }
            });
        });
    }
    
    // Handle profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.textContent = 'Profile settings saved successfully.';
            successMessage.style.cssText = 'color: #4caf50; padding: 1rem 0;';
            
            this.appendChild(successMessage);
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }
    
    // Handle notifications form submission
    const notificationsForm = document.getElementById('notifications-form');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.textContent = 'Notification settings saved successfully.';
            successMessage.style.cssText = 'color: #4caf50; padding: 1rem 0;';
            
            this.appendChild(successMessage);
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }
    
    // Dynamic subcategory options based on category selection
    const categorySelect = document.getElementById('item-category');
    const subcategorySelect = document.getElementById('item-subcategory');
    
    if (categorySelect && subcategorySelect) {
        categorySelect.addEventListener('change', function() {
            const selectedCategory = this.value;
            
            // Clear current options
            subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
            
            // Add relevant subcategories based on selected category
            if (selectedCategory === 'consumables') {
                const consumablesOptions = ['Filling Materials', 'Impression Materials', 'Disposables', 'Sterilization'];
                
                consumablesOptions.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.toLowerCase().replace(' ', '-');
                    optionElement.textContent = option;
                    subcategorySelect.appendChild(optionElement);
                });
            } else if (selectedCategory === 'instruments') {
                const instrumentsOptions = ['Hand Instruments', 'Rotary Instruments', 'Extraction Instruments', 'Endodontic'];
                
                instrumentsOptions.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.toLowerCase().replace(' ', '-');
                    optionElement.textContent = option;
                    subcategorySelect.appendChild(optionElement);
                });
            } else if (selectedCategory === 'equipment') {
                const equipmentOptions = ['Chairs', 'Lights', 'X-ray Equipment', 'Sterilizers'];
                
                equipmentOptions.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.toLowerCase().replace(' ', '-');
                    optionElement.textContent = option;
                    subcategorySelect.appendChild(optionElement);
                });
            } else if (selectedCategory === 'medications') {
                const medicationsOptions = ['Anesthetics', 'Antibiotics', 'Analgesics', 'Fluoride'];
                
                medicationsOptions.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.toLowerCase().replace(' ', '-');
                    optionElement.textContent = option;
                    subcategorySelect.appendChild(optionElement);
                });
            }
        });
    }
    
    // Mobile navigation toggle
    const createMobileNav = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        if (header && nav && window.innerWidth <= 768) {
            // Create mobile menu toggle button if it doesn't exist
            if (!document.querySelector('.mobile-toggle')) {
                const mobileToggle = document.createElement('button');
                mobileToggle.classList.add('mobile-toggle');
                mobileToggle.innerHTML = '&#9776;'; // Hamburger icon
                mobileToggle.style.cssText = 'background: none; border: none; font-size: 1.5rem; cursor: pointer;';
                
                header.insertBefore(mobileToggle, nav);
                
                // Toggle nav visibility
                mobileToggle.addEventListener('click', () => {
                    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
                });
                
                // Close menu when a link is clicked
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        if (window.innerWidth <= 768) {
                            nav.style.display = 'none';
                        }
                    });
                });
            }
            
            // Apply initial style
            nav.style.display = 'none';
            document.querySelector('.mobile-toggle').style.display = 'block';
        } else if (header && nav) {
            // Reset styles for larger screens
            nav.style.display = '';
            const mobileToggle = document.querySelector('.mobile-toggle');
            if (mobileToggle) {
                mobileToggle.style.display = 'none';
            }
        }
    };
    
    // Initialize mobile nav
    createMobileNav();
    
    // Update on window resize
    window.addEventListener('resize', createMobileNav);
    
    // Initialize all components
    renderInventoryTable();
    renderCategories();
    updateDashboard();
    
    // Save data before leaving page
    window.addEventListener('beforeunload', () => {
        saveInventoryData();
    });
    
    // Add a few items to demonstrate search and filter functionality
    if (inventoryData.items.length <= 5) {
        const additionalItems = [
            {
                id: generateId(),
                name: "Dental Impression Material",
                category: "consumables",
                quantity: 15,
                unit: "Kits",
                minQuantity: 5,
                status: "in-stock",
                expiry: "09/2025",
                price: 35.20,
                location: "Supply Room B",
                description: "Silicone-based impression material for dental procedures"
            },
            {
                id: generateId(),
                name: "Dental Mirrors",
                category: "instruments",
                quantity: 25,
                unit: "Pieces",
                minQuantity: 10,
                status: "in-stock",
                expiry: "N/A",
                price: 8.75,
                location: "Instrument Cabinet",
                description: "Dental examination mirrors for oral inspection"
            },
            {
                id: generateId(),
                name: "Orthodontic Brackets",
                category: "consumables",
                quantity: 4,
                unit: "Packs",
                minQuantity: 5,
                status: "low-stock",
                expiry: "11/2026",
                price: 85.90,
                location: "Orthodontic Supplies",
                description: "Metal brackets for orthodontic treatments"
            },
            {
                id: generateId(),
                name: "X-Ray Films",
                category: "consumables",
                quantity: 3,
                unit: "Boxes",
                minQuantity: 5,
                status: "low-stock",
                expiry: "07/2025",
                price: 42.50,
                location: "Imaging Room",
                description: "Dental X-ray films for radiographic imaging"
            },
            {
                id: generateId(),
                name: "Sterilization Pouches",
                category: "consumables",
                quantity: 120,
                unit: "Pieces",
                minQuantity: 50,
                status: "in-stock",
                expiry: "05/2026",
                price: 0.35,
                location: "Sterilization Area",
                description: "Self-sealing sterilization pouches for dental instruments"
            }
        ];
        
        inventoryData.items = [...inventoryData.items, ...additionalItems];
        saveInventoryData();
    }
});

// Show Edit Item Modal function
function showEditItemModal(item) {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    // Create modal content
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Edit Item: ${item.name}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="edit-item-form">
                    <div class="form-group">
                        <label for="edit-item-name">Item Name</label>
                        <input type="text" id="edit-item-name" value="${item.name}" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-item-category">Category</label>
                            <select id="edit-item-category" required>
                                ${inventoryData.categories.map(category => 
                                    `<option value="${category}" ${item.category === category ? 'selected' : ''}>${category.charAt(0).toUpperCase() + category.slice(1)}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-item-quantity">Quantity</label>
                            <input type="number" id="edit-item-quantity" value="${item.quantity}" min="0" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-item-unit">Unit</label>
                            <input type="text" id="edit-item-unit" value="${item.unit}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-item-min-quantity">Min Quantity</label>
                            <input type="number" id="edit-item-min-quantity" value="${item.minQuantity}" min="0" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-item-price">Price</label>
                            <input type="number" id="edit-item-price" value="${item.price}" min="0" step="0.01" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-item-expiry">Expiry Date</label>
                            <input type="text" id="edit-item-expiry" value="${item.expiry}">
                            <small>Format: MM/YYYY or N/A</small>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-item-location">Location</label>
                        <input type="text" id="edit-item-location" value="${item.location}">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-item-description">Description</label>
                        <textarea id="edit-item-description" rows="3">${item.description || ''}</textarea>
                    </div>
                    
                    <input type="hidden" id="edit-item-id" value="${item.id}">
                    
                    <div class="form-actions">
                        <button type="button" class="btn secondary close-modal">Cancel</button>
                        <button type="submit" class="btn primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.appendChild(modalContainer);
    
    // Add event listeners
    modalContainer.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modalContainer);
    });
    
    modalContainer.querySelector('#edit-item-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the updated item data
        const updatedItem = {
            id: parseInt(document.getElementById('edit-item-id').value),
            name: document.getElementById('edit-item-name').value,
            category: document.getElementById('edit-item-category').value,
            quantity: parseInt(document.getElementById('edit-item-quantity').value),
            unit: document.getElementById('edit-item-unit').value,
            minQuantity: parseInt(document.getElementById('edit-item-min-quantity').value),
            price: parseFloat(document.getElementById('edit-item-price').value),
            expiry: document.getElementById('edit-item-expiry').value,
            location: document.getElementById('edit-item-location').value,
            description: document.getElementById('edit-item-description').value
        };
        
        // Update item status
        updatedItem.status = updateItemStatus(updatedItem).status;
        
        // Find and update the item in the inventory
        const index = inventoryData.items.findIndex(i => i.id === updatedItem.id);
        if (index !== -1) {
            inventoryData.items[index] = updatedItem;
            
            // Log the activity
            logActivity(updatedItem.name, 'Item Updated');
            
            // Save data
            saveInventoryData();
            
            // Update UI
            renderInventoryTable();
            updateDashboard();
            
            // Show success message and close modal
            showToast(`${updatedItem.name} has been updated.`);
            document.body.removeChild(modalContainer);
        }
    });
}

// Show Use Item Modal function
function showUseItemModal(item) {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    // Create modal content
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Use Item: ${item.name}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="use-item-form">
                    <p>Current stock: ${item.quantity} ${item.unit}</p>
                    
                    <div class="form-group">
                        <label for="use-quantity">Quantity to Use</label>
                        <input type="number" id="use-quantity" min="1" max="${item.quantity}" value="1" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="use-notes">Notes (Optional)</label>
                        <textarea id="use-notes" rows="2"></textarea>
                    </div>
                    
                    <input type="hidden" id="use-item-id" value="${item.id}">
                    
                    <div class="form-actions">
                        <button type="button" class="btn secondary close-modal">Cancel</button>
                        <button type="submit" class="btn primary">Confirm Use</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.appendChild(modalContainer);
    
    // Add event listeners
    modalContainer.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modalContainer);
    });
    
    modalContainer.querySelector('#use-item-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const itemId = parseInt(document.getElementById('use-item-id').value);
        const useQuantity = parseInt(document.getElementById('use-quantity').value);
        const notes = document.getElementById('use-notes').value;
        
        const item = inventoryData.items.find(i => i.id === itemId);
        
        if (item && useQuantity > 0 && useQuantity <= item.quantity) {
            // Reduce the quantity
            item.quantity -= useQuantity;
            
            // Update status
            updateItemStatus(item);
            
            // Log the activity
            const actionText = `Stock Reduced (${useQuantity} ${item.unit})${notes ? ` - Note: ${notes}` : ''}`;
            logActivity(item.name, actionText);
            
            // Save data
            saveInventoryData();
            
            // Update UI
            renderInventoryTable();
            updateDashboard();
            
            // Show success message and close modal
            showToast(`Used ${useQuantity} ${item.unit} of ${item.name}.`);
            document.body.removeChild(modalContainer);
        }
    });
}

// Show Order Item Modal function
function showOrderItemModal(item) {
    // Calculate suggested order quantity
    const suggestedQuantity = Math.max(item.minQuantity * 2 - item.quantity, 1);
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    // Create modal content
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Order Item: ${item.name}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="order-item-form">
                    <p>Current stock: ${item.quantity} ${item.unit}</p>
                    <p>Minimum quantity: ${item.minQuantity} ${item.unit}</p>
                    
                    <div class="form-group">
                        <label for="order-quantity">Quantity to Order</label>
                        <input type="number" id="order-quantity" min="1" value="${suggestedQuantity}" required>
                        <small>Suggested order: ${suggestedQuantity} ${item.unit}</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="supplier">Supplier</label>
                        <input type="text" id="supplier" placeholder="Enter supplier name">
                    </div>
                    
                    <div class="form-group">
                        <label for="order-notes">Notes (Optional)</label>
                        <textarea id="order-notes" rows="2"></textarea>
                    </div>
                    
                    <input type="hidden" id="order-item-id" value="${item.id}">
                    
                    <div class="form-actions">
                        <button type="button" class="btn secondary close-modal">Cancel</button>
                        <button type="submit" class="btn primary">Place Order</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.appendChild(modalContainer);
    
    // Add event listeners
    modalContainer.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modalContainer);
    });
    
    modalContainer.querySelector('#order-item-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const itemId = parseInt(document.getElementById('order-item-id').value);
        const orderQuantity = parseInt(document.getElementById('order-quantity').value);
        const supplier = document.getElementById('supplier').value;
        const notes = document.getElementById('order-notes').value;
        
        const item = inventoryData.items.find(i => i.id === itemId);
        
        if (item && orderQuantity > 0) {
            // Log the order activity
            const supplierText = supplier ? ` from ${supplier}` : '';
            const actionText = `Reordered (${orderQuantity} ${item.unit})${supplierText}${notes ? ` - Note: ${notes}` : ''}`;
            logActivity(item.name, actionText);
            
            // Save data
            saveInventoryData();
            
            // Update UI
            renderInventoryTable();
            updateDashboard();
            
            // Show success message and close modal
            showToast(`Ordered ${orderQuantity} ${item.unit} of ${item.name}.`);
            document.body.removeChild(modalContainer);
        }
    });
}

// Show toast message
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}