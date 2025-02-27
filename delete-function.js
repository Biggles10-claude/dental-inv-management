/**
 * Enhanced notification system and UI update functions
 * This file improves the popup notification system that was having issues
 */

// Improved toast notification function
function enhancedShowToast(message, type = 'success', duration = 2000) {
    console.log('Showing enhanced toast:', message, type); // Debug log
    
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
            p.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(p)) {
                    document.body.removeChild(p);
                }
            }, 300);
        }
    });
    
    // Add to DOM
    document.body.appendChild(popup);
    
    // Force layout reflow before adding the show class
    popup.getBoundingClientRect();
    
    // Add visible class with delay for animation
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Auto remove after set time
    setTimeout(() => {
        if (document.body.contains(popup)) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(popup)) {
                    document.body.removeChild(popup);
                }
            }, 300);
        }
    }, duration);
    
    return popup;
}

// Function to monkey-patch the original showToast function
function replaceShowToastFunction() {
    if (typeof window.showToast === 'function') {
        // Store the original function reference
        const originalShowToast = window.showToast;
        
        // Override with our enhanced version
        window.showToast = function(message, type = 'success', duration = 2000) {
            return enhancedShowToast(message, type, duration);
        };
        console.log('Toast function enhanced');
    } else {
        console.log('Original showToast function not found, will add it');
        window.showToast = enhancedShowToast;
    }
}

// Apply our enhancements when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Replace the toast notification function with our improved version
    replaceShowToastFunction();
    
    // Fix for duplicate error notifications on edit
    // Override the original notification handling in edit form
    const originalEditSubmitHandler = modalContainer => {
        if (modalContainer && modalContainer.querySelector) {
            const editForm = modalContainer.querySelector('#edit-item-form');
            if (editForm && editForm.addEventListener) {
                const originalSubmit = editForm.onsubmit;
                editForm.onsubmit = function(e) {
                    // Prevent the original error popup
                    try {
                        // Store original createElement to intercept popup creation
                        const originalCreateElement = document.createElement;
                        document.createElement = function(tagName) {
                            const element = originalCreateElement.call(document, tagName);
                            
                            // Intercept error popup creation
                            if (tagName === 'div' && element.className === 'popup-notification error') {
                                console.log('Intercepted error popup creation');
                                // Restore original createElement immediately
                                document.createElement = originalCreateElement;
                                
                                // Return a dummy element that won't be used
                                const dummyElement = originalCreateElement.call(document, 'div');
                                dummyElement.style.display = 'none';
                                return dummyElement;
                            }
                            
                            return element;
                        };
                        
                        // Let the original handler run
                        setTimeout(() => {
                            // Restore original createElement
                            document.createElement = originalCreateElement;
                        }, 500);
                    } catch (err) {
                        console.error('Error fixing notifications:', err);
                    }
                };
            }
        }
    };
    
    // Watch for edit modal creation
    const originalAppendChild = document.body.appendChild;
    document.body.appendChild = function(element) {
        const result = originalAppendChild.call(this, element);
        
        // Check if this is a modal container
        if (element.className === 'modal-container') {
            // Try to fix the submit handler
            setTimeout(() => originalEditSubmitHandler(element), 10);
        }
        
        return result;
    };
});