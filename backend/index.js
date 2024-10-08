const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const xlsx = require('xlsx');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/api/sales', async (req, res) => {
  const { items, totalAmount } = req.body;
  const date = new Date();
  
  // Extract year, month, and day
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // Create folder path for year and month
  const folderPath = path.join(__dirname, 'sales', year.toString(), month.toString());
  await fs.ensureDir(folderPath);

  // Create file path for the current day with a sequential suffix if needed
  let counter = 1;
  let fileName = `${day}_${counter}.xlsx`;
  let filePath = path.join(folderPath, fileName);

  // Check if a file with the same name exists, and increment the counter if it does
  while (fs.existsSync(filePath)) {
    counter++;
    fileName = `${day}_${counter}.xlsx`;
    filePath = path.join(folderPath, fileName);
  }

  // Format the new data to be added
  const newData = items.map(item => ({
    Item: `${item.name} (${item.size})`, // Include size in the item name
    Price: item.prices[item.size],
    Quantity: item.quantity || 1,
    Total: item.prices[item.size] * (item.quantity || 1),
  }));
  
  // Add total amount row at the end
  newData.push({ Item: 'Total Amount', Price: '', Quantity: '', Total: totalAmount });

  // Create a new workbook and worksheet
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(newData);

  // Append the sheet to the workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sales');
  xlsx.writeFile(workbook, filePath);

  res.status(200).json({ message: 'Sales data saved!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
