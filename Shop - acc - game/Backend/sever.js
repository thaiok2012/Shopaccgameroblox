const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Middleware để parse JSON nếu cần
app.use(express.json());

// Path file chứa acc
const accFile = path.join(__dirname, "acc.json");

// Route hiển thị thông báo homepage
app.get("/", (req, res) => {
  res.send("Shop acc game Roblox chạy thành công! Truy cập /get-acc để lấy acc.");
});

// API trả acc
app.get("/get-acc", (req, res) => {
  try {
    const rawData = fs.readFileSync(accFile, "utf8");
    const accList = JSON.parse(rawData);

    if (accList.length === 0) {
      return res.json({ success: false, message: "Hết acc rồi!" });
    }

    // Lấy acc đầu tiên
    const account = accList.shift();

    // Lưu lại acc còn lại
    fs.writeFileSync(accFile, JSON.stringify(accList, null, 2));

    res.json({ success: true, account });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
