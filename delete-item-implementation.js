/**
 * Improved implementation for inventory item updates
 * This file provides a solution for the issue where edited items 
 * don't update immediately in the UI without a page refresh
 */

// Function to update DOM directly after an item is edited
function updateItemInDOM(updatedItem) {
    if (!updatedItem) return false;
    
    // Find the item in the table
    const tableRows = document.querySelectorAll('#inventory-table tbody tr');
    let updated = false;
    
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
            
            // Update action button if quantity changed to/from zero
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
            
            updated = true;
            break;
        }
    }
    
    return updated;
}

// Load this script after page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get the original updateItem function and enhance it
    if (typeof updateItem === 'function') {
        const originalUpdateItem = updateItem;
        
        // Override the original function with our enhanced version
        window.updateItem = function(id, itemData) {
            // Call the original function to update the data
            const result = originalUpdateItem(id, itemData);
            
            // Direct DOM update for immediate UI feedback
            updateItemInDOM(result);
            
            return result;
        };
        
        console.log('Enhanced item update functionality applied');
    }
    
    // Add a listener for edit form submissions as a fallback
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'edit-item-form') {
            // Set up a listener to ensure UI updates after the edit completes
            setTimeout(() => {
                console.log('Post-edit UI refresh applied');
                
                // Force a refresh of action handlers on the updated items
                const actionButtons = document.querySelectorAll('.edit-item, .use-item, .order-item');
                actionButtons.forEach(button => {
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    
                    // Re-attach event listeners based on button type
                    if (newButton.classList.contains('edit-item')) {
                        newButton.addEventListener('click', function() {
                            const itemId = parseInt(this.getAttribute('data-id'));
                            const item = inventoryData.items.find(i => i.id === itemId);
                            if (item) {
                                showEditItemModal(item);
                            }
                        });
                    } else if (newButton.classList.contains('use-item')) {
                        newButton.addEventListener('click', function() {
                            const itemId = parseInt(this.getAttribute('data-id'));
                            const item = inventoryData.items.find(i => i.id === itemId);
                            if (item && item.quantity > 0) {
                                showUseItemModal(item);
                            }
                        });
                    } else if (newButton.classList.contains('order-item')) {
                        newButton.addEventListener('click', function() {
                            const itemId = parseInt(this.getAttribute('data-id'));
                            const item = inventoryData.items.find(i => i.id === itemId);
                            if (item) {
                                showOrderItemModal(item);
                            }
                        });
                    }
                });
            }, 500);
        }
    });
});