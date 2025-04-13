// utility.js
export const getLowStockItems = (inventory, threshold = 5) => {
  return inventory.filter(item => item.quantity < threshold);
};
