/**
 * Emergency direct script injection to fix the success popup issue
 */

// Wait for document to be ready and fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Manual popup script loaded');
    
    // Create a global popup function
    window.forceShowSuccessPopup = function(message) {
        console.log('Force showing success popup:', message);
        
        // Create the popup element with inline styles
        const popup = document.createElement('div');
        
        // Apply styles directly to ensure they work
        popup.style.position = 'fixed';
        popup.style.bottom = '20px';
        popup.style.right = '20px';
        popup.style.zIndex = '9999999';
        popup.style.backgroundColor = 'white';
        popup.style.color = '#333';
        popup.style.width = '300px';
        popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        popup.style.borderRadius = '4px';
        popup.style.overflow = 'hidden';
        popup.style.display = 'flex';
        popup.style.alignItems = 'center';
        popup.style.borderLeft = '4px solid #4caf50';
        
        // Set popup content with checkmark using Unicode character
        popup.innerHTML = `
            <div style="width:50px;height:50px;display:flex;justify-content:center;align-items:center;color:#4caf50;font-size:28px;font-weight:bold;">\u2713</div>
            <div style="padding:12px 15px;flex:1;">
                <strong style="display:block;margin-bottom:3px;">Success!</strong>
                <p style="margin:0;font-size:14px;">${message}</p>
            </div>
        `;
        
        // Append to body
        document.body.appendChild(popup);
        
        // Set initial position for animation
        popup.style.transform = 'translateY(100px)';
        popup.style.opacity = '0';
        popup.style.transition = 'all 0.3s ease-out';
        
        // Trigger animation
        setTimeout(function() {
            popup.style.transform = 'translateY(0)';
            popup.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(function() {
            popup.style.transform = 'translateY(100px)';
            popup.style.opacity = '0';
            setTimeout(function() {
                if (document.body.contains(popup)) {
                    document.body.removeChild(popup);
                }
            }, 300);
        }, 3000);
    };
    
    // Add direct listeners to all confirmation buttons
    function addConfirmationListeners() {
        // Clear existing event listener on all modals
        const modals = document.querySelectorAll('.modal-container, .confirmation-dialog');
        modals.forEach(modal => {
            // Find confirm buttons
            const confirmButtons = modal.querySelectorAll('.confirm-action');
            confirmButtons.forEach(button => {
                if (button && !button.hasSuccessListener) {
                    button.hasSuccessListener = true;
                    button.addEventListener('click', function(e) {
                        console.log('Confirmation button clicked, scheduling popup');
                        setTimeout(function() {
                            // Check if it's a "Use Item" form
                            const useForm = document.querySelector('#use-item-form');
                            if (useForm) {
                                const quantityInput = document.querySelector('#use-quantity');
                                const itemName = document.querySelector('.modal-header h3')?.textContent.replace('Use Item: ', '') || '';
                                
                                if (quantityInput && itemName) {
                                    const quantity = quantityInput.value;
                                    const unit = itemName.includes('Gloves') ? 'Pieces' : 
                                               itemName.includes('Anesthetic') ? 'Box' :
                                               itemName.includes('Filling') ? 'Syringe' : 'units';
                                    
                                    forceShowSuccessPopup(`Used ${quantity} ${unit} of ${itemName}`);
                                    return;
                                }
                            }
                            
                            forceShowSuccessPopup('Operation completed successfully');
                        }, 500);
                    });
                }
            });
        });
    }
    
    // Watch for new modals being added
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.classList && 
                        (node.classList.contains('modal-container') || 
                         node.classList.contains('confirmation-dialog'))) {
                        console.log('Modal/dialog added, adding success listeners');
                        setTimeout(addConfirmationListeners, 100);
                    }
                }
            }
        });
    });
    
    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Also check every second for any new modals
    setInterval(addConfirmationListeners, 1000);
    
    // Add a direct test button for debugging
    window.testSuccessPopup = function() {
        forceShowSuccessPopup('Test success message');
    };
    
    // Add direct inline popup button for immediate testing
    setTimeout(function() {
        const testButton = document.createElement('button');
        testButton.textContent = 'Test Popup';
        testButton.style.position = 'fixed';
        testButton.style.left = '10px';
        testButton.style.bottom = '10px';
        testButton.style.zIndex = '9999';
        testButton.style.padding = '8px 16px';
        testButton.style.backgroundColor = '#2196f3';
        testButton.style.color = 'white';
        testButton.style.border = 'none';
        testButton.style.borderRadius = '4px';
        testButton.style.cursor = 'pointer';
        
        testButton.addEventListener('click', function() {
            forceShowSuccessPopup('Test success message');
        });
        
        document.body.appendChild(testButton);
    }, 2000);
    
    console.log('Success popup fix installed');
});