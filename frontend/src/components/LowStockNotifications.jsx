// src/components/LowStockNotifications.jsx
import React from 'react';
import { getLowStockItems } from '../utils/utility';

const LowStockNotifications = ({ inventory, threshold = 5 }) => {
  const lowStockItems = getLowStockItems(inventory, threshold);

  if (lowStockItems.length === 0) {
    return null; // Optionally render a message that all items are sufficiently stocked.
  }

  return (
    <div className="low-stock-notifications">
      <h3>Low Stock Notifications</h3>
      <ul>
        {lowStockItems.map(item => (
          <li key={item.id}>
            {item.name} is low on stock: Only {item.quantity} left.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockNotifications;
