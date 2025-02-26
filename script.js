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
            description: "Light-cured composite resin for dental restorations",
            lastUpdated: "2025-02-25T10:30:00"
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
            description: "Local anesthetic for dental procedures",
            lastUpdated: "2025-02-24T14:15:00"
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
            description: "Disposable nitrile examination gloves",
            lastUpdated: "2025-02-23T09:45:00"
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
            description: "Waxed dental floss for patient use",
            lastUpdated: "2025-02-22T16:20:00"
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
            description: "High-speed dental handpiece for restorative procedures",
            lastUpdated: "2025-02-21T11:10:00"
        }
    ],
    categories: ["consumables", "instruments", "equipment", "medications"],
    activities: [
        {
            id: 1,
            date: "02/25/2025",
            item: "Composite Filling Material",
            action: "Stock Reduced (5 units)",
            user: "Dr. Smith",
            timestamp: "2025-02-25T10:30:00",
            details: {
                quantity: 5,
                previousQuantity: 50,
                newQuantity: 45
            }
        },
        {
            id: 2,
            date: "02/24/2025",
            item: "Dental Anesthetic",
            action: "Reordered (20 units)",
            user: "Office Manager",
            timestamp: "2025-02-24T14:15:00",
            details: {
                quantity: 20,
                supplier: "Medical Supplies Inc."
            }
        },
        {
            id: 3,
            date: "02/23/2025",
            item: "Examination Gloves",
            action: "Added (500 units)",
            user: "Inventory Staff",
            timestamp: "2025-02-23T09:45:00",
            details: {
                quantity: 500,
                previousQuantity: 0,
                newQuantity: 500,
                price: 0.15
            }
        }
    ],
    users: [
        {
            id: 1,
            name: "Dr. Smith",
            email: "dr.smith@dentalclinic.com",
            role: "Admin",
            status: "Active",
            password: "hashed_password_1", // In a real app, these would be properly hashed
            lastLogin: "2025-02-25T08:15:00"
        },
        {
            id: 2,
            name: "Office Manager",
            email: "manager@dentalclinic.com",
            role: "Manager",
            status: "Active",
            password: "hashed_password_2",
            lastLogin: "2025-02-24T09:30:00"
        },
        {
            id: 3,
            name: "Inventory Staff",
            email: "inventory@dentalclinic.com",
            role: "Staff",
            status: "Active",
            password: "hashed_password_3",
            lastLogin: "2025-02-23T12:45:00"
        }
    ],
    appSettings: {
        theme: "light",
        language: "en",
        notifications: {
            lowStock: true,
            expiry: true,
            activitySummary: false,
            emailAlerts: "alerts@dentalclinic.com"
        },
        backupFrequency: "daily",
        lastBackup: null
    },
    currentUser: null
};

// Load data from localStorage or use default
let inventoryData = loadInventoryData();

// Database-like functions for data persistence
function saveInventoryData() {
    localStorage.setItem('dentalInventoryData', JSON.stringify(inventoryData));
}

function loadInventoryData() {
    const storedData = localStorage.getItem('dentalInventoryData');
    return storedData ? JSON.parse(storedData) : {...defaultInventoryData};
}

// Authentication functions
function loginUser(email, password) {
    try {
        // Find user by email
        const user = inventoryData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        // Check if user exists and password matches
        if (!user) {
            throw new Error('User not found');
        }
        
        // In a real app, we would use proper password hashing and comparison
        // For this demo, we're just doing a simple comparison
        if (user.password !== password) {
            throw new Error('Invalid password');
        }
        
        // Check if user is active
        if (user.status !== 'Active') {
            throw new Error('Account is inactive');
        }
        
        // Update last login time
        user.lastLogin = new Date().toISOString();
        
        // Set current user
        inventoryData.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        // Save updated data
        saveInventoryData();
        
        // Return user info (without sensitive data)
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
    } catch (error) {
        console.error('Login error:', error.message);
        throw error;
    }
}

function logoutUser() {
    // Clear current user
    inventoryData.currentUser = null;
    saveInventoryData();
}

function isUserLoggedIn() {
    return inventoryData.currentUser !== null;
}

function getCurrentUser() {
    return inventoryData.currentUser;
}

function checkPermission(requiredRole) {
    if (!isUserLoggedIn()) {
        return false;
    }
    
    const user = getCurrentUser();
    
    // Simple role-based permissions
    // Admin can do everything
    if (user.role === 'Admin') {
        return true;
    }
    
    // Manager can do everything except user management
    if (user.role === 'Manager' && requiredRole !== 'Admin') {
        return true;
    }
    
    // Staff has limited permissions
    if (user.role === 'Staff' && requiredRole === 'Staff') {
        return true;
    }
    
    return false;
}

function registerUser(userData) {
    try {
        // Check if email already exists
        if (inventoryData.users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            throw new Error('Email already registered');
        }
        
        // Create new user
        const newUser = {
            id: generateUserId(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // In a real app, this would be hashed
            role: userData.role || 'Staff', // Default role
            status: 'Active',
            lastLogin: null
        };
        
        // Add to users array
        inventoryData.users.push(newUser);
        
        // Save data
        saveInventoryData();
        
        // Return user info (without password)
        const { password, ...userInfo } = newUser;
        return userInfo;
    } catch (error) {
        console.error('Registration error:', error.message);
        throw error;
    }
}

function generateUserId() {
    const users = inventoryData.users;
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
}

// Generate unique IDs for new items
function generateId() {
    const items = inventoryData.items;
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// Create a unique activity ID
function generateActivityId() {
    const activities = inventoryData.activities;
    return activities.length > 0 ? Math.max(...activities.map(activity => activity.id || 0)) + 1 : 1;
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
    
    // Update the lastUpdated timestamp
    item.lastUpdated = new Date().toISOString();
    
    return item;
}

// Add activity log entry with improved details
function logActivity(itemName, action, user = getCurrentUser()?.name || 'System', details = {}) {
    const now = new Date();
    const activity = {
        id: generateActivityId(),
        date: now.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}),
        item: itemName,
        action: action,
        user: user,
        timestamp: now.toISOString(),
        details: details // Can contain quantity, price, category, etc.
    };
    
    inventoryData.activities.unshift(activity);
    saveInventoryData();
    return activity;
}

