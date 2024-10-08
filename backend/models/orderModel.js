// /backend/models/orderModel.js
const fs = require('fs');
const path = require('path');

// Function to save order data into a file
function saveOrderToFile(orderDetails) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;  // Month is zero-based
  const day = today.getDate();
  
  // Create a file path based on the year, month, and day
  const filePath = path.join(__dirname, `../data/${year}/${month}/${day}.json`);
  
  // Ensure that the directories exist
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
  // Append order details to the file
  fs.appendFileSync(filePath, JSON.stringify(orderDetails) + "\n", 'utf8');
  
  return { message: 'Order saved successfully' };
}

module.exports = { saveOrderToFile };
