/**
 * Auto-fix script for inventory update issues
 * This file can be included in index.html to automatically apply the fixes
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auto-loading inventory update fixes...');
    
    // IMPORTANT: Directly patch the showEditItemModal function to fix the error popup issue
    setTimeout(() => {
        // Let's create a manual success popup function that doesn't rely on showToast
function directSuccessPopup(message) {
    const successPopup = document.createElement('div');
    successPopup.className = 'popup-notification success';
    successPopup.style.position = 'fixed';
    successPopup.style.bottom = '20px';
    successPopup.style.right = '20px';
    successPopup.style.backgroundColor = 'white';
    successPopup.style.borderRadius = '4px';
    successPopup.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.3)';
    successPopup.style.zIndex = '9999';
    successPopup.style.display = 'flex';
    successPopup.style.alignItems = 'center';
    successPopup.style.width = '300px';
    successPopup.style.borderLeft = '4px solid #4caf50';
    
    // Set content
    successPopup.innerHTML = `
        <div style="width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: bold; color: #4caf50;">✓</div>
        <div style="padding: 12px 15px; flex: 1;">
            <strong style="display: block; margin-bottom: 3px;">Success!</strong>
            <p style="margin: 0; font-size: 14px;">${message}</p>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(successPopup);
    
    // Start hidden
    successPopup.style.opacity = '0';
    successPopup.style.transform = 'translateY(30px)';
    successPopup.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Force reflow
    successPopup.getBoundingClientRect();
    
    // Show with animation
    successPopup.style.opacity = '1';
    successPopup.style.transform = 'translateY(0)';
    
    // Auto remove after set time
    setTimeout(() => {
        successPopup.style.opacity = '0';
        successPopup.style.transform = 'translateY(30px)';
        setTimeout(() => {
            if (document.body.contains(successPopup)) {
                document.body.removeChild(successPopup);
            }
        }, 300);
    }, 2000);
}

// Function to directly modify the script.js code
        const fixEditItemModal = () => {
            if (typeof showEditItemModal === 'function') {
                console.log('Found showEditItemModal function, patching it...');
                
                // Store the original function
                const originalShowEditItemModal = showEditItemModal;
                
                // Replace with our fixed version
                window.showEditItemModal = function(item) {
                    // Check if a modal or confirmation dialog already exists and remove it first
                    const existingModal = document.querySelector('.modal-container');
                    if (existingModal) {
                        document.body.removeChild(existingModal);
                    }
                    
                    const existingConfirmation = document.querySelector('.confirmation-dialog');
                    if (existingConfirmation) {
                        document.body.removeChild(existingConfirmation);
                    }
                    
                    // Create modal container
                    const modalContainer = document.createElement('div');
                    modalContainer.className = 'modal-container';
                    
                    // Create modal content - use the same HTML structure as the original
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
                                
                                // Direct DOM update for immediate feedback
                                const tableRows = document.querySelectorAll('#inventory-table tbody tr');
                                for (const row of tableRows) {
                                    const itemNameCell = row.querySelector('td:first-child');
                                    if (itemNameCell && itemNameCell.textContent === updatedItem.name) {
                                        // Update quantity cell
                                        const quantityCell = row.querySelector('td:nth-child(3)');
                                        if (quantityCell) {
                                            quantityCell.textContent = updatedItem.quantity;
                                        }
                                        
                                        // Update category cell
                                        const categoryCell = row.querySelector('td:nth-child(2)');
                                        if (categoryCell) {
                                            categoryCell.textContent = updatedItem.category.charAt(0).toUpperCase() + updatedItem.category.slice(1);
                                        }
                                        
                                        // Update status cell
                                        const statusCell = row.querySelector('td:nth-child(5) .status');
                                        if (statusCell) {
                                            statusCell.className = `status ${updatedItem.status}`;
                                            statusCell.textContent = updatedItem.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                                        }

                                        // Update expiry cell
                                        const expiryCell = row.querySelector('td:nth-child(6)');
                                        if (expiryCell) {
                                            expiryCell.textContent = updatedItem.expiry;
                                        }
                                        
                                        // Update action button if quantity changed
                                        if (updatedItem.quantity === 0) {
                                            const actionButton = row.querySelector('.use-item');
                                            if (actionButton) {
                                                actionButton.textContent = 'Order';
                                                actionButton.classList.remove('use-item');
                                                actionButton.classList.add('order-item');
                                            }
                                        } else if (updatedItem.quantity > 0) {
                                            const actionButton = row.querySelector('.order-item');
                                            if (actionButton) {
                                                actionButton.textContent = 'Use';
                                                actionButton.classList.remove('order-item');
                                                actionButton.classList.add('use-item');
                                            }
                                        }
                                        break;
                                    }
                                }
                                
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
                                
                                // Complete UI update in background
                                setTimeout(() => {
                                    renderInventoryTable();
                                    updateDashboard();
                                }, 100);
                            }
                        } catch (error) {
                            console.error('Error updating item:', error);
                            showToast('Could not update the item. Please try again.', 'error');
                        }
                    });
                    
                    // Helper function to show form error - copied from original
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
                };
                
                console.log('Successfully patched edit modal function');
                
                // Fix the showUseItemModal function and add custom success popup
                if (typeof showUseItemModal === 'function') {
                    const originalShowUseItemModal = showUseItemModal;
                    
                    window.showUseItemModal = function(item) {
                        // Check if a modal or confirmation dialog already exists and remove it first
                        const existingModal = document.querySelector('.modal-container');
                        if (existingModal) {
                            document.body.removeChild(existingModal);
                        }
                        
                        const existingConfirmation = document.querySelector('.confirmation-dialog');
                        if (existingConfirmation) {
                            document.body.removeChild(existingConfirmation);
                        }
                        
                        // Create a custom modal that includes our patched success notification
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
                                
                                // Add flag to prevent multiple submissions
                                let isProcessing = false;
                                
                                // Handle cancel button
                                confirmDialog.querySelector('.cancel-confirmation').addEventListener('click', function() {
                                    document.body.removeChild(confirmDialog);
                                });
                                
                                // Handle confirm button
                                confirmDialog.querySelector('.confirm-action').addEventListener('click', function() {
                                    if (isProcessing) return;
                                    isProcessing = true;
                                    
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
                                        
                                        // Force direct DOM update for immediate feedback
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
                                        
                                        // Use the direct popup function instead
                                        directSuccessPopup(`Used ${useQuantity} ${currentItem.unit} of ${currentItem.name}`);
                                        
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
                    };
                    
                    console.log('Successfully patched use modal function with custom success notification');
                }
                
                // Fix the showOrderItemModal function as well
                if (typeof showOrderItemModal === 'function') {
                    const originalShowOrderItemModal = showOrderItemModal;
                    
                    window.showOrderItemModal = function(item) {
                        // Check if a modal or confirmation dialog already exists and remove it first
                        const existingModal = document.querySelector('.modal-container');
                        if (existingModal) {
                            document.body.removeChild(existingModal);
                        }
                        
                        const existingConfirmation = document.querySelector('.confirmation-dialog');
                        if (existingConfirmation) {
                            document.body.removeChild(existingConfirmation);
                        }
                        
                        // Call the original function
                        return originalShowOrderItemModal(item);
                    };
                    
                    console.log('Successfully patched order modal function');
                }
            } else {
                console.warn('Could not find showEditItemModal function to patch');
            }
        };
        
        // Apply the edit modal fix after a delay to ensure script.js has loaded
        setTimeout(fixEditItemModal, 500);
        
        // Small notification that appears but doesn't need interaction
        const notification = document.createElement('div');
        notification.textContent = 'Inventory update fix applied';
        notification.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background-color: rgba(33, 150, 243, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
            
            // Hide after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(20px)';
                
                // Remove from DOM after animation
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }, 10);
    }, 1000);
});