// Database operations for items
function getItems(filters = {}) {
    try {
        let filteredItems = [...inventoryData.items];
        
        // Apply filters
        if (filters.name) {
            const searchTerm = filters.name.toLowerCase();
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm)
            );
        }
        
        if (filters.category) {
            filteredItems = filteredItems.filter(item => 
                item.category === filters.category
            );
        }
        
        if (filters.status) {
            filteredItems = filteredItems.filter(item => 
                item.status === filters.status
            );
        }
        
        // Sort items if needed
        if (filters.sortBy) {
            const sortField = filters.sortBy;
            const sortDirection = filters.sortDirection === 'desc' ? -1 : 1;
            
            filteredItems.sort((a, b) => {
                if (a[sortField] < b[sortField]) return -1 * sortDirection;
                if (a[sortField] > b[sortField]) return 1 * sortDirection;
                return 0;
            });
        }
        
        return filteredItems;
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
}

function getItemById(id) {
    return inventoryData.items.find(item => item.id === id);
}

function updateItem(id, itemData) {
    try {
        // Find item index
        const index = inventoryData.items.findIndex(item => item.id === id);
        
        if (index === -1) {
            throw new Error('Item not found');
        }
        
        // Update item
        const updatedItem = {
            ...inventoryData.items[index],
            ...itemData,
            lastUpdated: new Date().toISOString()
        };
        
        // Update status based on quantity
        updateItemStatus(updatedItem);
        
        // Replace in array
        inventoryData.items[index] = updatedItem;
        
        // Save data
        saveInventoryData();
        
        return updatedItem;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
}

function getAppSettings() {
    return {...inventoryData.appSettings};
}

function updateAppSettings(settings) {
    try {
        // Update settings
        inventoryData.appSettings = {
            ...inventoryData.appSettings,
            ...settings
        };
        
        // Save data
        saveInventoryData();
        
        return {...inventoryData.appSettings};
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}

// Function to validate form input
function validateFormInput(input, rules = {}) {
    const { required, minLength, maxLength, min, max, pattern, email, match, custom } = rules;
    const value = input.value.trim();
    
    // Required check
    if (required && value === '') {
        return { valid: false, message: 'This field is required' };
    }
    
    // Min length check
    if (minLength && value.length < minLength) {
        return { valid: false, message: `Must be at least ${minLength} characters` };
    }
    
    // Max length check
    if (maxLength && value.length > maxLength) {
        return { valid: false, message: `Must be at most ${maxLength} characters` };
    }
    
    // Min value check (for number inputs)
    if (min !== undefined && parseFloat(value) < min) {
        return { valid: false, message: `Value must be at least ${min}` };
    }
    
    // Max value check (for number inputs)
    if (max !== undefined && parseFloat(value) > max) {
        return { valid: false, message: `Value must be at most ${max}` };
    }
    
    // Pattern check
    if (pattern && !pattern.test(value)) {
        return { valid: false, message: 'Invalid format' };
    }
    
    // Email format check
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { valid: false, message: 'Invalid email format' };
    }
    
    // Match another input
    if (match && value !== match.value) {
        return { valid: false, message: 'Values do not match' };
    }
    
    // Custom validation function
    if (custom && typeof custom === 'function') {
        const customResult = custom(value);
        if (customResult !== true) {
            return { valid: false, message: customResult || 'Invalid input' };
        }
    }
    
    return { valid: true };
}

// Add feedback to form fields
function showValidationFeedback(input, validationResult) {
    // Remove any existing feedback
    const existingFeedback = input.parentNode.querySelector('.validation-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Reset input styles
    input.classList.remove('valid-input', 'invalid-input');
    
    // Add appropriate feedback
    if (!validationResult.valid) {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'validation-feedback error';
        feedbackElement.textContent = validationResult.message;
        input.parentNode.appendChild(feedbackElement);
        input.classList.add('invalid-input');
    } else {
        input.classList.add('valid-input');
    }
    
    return validationResult.valid;
}

function backupData() {
    try {
        // In a real app, this would send data to a server
        // For this demo, we'll just create a JSON string
        const backup = JSON.stringify(inventoryData);
        
        // Update last backup time
        inventoryData.appSettings.lastBackup = new Date().toISOString();
        saveInventoryData();
        
        // In a real app, we would return success/failure
        // For demo, we'll create a download link
        const blob = new Blob([backup], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dental-inventory-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        // Log the backup activity
        logActivity('System', 'Data Backup Created', getCurrentUser()?.name || 'System', {
            backupSize: Math.round(backup.length / 1024) + ' KB',
            timestamp: new Date().toISOString()
        });
        
        // Append to body, click and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return {
            success: true,
            timestamp: inventoryData.appSettings.lastBackup
        };
    } catch (error) {
        console.error('Backup error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Function to restore from backup
function restoreFromBackup(backupData) {
    try {
        // Validate backup data
        if (!backupData || typeof backupData !== 'object') {
            throw new Error('Invalid backup data format');
        }
        
        const requiredKeys = ['items', 'categories', 'activities', 'users', 'appSettings'];
        for (const key of requiredKeys) {
            if (!backupData[key]) {
                throw new Error(`Backup is missing required data: ${key}`);
            }
        }
        
        // Create a backup of current data before restoring
        const currentDataBackup = JSON.stringify(inventoryData);
        
        // Restore data
        inventoryData = {...backupData};
        
        // Update last restore time
        inventoryData.appSettings.lastRestore = new Date().toISOString();
        
        // Save the restored data
        saveInventoryData();
        
        // Log the restore activity
        logActivity('System', 'Data Restored from Backup', getCurrentUser()?.name || 'System', {
            timestamp: new Date().toISOString(),
            restoredItems: backupData.items.length,
            restoredActivities: backupData.activities.length
        });
        
        return {
            success: true,
            message: 'Data restored successfully'
        };
    } catch (error) {
        console.error('Restore error:', error);
        return {
            success: false,
            error: error.message
        };
    }
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
    // Authentication handling
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const logoutButton = document.getElementById('logout-button');
    const currentUserName = document.getElementById('current-user-name');
    const userMenu = document.getElementById('user-menu');
    const toggleTheme = document.getElementById('toggle-theme');
    const backupButton = document.getElementById('backup-data');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Check if the user is already logged in
    function checkLoginStatus() {
        if (isUserLoggedIn()) {
            // Update UI with user info
            const user = getCurrentUser();
            if (currentUserName) {
                currentUserName.textContent = user.name;
            }
            
            // Show app, hide login
            loginScreen.style.display = 'none';
            appContainer.style.display = 'block';
            
            // Initialize app components
            renderInventoryTable();
            renderCategories();
            updateDashboard();
            
            // Apply theme if saved
            const settings = getAppSettings();
            if (settings.theme === 'dark') {
                document.body.classList.add('dark-theme');
                if (toggleTheme) {
                    toggleTheme.textContent = 'Light Mode';
                }
            }
        } else {
            // Show login, hide app
            loginScreen.style.display = 'flex';
            appContainer.style.display = 'none';
        }
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            const loginError = document.getElementById('login-error');
            
            // Show loading
            showLoading();
            
            try {
                // Attempt login
                const user = loginUser(email, password);
                
                // If remember me is checked, store in localStorage
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', email);
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                
                // Hide login screen, show app
                loginScreen.style.display = 'none';
                appContainer.style.display = 'block';
                
                // Update UI with user info
                if (currentUserName) {
                    currentUserName.textContent = user.name;
                }
                
                // Initialize app components
                renderInventoryTable();
                renderCategories();
                updateDashboard();
                
                // Show success message
                showToast(`Welcome, ${user.name}!`, 'success');
                
            } catch (error) {
                // Show error message
                if (loginError) {
                    loginError.textContent = error.message;
                    loginError.style.display = 'block';
                }
                console.error('Login failed:', error);
            } finally {
                // Hide loading
                hideLoading();
            }
        });
    }
    
    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const registerError = document.getElementById('register-error');
            
            // Basic validation
            if (password !== confirmPassword) {
                registerError.textContent = 'Passwords do not match';
                registerError.style.display = 'block';
                return;
            }
            
            // Show loading
            showLoading();
            
            try {
                // Register user
                const userData = {
                    name,
                    email,
                    password,
                    role: 'Staff' // Default role for new users
                };
                
                const newUser = registerUser(userData);
                
                // Switch to login form
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
                
                // Pre-fill email
                document.getElementById('login-email').value = email;
                
                // Show success message
                showToast('Registration successful! Please sign in.', 'success');
                
            } catch (error) {
                // Show error message
                if (registerError) {
                    registerError.textContent = error.message;
                    registerError.style.display = 'block';
                }
                console.error('Registration failed:', error);
            } finally {
                // Hide loading
                hideLoading();
            }
        });
    }
    
    // Switch between login and register forms
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    // Handle logout
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Confirm logout
            const confirmDialog = document.createElement('div');
            confirmDialog.className = 'confirmation-dialog';
            confirmDialog.innerHTML = `
                <div class="confirmation-content">
                    <h3>Confirm Logout</h3>
                    <p>Are you sure you want to log out?</p>
                    <div class="confirmation-actions">
                        <button class="btn secondary cancel-confirmation">Cancel</button>
                        <button class="btn primary confirm-action">Logout</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(confirmDialog);
            
            // Handle cancel button
            confirmDialog.querySelector('.cancel-confirmation').addEventListener('click', function() {
                document.body.removeChild(confirmDialog);
            });
            
            // Handle confirm button
            confirmDialog.querySelector('.confirm-action').addEventListener('click', function() {
                document.body.removeChild(confirmDialog);
                
                // Show loading
                showLoading();
                
                // Logout the user
                logoutUser();
                
                // Hide app, show login
                appContainer.style.display = 'none';
                loginScreen.style.display = 'flex';
                
                // Hide loading
                hideLoading();
                
                // Show success message
                showToast('You have been logged out.', 'success');
            });
        });
    }
    
    // Toggle theme
    if (toggleTheme) {
        toggleTheme.addEventListener('click', function(e) {
            e.preventDefault();
            
            const isDarkTheme = document.body.classList.contains('dark-theme');
            
            if (isDarkTheme) {
                // Switch to light theme
                document.body.classList.remove('dark-theme');
                this.textContent = 'Dark Mode';
                
                // Update settings
                updateAppSettings({ theme: 'light' });
            } else {
                // Switch to dark theme
                document.body.classList.add('dark-theme');
                this.textContent = 'Light Mode';
                
                // Update settings
                updateAppSettings({ theme: 'dark' });
            }
            
            // Show confirmation
            showToast(`Switched to ${isDarkTheme ? 'light' : 'dark'} mode`, 'success');
        });
    }
    
    // Handle backup and restore
    if (backupButton) {
        backupButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a dropdown menu for backup options
            const backupMenu = document.createElement('div');
            backupMenu.className = 'dropdown-menu backup-options';
            backupMenu.innerHTML = `
                <a href="#" class="dropdown-item" id="create-backup">Create Backup</a>
                <a href="#" class="dropdown-item" id="restore-backup">Restore from Backup</a>
            `;
            
            // Position and show the menu
            backupMenu.style.position = 'absolute';
            backupMenu.style.right = '0';
            backupMenu.style.top = '100%';
            backupMenu.style.zIndex = '1000';
            
            // Add to dropdown container
            this.closest('.dropdown-menu').appendChild(backupMenu);
            
            // Prevent click bubbling
            backupMenu.addEventListener('click', function(evt) {
                evt.stopPropagation();
            });
            
            // Handle create backup
            document.getElementById('create-backup').addEventListener('click', function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                
                // Close dropdown menu
                document.body.click(); // Close all dropdowns
                
                // Show loading
                showLoading();
                
                try {
                    // Perform backup
                    const result = backupData();
                    
                    if (result.success) {
                        // Show success message
                        showToast('Backup created successfully', 'success');
                    } else {
                        // Show error message
                        showToast(`Backup failed: ${result.error}`, 'error');
                    }
                } catch (error) {
                    console.error('Backup error:', error);
                    showToast('Failed to create backup', 'error');
                } finally {
                    // Hide loading after a short delay to ensure download starts
                    setTimeout(hideLoading, 1000);
                }
            });
            
            // Handle restore backup
            document.getElementById('restore-backup').addEventListener('click', function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                
                // Close dropdown menu
                document.body.click(); // Close all dropdowns
                
                // Create file input for uploading backup
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.json';
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);
                
                // Trigger file selection
                fileInput.click();
                
                // Handle file selection
                fileInput.addEventListener('change', function() {
                    if (fileInput.files.length > 0) {
                        const file = fileInput.files[0];
                        
                        // Show loading
                        showLoading();
                        
                        // Read the file
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            try {
                                const backupData = JSON.parse(e.target.result);
                                
                                // Create confirmation dialog
                                const confirmDialog = document.createElement('div');
                                confirmDialog.className = 'confirmation-dialog';
                                confirmDialog.innerHTML = `
                                    <div class="confirmation-content">
                                        <h3>Confirm Restore</h3>
                                        <p>You are about to restore data from backup. This will replace your current inventory data.</p>
                                        <p><strong>Backup contains:</strong></p>
                                        <ul>
                                            <li>${backupData.items?.length || 0} items</li>
                                            <li>${backupData.categories?.length || 0} categories</li>
                                            <li>${backupData.activities?.length || 0} activity logs</li>
                                            <li>${backupData.users?.length || 0} user accounts</li>
                                        </ul>
                                        <p>This action cannot be undone. Are you sure you want to continue?</p>
                                        <div class="confirmation-actions">
                                            <button class="btn secondary cancel-confirmation">Cancel</button>
                                            <button class="btn primary confirm-action">Restore Data</button>
                                        </div>
                                    </div>
                                `;
                                
                                // Hide loading
                                hideLoading();
                                
                                document.body.appendChild(confirmDialog);
                                
                                // Handle cancel button
                                confirmDialog.querySelector('.cancel-confirmation').addEventListener('click', function() {
                                    document.body.removeChild(confirmDialog);
                                });
                                
                                // Handle confirm button
                                confirmDialog.querySelector('.confirm-action').addEventListener('click', function() {
                                    // Show loading
                                    showLoading();
                                    
                                    // Close dialog
                                    document.body.removeChild(confirmDialog);
                                    
                                    try {
                                        // Perform restore
                                        const result = restoreFromBackup(backupData);
                                        
                                        if (result.success) {
                                            // Show success message
                                            showToast('Data restored successfully', 'success');
                                            
                                            // Reload the interface
                                            renderInventoryTable();
                                            renderCategories();
                                            updateDashboard();
                                        } else {
                                            // Show error message
                                            showToast(`Restore failed: ${result.error}`, 'error');
                                        }
                                    } catch (error) {
                                        console.error('Restore error:', error);
                                        showToast('Failed to restore data', 'error');
                                    } finally {
                                        // Hide loading
                                        hideLoading();
                                    }
                                });
                            } catch (error) {
                                console.error('Error reading backup file:', error);
                                showToast('Invalid backup file format', 'error');
                                hideLoading();
                            }
                        };
                        
                        reader.onerror = function() {
                            console.error('Error reading file');
                            showToast('Error reading backup file', 'error');
                            hideLoading();
                        };
                        
                        reader.readAsText(file);
                    }
                    
                    // Remove the file input
                    document.body.removeChild(fileInput);
                });
            });
            
            // Close when clicking outside
            document.addEventListener('click', function closeBackupMenu() {
                if (document.contains(backupMenu)) {
                    backupMenu.remove();
                }
                document.removeEventListener('click', closeBackupMenu);
            });
            
            // Prevent immediate closing
            e.stopPropagation();
        });
    }
    
    // Handle mobile user menu
    if (userMenu) {
        userMenu.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                // Create backdrop for mobile
                if (!document.querySelector('.dropdown-backdrop')) {
                    const backdrop = document.createElement('div');
                    backdrop.className = 'dropdown-backdrop';
                    document.body.appendChild(backdrop);
                    
                    backdrop.addEventListener('click', function() {
                        document.querySelector('.user-dropdown').classList.remove('active');
                        this.remove();
                    });
                }
                
                // Toggle active class for mobile dropdown
                const dropdown = this.closest('.user-dropdown');
                dropdown.classList.toggle('active');
            }
        });
    }
    
    // Loading overlay helpers
    function showLoading() {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }
    
    function hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
    
    // Auto-login if remembered
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser && loginForm) {
        document.getElementById('login-email').value = rememberedUser;
        document.getElementById('remember-me').checked = true;
    }
    
    // Check login status
    checkLoginStatus();
    
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
    
    // Form Submission Handling with improved validation
    const addItemForm = document.getElementById('add-item-form');
    if (addItemForm) {
        // Add real-time validation as user types
        const formInputs = addItemForm.querySelectorAll('input, select');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                // Skip validation for optional fields if empty
                if (!this.required && !this.value.trim()) return;
                
                let validationRules = {};
                
                // Set validation rules based on input
                switch(this.id) {
                    case 'item-name':
                        validationRules = { required: true, minLength: 3, maxLength: 100 };
                        break;
                    case 'item-category':
                        validationRules = { required: true };
                        break;
                    case 'item-quantity':
                        validationRules = { required: true, min: 0 };
                        break;
                    case 'item-unit':
                        validationRules = { required: true };
                        break;
                    case 'item-min-quantity':
                        validationRules = { min: 0 };
                        break;
                    case 'item-price':
                        validationRules = { min: 0 };
                        break;
                    default:
                        // No specific validation for other fields
                        break;
                }
                
                // Validate and show feedback
                const validationResult = validateFormInput(this, validationRules);
                showValidationFeedback(this, validationResult);
            });
        });
        
        // Form submission handler
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements to validate
            const nameInput = document.getElementById('item-name');
            const categoryInput = document.getElementById('item-category');
            const quantityInput = document.getElementById('item-quantity');
            const unitInput = document.getElementById('item-unit');
            const minQuantityInput = document.getElementById('item-min-quantity');
            const priceInput = document.getElementById('item-price');
            const expiryInput = document.getElementById('item-expiry');
            const locationInput = document.getElementById('item-location');
            const descriptionInput = document.getElementById('item-description');
            
            // Validate each field
            const nameValidation = validateFormInput(nameInput, { required: true, minLength: 3, maxLength: 100 });
            const categoryValidation = validateFormInput(categoryInput, { required: true });
            const quantityValidation = validateFormInput(quantityInput, { required: true, min: 0 });
            const unitValidation = validateFormInput(unitInput, { required: true });
            const minQuantityValidation = validateFormInput(minQuantityInput, { min: 0 });
            const priceValidation = validateFormInput(priceInput, { min: 0 });
            
            // Show validation feedback
            const nameValid = showValidationFeedback(nameInput, nameValidation);
            const categoryValid = showValidationFeedback(categoryInput, categoryValidation);
            const quantityValid = showValidationFeedback(quantityInput, quantityValidation);
            const unitValid = showValidationFeedback(unitInput, unitValidation);
            const minQuantityValid = showValidationFeedback(minQuantityInput, minQuantityValidation);
            const priceValid = showValidationFeedback(priceInput, priceValidation);
            
            // Check if all validations passed
            if (!nameValid || !categoryValid || !quantityValid || !unitValid || !minQuantityValid || !priceValid) {
                // Show validation error message at top of form
                let formError = this.querySelector('.form-error-message');
                if (!formError) {
                    formError = document.createElement('div');
                    formError.className = 'form-error-message';
                    formError.style.color = 'red';
                    formError.style.marginBottom = '15px';
                    formError.style.textAlign = 'center';
                    this.insertBefore(formError, this.firstChild);
                }
                formError.textContent = 'Please correct the validation errors below.';
                
                // Scroll to form top
                this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                return; // Stop form submission
            }
            
            // All validation passed - collect form data
            const itemData = {
                id: generateId(),
                name: nameInput.value.trim(),
                category: categoryInput.value,
                quantity: parseInt(quantityInput.value),
                unit: unitInput.value.trim(),
                minQuantity: parseInt(minQuantityInput.value) || 0,
                price: parseFloat(priceInput.value) || 0,
                expiry: expiryInput.value 
                    ? new Date(expiryInput.value).toLocaleDateString('en-US', {month: '2-digit', year: 'numeric'})
                    : 'N/A',
                location: locationInput.value.trim() || 'Not specified',
                description: descriptionInput.value.trim(),
                lastUpdated: new Date().toISOString()
            };
            
            // Determine item status using the updateItemStatus function
            updateItemStatus(itemData);
            
            try {
                // Add to our data
                inventoryData.items.push(itemData);
                
                // Save to localStorage
                saveInventoryData();
                
                // Add to activity log with detailed information
                logActivity(itemData.name, `Added (${itemData.quantity} ${itemData.unit})`, 
                    getCurrentUser()?.name || 'Admin User', {
                        quantity: itemData.quantity,
                        price: itemData.price,
                        category: itemData.category,
                        status: itemData.status
                    }
                );
                
                // Reset form
                this.reset();
                
                // Clear any validation styling
                const inputs = this.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.classList.remove('valid-input', 'invalid-input');
                    const feedback = input.parentNode.querySelector('.validation-feedback');
                    if (feedback) feedback.remove();
                });
                
                // Clear form error if exists
                const formError = this.querySelector('.form-error-message');
                if (formError) formError.remove();
                
                // Update inventory table and dashboard for immediate feedback
                renderInventoryTable();
                updateDashboard();
                
                // Show success notification using the improved toast
                showToast(`${itemData.name} has been added to inventory`, 'success');
                
            } catch (error) {
                console.error('Error adding item:', error);
                
                // Show error message
                showToast('Failed to add item to inventory', 'error');
            }
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
    
    // Add event listeners to filters with debounce to improve performance
    if (searchInput && categoryFilter && statusFilter) {
        // Debounce function to prevent excessive filtering on rapid input
        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            }
        }
        
        // Apply debounced filtering for search input (better performance)
        const debouncedFilter = debounce(filterInventory, 300);
        searchInput.addEventListener('input', debouncedFilter);
        
        // Regular filtering for select boxes
        categoryFilter.addEventListener('change', filterInventory);
        statusFilter.addEventListener('change', filterInventory);
        
        // Add clear filters button
        const filtersContainer = searchInput.closest('.filters');
        if (filtersContainer) {
            const clearButton = document.createElement('button');
            clearButton.className = 'btn secondary';
            clearButton.textContent = 'Clear Filters';
            clearButton.style.marginLeft = 'auto';
            filtersContainer.appendChild(clearButton);
            
            clearButton.addEventListener('click', function() {
                // Reset all filter inputs
                searchInput.value = '';
                categoryFilter.value = '';
                statusFilter.value = '';
                
                // Update display
                filterInventory();
                
                // Show feedback
                showToast('Filters cleared', 'success');
            });
        }
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
                <td><span class="status ${item.status}">${item.status.replace('-', ' ').replace(
                    /\b\w/g, l => l.toUpperCase()
                )}</span></td>
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
                                // Process activity data to find consumption patterns
                                const usageActivities = inventoryData.activities.filter(activity => 
                                    activity.action.includes('Stock Reduced') || activity.action.includes('Used')
                                );
                                
                                // Group activities by item
                                const usageByItem = {};
                                usageActivities.forEach(activity => {
                                    if (!usageByItem[activity.item]) {
                                        usageByItem[activity.item] = [];
                                    }
                                    
                                    // Extract quantity from action text
                                    const quantityMatch = activity.action.match(/\((\d+)/);
                                    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
                                    
                                    usageByItem[activity.item].push({
                                        date: activity.date,
                                        quantity: quantity
                                    });
                                });
                                
                                // Calculate total usage for each item
                                const totalUsageByItem = Object.keys(usageByItem).map(item => {
                                    const totalUsage = usageByItem[item].reduce((sum, usage) => sum + usage.quantity, 0);
                                    return { item, totalUsage };
                                }).sort((a, b) => b.totalUsage - a.totalUsage);
                                
                                reportContent = `
                                    <p>Report generated on ${new Date().toLocaleDateString()}</p>
                                    <h4>Usage Summary</h4>
                                    ${usageActivities.length > 0 ? `
                                        <p>Total usage activities: ${usageActivities.length}</p>
                                        
                                        <h4>Usage by Item</h4>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Total Usage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${totalUsageByItem.map(item => `
                                                    <tr>
                                                        <td>${item.item}</td>
                                                        <td>${item.totalUsage} units</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                        
                                        <h4>Recent Usage Activity</h4>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>User</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${usageActivities.slice(0, 10).map(activity => {
                                                    const quantityMatch = activity.action.match(/\((\d+)/);
                                                    const quantity = quantityMatch ? quantityMatch[1] : '1';
                                                    
                                                    return `
                                                        <tr>
                                                            <td>${activity.date}</td>
                                                            <td>${activity.item}</td>
                                                            <td>${quantity} units</td>
                                                            <td>${activity.user}</td>
                                                        </tr>
                                                    `;
                                                }).join('')}
                                            </tbody>
                                        </table>
                                        
                                        <div style="margin-top: 2rem;">
                                            <p><strong>Note:</strong> In a production environment, this report would include charts 
                                            and more detailed time-based analysis of consumption patterns.</p>
                                        </div>
                                    ` : '<p>No usage data available yet. Use items from inventory to generate consumption data.</p>'}
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
                                                            <td><span class="status ${item.status}">${item.quantity} ${item.unit}</span></td>
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
        
        // Validate inputs
        const nameInput = document.getElementById('edit-item-name');
        const quantityInput = document.getElementById('edit-item-quantity');
        const unitInput = document.getElementById('edit-item-unit');
        const minQuantityInput = document.getElementById('edit-item-min-quantity');
        const priceInput = document.getElementById('edit-item-price');
        
        // Basic validation
        if (!nameInput.value.trim()) {
            showFormError(this, 'Item name is required');
            return;
        }
        
        if (isNaN(parseInt(quantityInput.value)) || parseInt(quantityInput.value) < 0) {
            showFormError(this, 'Quantity must be a valid number');
            return;
        }
        
        if (!unitInput.value.trim()) {
            showFormError(this, 'Unit is required');
            return;
        }
        
        // Get the updated item data
        const updatedItem = {
            id: parseInt(document.getElementById('edit-item-id').value),
            name: nameInput.value.trim(),
            category: document.getElementById('edit-item-category').value,
            quantity: parseInt(quantityInput.value),
            unit: unitInput.value.trim(),
            minQuantity: parseInt(minQuantityInput.value) || 0,
            price: parseFloat(priceInput.value) || 0,
            expiry: document.getElementById('edit-item-expiry').value,
            location: document.getElementById('edit-item-location').value,
            description: document.getElementById('edit-item-description').value
        };
        
        // Show processing state in the form
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Saving...';
        submitButton.disabled = true;
        
        // Close the modal immediately
        document.body.removeChild(modalContainer);
        
        try {
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
                
                // Show success notification popup
                const popup = document.createElement('div');
                popup.className = 'popup-notification success';
                popup.innerHTML = `
                    <div class="popup-icon">✓</div>
                    <div class="popup-message">
                        <strong>Success!</strong>
                        <p>${updatedItem.name} has been updated</p>
                    </div>
                `;
                
                document.body.appendChild(popup);
                
                // Show the popup (for animation)
                setTimeout(() => {
                    popup.classList.add('show');
                }, 10);
                
                // Auto remove after 2 seconds
                setTimeout(() => {
                    popup.classList.remove('show');
                    setTimeout(() => {
                        if (document.body.contains(popup)) {
                            document.body.removeChild(popup);
                        }
                    }, 300);
                }, 2000);
            }
        } catch (error) {
            // Show error popup if something goes wrong
            const popup = document.createElement('div');
            popup.className = 'popup-notification error';
            popup.innerHTML = `
                <div class="popup-icon">✕</div>
                <div class="popup-message">
                    <strong>Error!</strong>
                    <p>Could not update the item. Please try again.</p>
                </div>
            `;
            
            document.body.appendChild(popup);
            
            // Show the popup (for animation)
            setTimeout(() => {
                popup.classList.add('show');
            }, 10);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                popup.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(popup)) {
                        document.body.removeChild(popup);
                    }
                }, 300);
            }, 3000);
            
            console.error('Error updating item:', error);
        }
    });
    
    // Helper function to show form error
    function showFormError(form, message) {
        let errorElement = form.querySelector('.form-error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error-message';
            errorElement.style.color = 'red';
            errorElement.style.marginTop = '10px';
            errorElement.style.marginBottom = '10px';
            errorElement.style.textAlign = 'center';
            form.insertBefore(errorElement, form.querySelector('.form-actions'));
        }
        
        errorElement.textContent = message;
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Show Use Item Modal function
function showUseItemModal(item) {
    try {
        // Ensure we're working with the most up-to-date item data
        const itemIndex = inventoryData.items.findIndex(i => i.id === item.id);
        if (itemIndex === -1) {
            showToast('Item not found', 'error');
            return;
        }
        
        // Get the fresh item data
        const freshItem = inventoryData.items[itemIndex];
        
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        
        // Create modal content
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Use Item: ${freshItem.name}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="use-item-form">
                        <p>Current stock: <strong>${freshItem.quantity} ${freshItem.unit}</strong></p>
                        
                        <div class="form-group">
                            <label for="use-quantity">Quantity to Use</label>
                            <input type="number" id="use-quantity" min="1" max="${freshItem.quantity}" value="1" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="use-notes">Notes (Optional)</label>
                            <textarea id="use-notes" rows="2"></textarea>
                        </div>
                        
                        <div id="use-error-container" class="error-message" style="display: none; color: red; margin: 10px 0; text-align: center;"></div>
                        
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
        
        // Add event listeners for closing the modal
        const closeButtons = modalContainer.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
        });
        
        // Add event listener for form submission
        const useForm = modalContainer.querySelector('#use-item-form');
        useForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear any previous error messages
            const errorContainer = document.getElementById('use-error-container');
            errorContainer.style.display = 'none';
            errorContainer.textContent = '';
            
            // Get form values
            const useQuantity = parseInt(document.getElementById('use-quantity').value);
            const notes = document.getElementById('use-notes').value;
            
            // Validate form input
            if (isNaN(useQuantity) || useQuantity <= 0 || useQuantity > freshItem.quantity) {
                errorContainer.textContent = useQuantity <= 0 
                    ? 'Please enter a quantity greater than zero.' 
                    : `Only ${freshItem.quantity} ${freshItem.unit} available in stock.`;
                errorContainer.style.display = 'block';
                return;
            }
            
            // Create confirmation dialog
            const confirmDialog = document.createElement('div');
            confirmDialog.className = 'confirmation-dialog';
            confirmDialog.innerHTML = `
                <div class="confirmation-content">
                    <h3>Confirm Usage</h3>
                    <p>You are about to use <strong>${useQuantity} ${freshItem.unit}</strong> of <strong>${freshItem.name}</strong>.</p>
                    <p>Current stock: ${freshItem.quantity} ${freshItem.unit}</p>
                    <p>Stock after use: ${freshItem.quantity - useQuantity} ${freshItem.unit}</p>
                    ${notes ? `<p>Notes: ${notes}</p>` : ''}
                    <div class="confirmation-actions">
                        <button class="btn secondary cancel-confirmation">Cancel</button>
                        <button class="btn primary confirm-action">Confirm</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(confirmDialog);
            
            // Handle cancel button
            confirmDialog.querySelector('.cancel-confirmation').addEventListener('click', function() {
                document.body.removeChild(confirmDialog);
            });
            
            // Handle confirm button
            confirmDialog.querySelector('.confirm-action').addEventListener('click', function() {
                try {
                    // Change to processing state
                    this.textContent = 'Processing...';
                    this.disabled = true;
                    
                    // Need to get the item again as it may have been updated
                    const currentIndex = inventoryData.items.findIndex(i => i.id === freshItem.id);
                    
                    if (currentIndex === -1) {
                        throw new Error('Item no longer exists in inventory');
                    }
                    
                    const currentItem = {...inventoryData.items[currentIndex]};
                    
                    // Check if quantity is still valid
                    if (useQuantity > currentItem.quantity) {
                        throw new Error(`Not enough stock available. Only ${currentItem.quantity} ${currentItem.unit} in stock.`);
                    }
                    
                    // Update the quantity
                    currentItem.quantity -= useQuantity;
                    
                    // Update the status
                    updateItemStatus(currentItem);
                    
                    // Update the item in the array
                    inventoryData.items[currentIndex] = currentItem;
                    
                    // Log the activity
                    const actionText = `Stock Reduced (${useQuantity} ${currentItem.unit})${notes ? ` - Note: ${notes}` : ''}`;
                    logActivity(currentItem.name, actionText);
                    
                    // Save data to localStorage
                    saveInventoryData();
                    
                    // Close dialogs first before UI updates to prevent visual glitches
                    document.body.removeChild(confirmDialog);
                    document.body.removeChild(modalContainer);
                    
                    // Force direct DOM update for immediate feedback (without waiting for renderInventoryTable to finish)
                    const tableRows = document.querySelectorAll('#inventory-table tbody tr');
                    for (const row of tableRows) {
                        const itemNameCell = row.querySelector('td:first-child');
                        if (itemNameCell && itemNameCell.textContent === currentItem.name) {
                            const quantityCell = row.querySelector('td:nth-child(3)');
                            if (quantityCell) {
                                quantityCell.textContent = currentItem.quantity;
                            }
                            
                            const statusCell = row.querySelector('td:nth-child(5) .status');
                            if (statusCell) {
                                statusCell.className = `status ${currentItem.status}`;
                                statusCell.textContent = currentItem.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                            }
                            
                            // Update action button if quantity is now 0
                            if (currentItem.quantity === 0) {
                                const actionButton = row.querySelector('.use-item');
                                if (actionButton) {
                                    actionButton.textContent = 'Order';
                                    actionButton.classList.remove('use-item');
                                    actionButton.classList.add('order-item');
                                }
                            }
                            break;
                        }
                    }
                    
                    // Update UI completely
                    renderInventoryTable();
                    updateDashboard();
                    
                    // Show success notification
                    showToast(`Used ${useQuantity} ${currentItem.unit} of ${currentItem.name}`, 'success');
                    
                } catch (error) {
                    console.error('Error processing item use:', error);
                    
                    // Close confirmation dialog
                    document.body.removeChild(confirmDialog);
                    
                    // Show error message in the form
                    errorContainer.textContent = error.message || 'An error occurred. Please try again.';
                    errorContainer.style.display = 'block';
                }
            });
        });
    } catch (error) {
        console.error('Error showing use item modal:', error);
        showToast('Could not open use item form. Please try again.', 'error');
    }
}

