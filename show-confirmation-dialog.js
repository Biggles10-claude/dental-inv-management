/**
 * Shows a confirmation dialog with customizable messages and actions
 * @param {string} title - The dialog title
 * @param {string} message - The dialog message
 * @param {Function} onConfirm - Callback function when confirmed
 * @param {Function} onCancel - Callback function when canceled
 * @param {string} confirmText - Custom text for confirm button
 * @param {string} cancelText - Custom text for cancel button
 */
function showConfirmationDialog(options) {
    const {
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        onConfirm = () => {},
        onCancel = () => {},
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        confirmButtonClass = 'primary',
        cancelButtonClass = 'secondary'
    } = options;

    // Create the confirmation dialog container
    const confirmationDialog = document.createElement('div');
    confirmationDialog.className = 'confirmation-dialog';
    
    // Create the dialog content
    confirmationDialog.innerHTML = `
        <div class="confirmation-content">
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="confirmation-actions">
                <button class="btn ${cancelButtonClass} cancel-confirmation">${cancelText}</button>
                <button class="btn ${confirmButtonClass} confirm-action">${confirmText}</button>
            </div>
        </div>
    `;
    
    // Add the dialog to the DOM
    document.body.appendChild(confirmationDialog);
    
    // Focus the confirm button
    setTimeout(() => {
        confirmationDialog.querySelector('.confirm-action').focus();
    }, 10);
    
    // Handle cancel button
    confirmationDialog.querySelector('.cancel-confirmation').addEventListener('click', function() {
        // Close the dialog
        document.body.removeChild(confirmationDialog);
        
        // Call the cancel callback
        onCancel();
    });
    
    // Handle confirm button
    confirmationDialog.querySelector('.confirm-action').addEventListener('click', function() {
        // Close the dialog
        document.body.removeChild(confirmationDialog);
        
        // Call the confirm callback
        onConfirm();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(confirmationDialog);
            onCancel();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    // Return the dialog element in case it needs to be manipulated further
    return confirmationDialog;
}

// Export the function if using modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { showConfirmationDialog };
}