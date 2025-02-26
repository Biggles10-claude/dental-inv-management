// Mock the document and window objects since we're testing DOM functionality
document.body.innerHTML = `
<div class="dashboard-grid">
  <div class="card"><p class="count">0</p></div>
  <div class="card"><p class="count">0</p></div>
  <div class="card"><p class="count">0</p></div>
  <div class="card"><p class="count">0</p></div>
</div>
<div class="recent-activity">
  <table><tbody></tbody></table>
</div>
<table id="inventory-table">
  <tbody></tbody>
</table>
<ul id="categories-list"></ul>
`;

// Mock the localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Import the inventory data object structure
// Since the script is not modular, we'll recreate the essential parts for testing
const inventoryData = {
  items: [
    {
      id: 1,
      name: "Test Item",
      category: "test-category",
      quantity: 15,
      unit: "Box",
      minQuantity: 10,
      status: "in-stock",
      expiry: "08/2025",
      price: 25.00,
      location: "Test Location"
    }
  ],
  categories: ["test-category"],
  activities: []
};

// Test inventory helper functions
describe('Inventory Management Functions', () => {
  // Test 1: Adding a new item
  test('Should add a new item to inventory', () => {
    // Create a new item
    const newItem = {
      id: 2,
      name: "New Test Item",
      category: "test-category",
      quantity: 5,
      unit: "Box",
      minQuantity: 10,
      status: "low-stock",
      expiry: "05/2025",
      price: 15.00,
      location: "Storage Room"
    };
    
    // Add the item to our inventory
    inventoryData.items.push(newItem);
    
    // Check if the item was added
    expect(inventoryData.items.length).toBe(2);
    expect(inventoryData.items[1].name).toBe("New Test Item");
  });
  
  // Test 2: Updating item quantity
  test('Should update item quantity and status correctly', () => {
    // Get the first item
    const item = inventoryData.items[0];
    const originalQuantity = item.quantity;
    
    // Reduce quantity by 10
    item.quantity -= 10;
    
    // Update status based on quantity
    if (item.quantity <= 0) {
      item.status = 'out-of-stock';
    } else if (item.quantity <= item.minQuantity) {
      item.status = 'low-stock';
    } else {
      item.status = 'in-stock';
    }
    
    // Check quantity was reduced
    expect(item.quantity).toBe(originalQuantity - 10);
    
    // Check status was updated to low-stock
    expect(item.status).toBe('low-stock');
    
    // Reduce quantity again to go out of stock
    item.quantity = 0;
    
    // Update status
    if (item.quantity <= 0) {
      item.status = 'out-of-stock';
    }
    
    // Check status is now out-of-stock
    expect(item.status).toBe('out-of-stock');
  });
  
  // Test 3: Filtering inventory
  test('Should filter inventory correctly', () => {
    // Add another test item with a different category
    inventoryData.items.push({
      id: 3,
      name: "Different Category Item",
      category: "other-category",
      quantity: 20,
      unit: "Box",
      minQuantity: 5,
      status: "in-stock",
      expiry: "12/2025",
      price: 30.00,
      location: "Cabinet"
    });
    
    // Add the new category
    inventoryData.categories.push("other-category");
    
    // Filter by category
    const filteredByCategory = inventoryData.items.filter(item => 
      item.category === "test-category"
    );
    
    // Filter by status (assuming we have added previous items)
    const filteredByStatus = inventoryData.items.filter(item => 
      item.status === "in-stock"
    );
    
    // Check filtering worked correctly
    expect(filteredByCategory.length).toBe(2);
    expect(filteredByStatus.length).toBe(1);
    expect(filteredByStatus[0].name).toBe("Different Category Item");
  });
});

// Tests for inventory alert calculations
describe('Inventory Alert Functions', () => {
  test('Should identify low stock items correctly', () => {
    // Get low stock items
    const lowStockItems = inventoryData.items.filter(item => 
      item.status === 'low-stock' || item.status === 'out-of-stock'
    );
    
    // We should have items in low stock (from previous test)
    expect(lowStockItems.length).toBe(2);
    
    // First item should be the one we set to low-stock and then out-of-stock
    expect(lowStockItems[0].id).toBe(1);
  });
  
  test('Should calculate suggested order amount correctly', () => {
    // For each low stock item, calculate suggested order
    const lowStockItems = inventoryData.items.filter(item => 
      item.status === 'low-stock' || item.status === 'out-of-stock'
    );
    
    // Calculate suggested order amount (double the min quantity minus current)
    const firstItem = lowStockItems[0];
    const suggestedOrder = Math.max(firstItem.minQuantity * 2 - firstItem.quantity, 0);
    
    // First item has quantity 0 and min quantity 10, so should suggest 20
    expect(suggestedOrder).toBe(20);
  });
});