// Show Order Item Modal function
function showOrderItemModal(item) {
    try {
        // Ensure we're working with the most up-to-date item data
        const itemIndex = inventoryData.items.findIndex(i => i.id === item.id);
        if (itemIndex === -1) {
            showToast('Item not found', 'error');
            return;
        }
        
        // Get the fresh item data
        const freshItem = inventoryData.items[itemIndex];
        
        // Calculate suggested order quantity
        const suggestedQuantity = Math.max(freshItem.minQuantity * 2 - freshItem.quantity, 1);
        
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        
        // Create modal content
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Order Item: ${freshItem.name}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="order-item-form">
                        <p>Current stock: <strong>${freshItem.quantity} ${freshItem.unit}</strong></p>
                        <p>Minimum quantity: <strong>${freshItem.minQuantity} ${freshItem.unit}</strong></p>
                        
                        <div class="form-group">
                            <label for="order-quantity">Quantity to Order</label>
                            <input type="number" id="order-quantity" min="1" value="${suggestedQuantity}" required>
                            <small>Suggested order: ${suggestedQuantity} ${freshItem.unit}</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="supplier">Supplier</label>
                            <input type="text" id="supplier" placeholder="Enter supplier name">
                        </div>
                        
                        <div class="form-group">
                            <label for="order-notes">Notes (Optional)</label>
                            <textarea id="order-notes" rows="2"></textarea>
                        </div>
                        
                        <div id="order-error-container" class="error-message" style="display: none; color: red; margin: 10px 0; text-align: center;"></div>
                        
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
        
        // Add event listeners for closing the modal
        const closeButtons = modalContainer.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
        });
        
        // Add event listener for form submission
        const orderForm = modalContainer.querySelector('#order-item-form');
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear any previous error messages
            const errorContainer = document.getElementById('order-error-container');
            errorContainer.style.display = 'none';
            errorContainer.textContent = '';
            
            // Get form values
            const orderQuantity = parseInt(document.getElementById('order-quantity').value);
            const supplier = document.getElementById('supplier').value;
            const notes = document.getElementById('order-notes').value;
            
            // Validate form input
            if (isNaN(orderQuantity) || orderQuantity <= 0) {
                errorContainer.textContent = 'Please enter a quantity greater than zero.';
                errorContainer.style.display = 'block';
                return;
            }
            
            // Create confirmation dialog
            const confirmDialog = document.createElement('div');
            confirmDialog.className = 'confirmation-dialog';
            confirmDialog.innerHTML = `
                <div class="confirmation-content">
                    <h3>Confirm Order</h3>
                    <p>You are about to order <strong>${orderQuantity} ${freshItem.unit}</strong> of <strong>${freshItem.name}</strong>.</p>
                    ${supplier ? `<p>Supplier: ${supplier}</p>` : ''}
                    ${notes ? `<p>Notes: ${notes}</p>` : ''}
                    <div class="confirmation-actions">
                        <button class="btn secondary cancel-confirmation">Cancel</button>
                        <button class="btn primary confirm-action">Confirm</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(confirmDialog);
            
            // Handle cancel button
            confirmDialog.querySelector('.cancel-confirmation').addEventListener('click', function() {
                document.body.removeChild(confirmDialog);
            });
            
            // Handle confirm button
            confirmDialog.querySelector('.confirm-action').addEventListener('click', function() {
                try {
                    // Change to processing state
                    this.textContent = 'Processing...';
                    this.disabled = true;
                    
                    // Need to get the item again as it may have been updated
                    const currentIndex = inventoryData.items.findIndex(i => i.id === freshItem.id);
                    
                    if (currentIndex === -1) {
                        throw new Error('Item no longer exists in inventory');
                    }
                    
                    const currentItem = {...inventoryData.items[currentIndex]};
                    
                    // Log the order activity
                    const supplierText = supplier ? ` from ${supplier}` : '';
                    const actionText = `Reordered (${orderQuantity} ${currentItem.unit})${supplierText}${notes ? ` - Note: ${notes}` : ''}`;
                    logActivity(currentItem.name, actionText);
                    
                    // Save data to localStorage
                    saveInventoryData();
                    
                    // Close dialogs first before UI updates to prevent visual glitches
                    document.body.removeChild(confirmDialog);
                    document.body.removeChild(modalContainer);
                    
                    // Update UI
                    renderInventoryTable();
                    updateDashboard();
                    
                    // Show success notification
                    showToast(`Ordered ${orderQuantity} ${currentItem.unit} of ${currentItem.name}`, 'success');
                    
                } catch (error) {
                    console.error('Error processing order:', error);
                    
                    // Close confirmation dialog
                    document.body.removeChild(confirmDialog);
                    
                    // Show error message in the form
                    errorContainer.textContent = error.message || 'An error occurred. Please try again.';
                    errorContainer.style.display = 'block';
                }
            });
        });
    } catch (error) {
        console.error('Error showing order item modal:', error);
        showToast('Could not open order form. Please try again.', 'error');
    }
}

// Show toast message - improved version with popup notifications
function showToast(message, type = 'success') {
    console.log('Showing toast:', message, type); // Debug log
    
    // Create popup notification
    const popup = document.createElement('div');
    popup.className = `popup-notification ${type}`;
    
    // Define icon based on type
    let icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'warning') icon = '⚠';
    
    // Set content
    popup.innerHTML = `
        <div class="popup-icon">${icon}</div>
        <div class="popup-message">
            <strong>${type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Warning!'}</strong>
            <p>${message}</p>
        </div>
    `;
    
    // Remove any existing popups
    const existingPopups = document.querySelectorAll('.popup-notification');
    existingPopups.forEach(p => {
        if (document.body.contains(p)) {
            document.body.removeChild(p);
        }
    });
    
    // Add to DOM
    document.body.appendChild(popup);
    
    // Force layout reflow before adding the show class
    popup.getBoundingClientRect();
    
    // Show the popup (for animation)
    popup.classList.add('show');
    
    // Auto remove after set time
    const displayTime = type === 'error' ? 3000 : 2000;
    setTimeout(() => {
        if (document.body.contains(popup)) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(popup)) {
                    document.body.removeChild(popup);
                }
            }, 300);
        }
    }, displayTime);
}