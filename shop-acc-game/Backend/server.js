const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Load acc từ file JSON
let accList = JSON.parse(fs.readFileSync('acc.json'));

// API trả acc
app.post('/get-acc', (req, res) => {
  const { product, transaction } = req.body;

  // Thêm validate transaction nếu cần
  if (!transaction || transaction.length < 3) {
    return res.status(400).json({ error: 'Vui lòng nhập mã giao dịch hợp lệ!' });
  }

  // Kiểm tra sản phẩm tồn tại
  if (!accList[product] || accList[product].length === 0) {
    return res.status(400).json({ error: 'Hết acc cho sản phẩm này!' });
  }

  // Lấy 1 acc duy nhất
  const acc = accList[product].shift();

  // Lưu file lại
  fs.writeFileSync('acc.json', JSON.stringify(accList, null, 2));

  // Trả acc cho khách
  res.json({ acc });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
