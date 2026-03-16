// ============================================================
// 🚀  SWIGGY CLONE - Node.js + Express + MySQL Backend
// ============================================================
// npm install express mysql2 bcryptjs jsonwebtoken cors dotenv
// ============================================================

const express    = require("express");
const mysql      = require("mysql2/promise");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const cors       = require("cors");
require("dotenv").config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ── DB Connection Pool ────────────────────────────────────
const db = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "swiggy_db",
  waitForConnections: true,
  connectionLimit:    10,
  
});

// ── Auth Middleware ───────────────────────────────────────
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "swiggy_secret");
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
};

// ============================================================
// 🔐 AUTH ROUTES
// ============================================================

// Register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, phone, dob, city, address } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });
  try {
    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, phone, dob, city) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashed, phone || null, dob || null, city || null]
    );

    // Save address if provided
    if (address) {
      await db.query(
        "INSERT INTO addresses (user_id, type, street, city, is_default) VALUES (?, 'Home', ?, ?, 1)",
        [result.insertId, address, city || null]
      );
    }

    const token = jwt.sign(
      { id: result.insertId, email, name, role: "user" },
      process.env.JWT_SECRET || "swiggy_secret",
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: result.insertId, name, email, phone: phone || null, dob: dob || null, city: city || null, role: "user" } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || "swiggy_secret",
      { expiresIn: "7d" }
    );
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 👤 USER / PROFILE ROUTES
// ============================================================

// Get my profile
app.get("/api/user/profile", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, dob, city, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile
app.put("/api/user/profile", auth, async (req, res) => {
  const { name, phone, dob, city } = req.body;
  try {
    await db.query(
      "UPDATE users SET name = ?, phone = ?, dob = ?, city = ? WHERE id = ?",
      [name, phone || null, dob || null, city || null, req.user.id]
    );
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change password
app.put("/api/user/password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [req.user.id]);
    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) return res.status(400).json({ error: "Wrong current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, req.user.id]);
    res.json({ message: "Password changed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 📍 ADDRESS ROUTES
// ============================================================

// Get my addresses
app.get("/api/user/addresses", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add address
app.post("/api/user/addresses", auth, async (req, res) => {
  const { type, street, city, pincode, is_default } = req.body;
  try {
    if (is_default) {
      await db.query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [req.user.id]);
    }
    const [result] = await db.query(
      "INSERT INTO addresses (user_id, type, street, city, pincode, is_default) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.id, type || "Home", street, city, pincode, is_default ? 1 : 0]
    );
    res.json({ id: result.insertId, message: "Address saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update address
app.put("/api/user/addresses/:id", auth, async (req, res) => {
  const { type, street, city, pincode, is_default } = req.body;
  try {
    if (is_default) {
      await db.query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [req.user.id]);
    }
    await db.query(
      "UPDATE addresses SET type=?, street=?, city=?, pincode=?, is_default=? WHERE id=? AND user_id=?",
      [type, street, city, pincode, is_default ? 1 : 0, req.params.id, req.user.id]
    );
    res.json({ message: "Address updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete address
app.delete("/api/user/addresses/:id", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 🛒 CART ROUTES
// ============================================================

// Get cart
app.get("/api/cart", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cart WHERE user_id = ?", [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save full cart (replace)
app.post("/api/cart/save", auth, async (req, res) => {
  const { items } = req.body; // array of cart items
  try {
    await db.query("DELETE FROM cart WHERE user_id = ?", [req.user.id]);
    if (items?.length) {
      const values = items.map(i => [
        req.user.id, i.id, i.name, i.price, i.qty,
        i.restaurantName || "", i.colorKey || "biryani", i.veg ? 1 : 0
      ]);
      await db.query(
        "INSERT INTO cart (user_id, item_id, item_name, price, quantity, restaurant_name, color_key, is_veg) VALUES ?",
        [values]
      );
    }
    res.json({ message: "Cart saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear cart
app.delete("/api/cart", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM cart WHERE user_id = ?", [req.user.id]);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 📦 ORDER ROUTES
// ============================================================

// Place order
app.post("/api/orders", auth, async (req, res) => {
  const { items, total_amount, delivery_fee, tax_amount, discount_amount, promo_code, restaurant_name, delivery_address, payment_method } = req.body;
  try {
    // Generate order number
    const [countRow] = await db.query("SELECT COUNT(*) as cnt FROM orders");
    const orderNum = "ORD" + String(countRow[0].cnt + 1).padStart(3, "0");

    const [result] = await db.query(
      `INSERT INTO orders 
        (order_number, user_id, restaurant_name, total_amount, delivery_fee, tax_amount, discount_amount, promo_code, delivery_address, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNum, req.user.id, restaurant_name, total_amount, delivery_fee || 40, tax_amount || 0, discount_amount || 0, promo_code || null, delivery_address || null, payment_method || "COD"]
    );

    const orderId = result.insertId;

    // Insert order items
    if (items?.length) {
      const itemValues = items.map(i => [orderId, i.id, i.name, i.price, i.qty, i.veg ? 1 : 0]);
      await db.query(
        "INSERT INTO order_items (order_id, item_id, item_name, price, quantity, is_veg) VALUES ?",
        [itemValues]
      );
    }

    // Clear cart after order
    await db.query("DELETE FROM cart WHERE user_id = ?", [req.user.id]);

    res.json({ message: "Order placed!", order_id: orderId, order_number: orderNum });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my orders
app.get("/api/orders", auth, async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    // Get items for each order
    for (let order of orders) {
      const [items] = await db.query(
        "SELECT * FROM order_items WHERE order_id = ?",
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single order
app.get("/api/orders/:id", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Order not found" });
    const [items] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [req.params.id]);
    res.json({ ...rows[0], items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 🛠️ ADMIN ROUTES
// ============================================================

// Get all users
app.get("/api/admin/users", auth, adminAuth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, phone, city, role, created_at FROM users ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (admin)
app.get("/api/admin/orders", auth, adminAuth, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    for (let order of orders) {
      const [items] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
      order.items = items;
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (admin)
app.put("/api/admin/orders/:id/status", auth, adminAuth, async (req, res) => {
  const { status } = req.body;
  try {
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats (admin)
app.get("/api/admin/stats", auth, adminAuth, async (req, res) => {
  try {
    const [[{ total_orders }]]   = await db.query("SELECT COUNT(*) as total_orders FROM orders");
    const [[{ total_users }]]    = await db.query("SELECT COUNT(*) as total_users FROM users");
    const [[{ total_revenue }]]  = await db.query("SELECT IFNULL(SUM(total_amount),0) as total_revenue FROM orders WHERE status != 'Cancelled'");
    const [[{ total_restaurants }]] = await db.query("SELECT COUNT(*) as total_restaurants FROM restaurants");
    res.json({ total_orders, total_users, total_revenue, total_restaurants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ──────────────────────────────────────────
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
