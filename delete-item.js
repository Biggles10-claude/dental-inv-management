/**
 * Auto-fix script for inventory update issues
 * This file can be included in index.html to automatically apply the fixes
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auto-loading inventory update fixes...');
    
    // IMPORTANT: Directly patch the showEditItemModal function to fix the error popup issue
    setTimeout(() => {
        // Function to directly modify the script.js code
        const fixEditItemModal = () => {
            if (typeof showEditItemModal === 'function') {
                console.log('Found showEditItemModal function, patching it...');
                
                // Store the original function
                const originalShowEditItemModal = showEditItemModal;
                
                // Replace with our fixed version
                window.showEditItemModal = function(item) {
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
                                
                                // Show success notification popup - THIS IS THE ONLY NOTIFICATION WE'LL SHOW
                                showToast(`${updatedItem.name} has been updated`, 'success');
                                
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