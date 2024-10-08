const express = require('express');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// POST route to save daily sales data
router.post('/save', (req, res) => {
  const { salesData, date } = req.body;

  // Create a workbook and worksheet
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(salesData);
  xlsx.utils.book_append_sheet(wb, ws, 'Sales');

  // Organize folders by year and month
  const year = new Date(date).getFullYear();
  const month = new Date(date).toLocaleString('default', { month: 'long' });
  const folderPath = path.join(__dirname, '../sales-data', year.toString(), month);

  // Ensure directory exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Save file as Excel
  const filePath = path.join(folderPath, `${date}.xlsx`);
  xlsx.writeFile(wb, filePath);

  res.status(200).json({ message: `Sales data saved to ${filePath}` });
});

module.exports = router;
