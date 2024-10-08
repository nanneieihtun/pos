// /backend/controllers/orderController.js
const { saveOrderToFile } = require('../models/orderModel');

// Controller function for saving orders
exports.saveOrder = (req, res) => {
  const { orderDetails } = req.body;

  // Save the order to a JSON file
  const result = saveOrderToFile(orderDetails);
  
  res.status(201).json(result);
};
