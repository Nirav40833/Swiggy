import { useState } from "react";

const STATUS_COLORS = {
  Confirmed: "#2196F3",
  Preparing: "#FF9800",
  "Out for Delivery": "#9C27B0",
  Delivered: "#4CAF50",
  Cancelled: "#f44336"
};

// ── Toggle Switch Row ─────────────────────────────────────
function ToggleRow({ icon, title, sub, defaultVal }) {
  const [on, setOn] = useState(defaultVal);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "#fafafa", borderRadius: 12, marginBottom: 9, border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#3d4152" }}>{title}</div>
          <div style={{ fontSize: 11, color: "#888" }}>{sub}</div>
        </div>
      </div>
      <div onClick={() => setOn(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? "#FC8019" : "#ddd", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", transition: "left 0.3s" }} />
      </div>
    </div>
  );
}

// ── Profile Modal ─────────────────────────────────────────
export default function ProfileModal({ user, onClose, onUpdate, orders = [], defaultTab = "profile" }) {
  const [tab, setTab] = useState(defaultTab);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:    user.name    || "",
    email:   user.email   || "",
    phone:   user.phone   || "",
    dob:     user.dob     || "",
    city:    user.city    || "",
    address: user.address || "",
    pincode: user.pincode || "",
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const saveProfile = () => {
    onUpdate?.({ ...user, ...form });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalSpent  = orders.reduce((s, o) => s + o.total, 0);
  const delivered   = orders.filter(o => o.status === "Delivered").length;

  const tabs = [
    ["👤", "Profile",   "profile"],
    ["📦", "Orders",    "orders"],
    ["📍", "Addresses", "address"],
    ["⚙️", "Settings",  "settings"],
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(5px)" }}>
      <div style={{ background: "white", borderRadius: 22, width: "min(700px, 95vw)", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 70px rgba(0,0,0,0.22)", overflow: "hidden" }}>

        {/* ── Header Banner ── */}

        <div style={{ background: "linear-gradient(135deg,#FC8019,#ff5722)", padding: "20px 24px 52px", position: "relative", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 style={{ color: "white", fontWeight: 800, fontSize: 18, margin: 0 }}>My Profile</h2>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        {/* ── Avatar ── */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, padding: "0 24px", marginTop: -10, flexShrink: 0, zIndex: 2, position: "relative" }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg,#5B4CDB,#7C3AED)", border: "4px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 30, fontWeight: 800, boxShadow: "0 4px 20px rgba(91,76,219,0.4)", flexShrink: 0 }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ paddingBottom: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#3d4152" }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{user.email}</div>
            {user.role === "admin" && <span style={{ background: "#7C3AED", color: "white", padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>⚡ Admin</span>}
          </div>
          {saved && <div style={{ marginLeft: "auto", background: "#e8f5e9", color: "#4CAF50", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>✅ Saved!</div>}
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", margin: "12px 24px 0", background: "#fafafa", borderRadius: 14, overflow: "hidden", border: "1px solid #f0f0f0", flexShrink: 0 }}>
          {[["📦", orders.length, "Orders"], ["💰", "₹" + totalSpent, "Spent"], ["⭐", delivered, "Delivered"], ["❤️", "0", "Saved"]].map(([ic, v, lb], i, a) => (
            <div key={lb} style={{ padding: "13px 0", textAlign: "center", borderRight: i < a.length - 1 ? "1px solid #f0f0f0" : "none" }}>
              <div style={{ fontSize: 18 }}>{ic}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#3d4152" }}>{v}</div>
              <div style={{ fontSize: 10, color: "#888" }}>{lb}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 4, padding: "14px 24px 0", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
          {tabs.map(([ic, lb, id]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding: "9px 16px", borderRadius: "10px 10px 0 0", border: "none", background: tab === id ? "white" : "transparent", color: tab === id ? "#FC8019" : "#888", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit", borderBottom: tab === id ? "3px solid #FC8019" : "3px solid transparent", display: "flex", alignItems: "center", gap: 6 }}>
              {ic} {lb}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px", minHeight: 0 }}>

          {/* PROFILE */}
          {tab === "profile" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800 }}>Personal Information</h3>
                <button onClick={() => setEditing(!editing)} style={{ background: editing ? "#ffebee" : "#fff3e8", color: editing ? "#f44336" : "#FC8019", border: "none", borderRadius: 9, padding: "7px 16px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                  {editing ? "✕ Cancel" : "✏️ Edit"}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[["👤", "Full Name", "name", "text"], ["📧", "Email", "email", "email"], ["📱", "Phone", "phone", "tel"], ["🎂", "Date of Birth", "dob", "date"]].map(([ic, label, key, type]) => (
                  <div key={key}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 5 }}>{ic} {label}</div>
                    {editing ? (
                      <input value={form[key]} onChange={e => set(key, e.target.value)} type={type}
                        style={{ width: "100%", padding: "10px 13px", borderRadius: 10, border: "2px solid #FC8019", outline: "none", fontSize: 13, fontFamily: "inherit" }} />
                    ) : (
                      <div style={{ padding: "10px 13px", background: "#fafafa", borderRadius: 10, fontSize: 13, fontWeight: 600, color: form[key] ? "#3d4152" : "#ccc" }}>
                        {form[key] || "Not set"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 5 }}>🏙️ City</div>
                {editing ? (
                  <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Your city"
                    style={{ width: "100%", padding: "10px 13px", borderRadius: 10, border: "2px solid #FC8019", outline: "none", fontSize: 13, fontFamily: "inherit" }} />
                ) : (
                  <div style={{ padding: "10px 13px", background: "#fafafa", borderRadius: 10, fontSize: 13, fontWeight: 600, color: form.city ? "#3d4152" : "#ccc" }}>{form.city || "Not set"}</div>
                )}
              </div>
              {editing && (
                <button onClick={saveProfile} style={{ width: "100%", marginTop: 16, padding: 13, background: "linear-gradient(135deg,#FC8019,#ff5722)", color: "white", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  💾 Save Changes
                </button>
              )}
              {/* Account Info */}
              <div style={{ marginTop: 22, padding: 16, background: "#fafafa", borderRadius: 14, border: "1px solid #f0f0f0" }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>Account Details</div>
                {[["🆔", "User ID", user.id], ["📅", "Member Since", user.joined || "2024"], ["🔐", "Role", user.role === "admin" ? "Admin ⚡" : "Customer"], ["✅", "Status", "Active"]].map(([ic, lb, val]) => (
                  <div key={lb} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f0f0f0", fontSize: 12 }}>
                    <span style={{ color: "#888" }}>{ic} {lb}</span>
                    <span style={{ fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Order History ({orders.length})</h3>
              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: 56 }}>📦</div>
                  <p style={{ color: "#888", marginTop: 12 }}>No orders yet. Start exploring!</p>
                </div>
              ) : orders.map(order => (
                <div key={order.id} style={{ background: "#fafafa", borderRadius: 14, padding: "14px 16px", marginBottom: 12, border: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{order.id}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>🍽️ {order.restaurant} • {order.date}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <div style={{ background: (STATUS_COLORS[order.status] || "#888") + "22", color: STATUS_COLORS[order.status] || "#888", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{order.status}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#FC8019" }}>₹{order.total}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#555" }}>
                    {order.items?.map(i => (
                      <span key={i.name} style={{ display: "inline-block", background: "white", border: "1px solid #f0f0f0", borderRadius: 6, padding: "2px 9px", margin: "2px 3px 2px 0" }}>{i.name} ×{i.qty}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADDRESSES */}
          {tab === "address" && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Saved Addresses</h3>
              {[{ type: "🏠 Home", addr: form.address, city: form.city, pincode: form.pincode }, { type: "🏢 Work", addr: "", city: "", pincode: "" }].map((a, i) => (
                <div key={i} style={{ background: "#fafafa", borderRadius: 14, padding: "15px 18px", marginBottom: 12, border: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: "#fff3e8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{a.type.split(" ")[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{a.type.split(" ").slice(1).join(" ")}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{a.addr || "Not set"}{a.city ? `, ${a.city}` : ""}{a.pincode ? ` - ${a.pincode}` : ""}</div>
                    </div>
                  </div>
                  <button onClick={() => { setTab("profile"); setEditing(true); }} style={{ background: "#fff3e8", color: "#FC8019", border: "none", borderRadius: 8, padding: "6px 13px", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>Edit</button>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 10 }}>Update Home Address</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["address", "Street Address"], ["city", "City"], ["pincode", "Pincode"]].map(([k, ph]) => (
                    <input key={k} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph}
                      style={{ padding: "10px 13px", borderRadius: 10, border: "2px solid #f0f0f0", outline: "none", fontSize: 12, fontFamily: "inherit" }}
                      onFocus={e => e.target.style.borderColor = "#FC8019"} onBlur={e => e.target.style.borderColor = "#f0f0f0"} />
                  ))}
                </div>
                <button onClick={saveProfile} style={{ marginTop: 12, padding: "10px 22px", background: "#FC8019", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Save Address</button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Account Settings</h3>
              {[
                { icon: "🔔", title: "Order Notifications", sub: "Get updates on your order status", val: true },
                { icon: "📧", title: "Email Promotions",    sub: "Receive deals and offers via email", val: false },
                { icon: "📱", title: "SMS Alerts",          sub: "Order tracking via SMS", val: true },
                { icon: "🌙", title: "Dark Mode",           sub: "Switch to dark theme", val: false },
              ].map(item => (
                <ToggleRow key={item.title} icon={item.icon} title={item.title} sub={item.sub} defaultVal={item.val} />
              ))}
              <div style={{ marginTop: 20, padding: 18, background: "#fff3e8", borderRadius: 14, border: "1px dashed #FC8019" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#FC8019", marginBottom: 10 }}>🔐 Change Password</div>
                {["Current Password", "New Password", "Confirm New Password"].map(ph => (
                  <input key={ph} type="password" placeholder={ph}
                    style={{ width: "100%", padding: "10px 13px", borderRadius: 10, border: "2px solid #f0f0f0", outline: "none", fontSize: 12, fontFamily: "inherit", marginBottom: 8 }}
                    onFocus={e => e.target.style.borderColor = "#FC8019"} onBlur={e => e.target.style.borderColor = "#f0f0f0"} />
                ))}
                <button style={{ padding: "10px 22px", background: "#FC8019", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Update Password</button>
              </div>
              <button style={{ width: "100%", marginTop: 14, padding: 12, background: "#ffebee", color: "#f44336", border: "1px solid #ffcdd2", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                🗑️ Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}