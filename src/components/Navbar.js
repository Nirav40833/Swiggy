import { useState, useEffect, useRef } from "react";

export default function Navbar({ cartCount, cartTotal, onCartClick, onHomeClick, address, setAddress, searchQuery, setSearchQuery, user, onLogin, onLogout, onProfileClick, onOrdersClick }) {
  const [editingAddress, setEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const menuRef = useRef(null);

  // Outside click → close dropdown
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const saveAddress = () => {
    setAddress(tempAddress);
    setEditingAddress(false);
  };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: "white",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: "0 20px",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center",
          height: 72, gap: 24
        }}>
          {/* Logo */}
          <div onClick={onHomeClick} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #FC8019, #ff5722)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: "0 4px 12px rgba(252,128,25,0.4)"
            }}>🍜</div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#FC8019", letterSpacing: "-0.5px" }}>ABC</span>
          </div>

          {/* Location */}
          <div
            onClick={() => setEditingAddress(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "8px 12px", borderRadius: 8, background: "transparent" }}
            onMouseEnter={e => e.currentTarget.style.background = "#fff3e8"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: 18 }}>📍</span>
            <div>
              <div style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>Delivering to</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#3d4152", display: "flex", alignItems: "center", gap: 4 }}>
                {address.split(",")[1] || address}
                <span style={{ color: "#FC8019", fontSize: 12 }}>▼</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: 500 }}>
            <div style={{
              display: "flex", alignItems: "center", background: "#f5f5f5",
              borderRadius: 10, padding: "10px 16px", gap: 10,
              border: "2px solid transparent", transition: "border 0.2s",
            }}
              onFocus={e => e.currentTarget.style.border = "2px solid #FC8019"}
              onBlur={e => e.currentTarget.style.border = "2px solid transparent"}
            >
              <span style={{ fontSize: 18, color: "#888" }}>🔍</span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants and food..."
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#3d4152", fontFamily: "inherit" }}
              />
              {searchQuery && (
                <span onClick={() => setSearchQuery("")} style={{ cursor: "pointer", color: "#888", fontSize: 18 }}>✕</span>
              )}
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <NavLink icon="🏠" label="Home" onClick={onHomeClick} />
            <NavLink icon="🔖" label="Offers" />
            <NavLink icon="❓" label="Help" />

            {/* ========== USER / PROFILE ========== */}
            {user ? (
              <div ref={menuRef} style={{ position: "relative" }}>
                {/* Avatar Button */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#fff3e8", border: "none", borderRadius: 10,
                    padding: "8px 14px", cursor: "pointer", fontFamily: "inherit",
                    fontWeight: 700, fontSize: 13, color: "#FC8019",
                    transition: "all 0.2s"
                  }}
                >
                  {/* Avatar Circle */}
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "linear-gradient(135deg, #FC8019, #ff5722)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontSize: 14, fontWeight: 800, flexShrink: 0
                  }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <span>{user.name.split(" ")[0]}</span>
                  <span style={{ fontSize: 10 }}>▾</span>
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div style={{
                    position: "absolute", top: 48, right: 0,
                    background: "white", borderRadius: 16,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                    minWidth: 220, zIndex: 2000,
                    border: "1px solid #f0f0f0",
                    overflow: "hidden",
                    animation: "fadeDown 0.2s ease"
                  }}>
                    {/* User Info Header */}
                    <div style={{
                      padding: "14px 18px",
                      background: "linear-gradient(135deg, #fff3e8, #ffe8d6)",
                      borderBottom: "1px solid #f0e0cc"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: "50%",
                          background: "linear-gradient(135deg, #FC8019, #ff5722)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: 18, fontWeight: 800
                        }}>
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: "#3d4152" }}>{user.name}</div>
                          <div style={{ fontSize: 11, color: "#888" }}>{user.email || user.phone || ""}</div>
                          {user.role === "admin" && (
                            <span style={{ background: "#7C3AED", color: "white", padding: "1px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>⚡ Admin</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    {[
                      { icon: "👤", label: "My Profile",    fn: () => { onProfileClick?.(); setShowMenu(false); }, color: "#3d4152" },
                      { icon: "📋", label: "My Orders",     fn: () => { onOrdersClick?.(); setShowMenu(false); },  color: "#3d4152" },
                      { icon: "📍", label: "My Addresses",  fn: () => { onProfileClick?.(); setShowMenu(false); }, color: "#3d4152" },
                      { icon: "❤️", label: "Favourites",    fn: () => { setShowMenu(false); },                    color: "#3d4152" },
                      ...(user.role === "admin" ? [{ icon: "🛠️", label: "Admin Panel", fn: () => setShowMenu(false), color: "#7C3AED" }] : []),
                      { icon: "🚪", label: "Sign Out",      fn: () => { onLogout?.(); setShowMenu(false); },       color: "#f44336" },
                    ].map(({ icon, label, fn, color }) => (
                      <button
                        key={label}
                        onClick={fn}
                        style={{
                          width: "100%", padding: "11px 18px", background: "none",
                          border: "none", cursor: "pointer", fontSize: 13,
                          fontWeight: 600, textAlign: "left",
                          display: "flex", alignItems: "center", gap: 12,
                          fontFamily: "inherit", color,
                          borderBottom: label === "Favourites" ? "1px solid #f5f5f5" : "none",
                          transition: "background 0.15s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f9f9f9"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{icon}</span>
                        {label}
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "#ccc" }}>›</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Sign In Button */
              <button
                onClick={() => setShowAuth(true)}
                style={{
                  background: "none", border: "2px solid #FC8019",
                  color: "#FC8019", borderRadius: 10, padding: "8px 18px",
                  cursor: "pointer", fontWeight: 700, fontSize: 14,
                  fontFamily: "inherit", transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FC8019"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#FC8019"; }}
              >
                Sign In
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: cartCount > 0 ? "linear-gradient(135deg, #FC8019, #ff5722)" : "#f5f5f5",
                color: cartCount > 0 ? "white" : "#3d4152",
                border: "none", borderRadius: 10, padding: "10px 18px",
                cursor: "pointer", fontWeight: 700, fontSize: 14,
                fontFamily: "inherit", transition: "all 0.3s",
                boxShadow: cartCount > 0 ? "0 4px 16px rgba(252,128,25,0.4)" : "none"
              }}
            >
              <span style={{ fontSize: 18 }}>🛒</span>
              {cartCount > 0 ? (
                <>
                  <span>{cartCount} item{cartCount > 1 ? "s" : ""}</span>
                  <span>•</span>
                  <span>₹{(cartTotal + 40).toFixed(0)}</span>
                </>
              ) : (
                <span>Cart</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Address Modal */}
      {editingAddress && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700 }}>📍 Delivery Address</h3>
            <input
              value={tempAddress}
              onChange={e => setTempAddress(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #FC8019", outline: "none", fontSize: 14, marginBottom: 16 }}
              placeholder="Enter your delivery address..."
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={saveAddress} style={{ flex: 1, padding: 12, background: "#FC8019", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Save Address</button>
              <button onClick={() => setEditingAddress(false)} style={{ flex: 1, padding: 12, background: "#f5f5f5", color: "#333", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={(u) => { onLogin?.(u); setShowAuth(false); }} />}

      <style>{`@keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </>
  );
}

// ── Simple Auth Modal ──────────────────────────────────────
function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", dob: "", city: "", address: "" });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "2px solid #f0f0f0", outline: "none", fontSize: 13, fontFamily: "inherit", marginBottom: 10, boxSizing: "border-box" };
  const onFocus = e => e.target.style.borderColor = "#FC8019";
  const onBlur  = e => e.target.style.borderColor = "#f0f0f0";

  const submit = async () => {
    setErr("");
    if (!form.email || !form.password) return setErr("❌ Email અને Password જરૂરી છે");
    if (mode === "register" && !form.name) return setErr("❌ Name જરૂરી છે");
    try {
      setLoading(true);
      const { authAPI } = await import("../services/api");
      let result;
      if (mode === "login") {
        result = await authAPI.login(form.email, form.password);
      } else {
        result = await authAPI.register(form.name, form.email, form.password, form.phone, form.dob, form.city, form.address);
        
      }
      authAPI.saveToken(result.token);
      onLogin(result.user);
    } catch (e) {
      setErr("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "28px 32px", width: mode === "register" ? 440 : 380, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 40 }}>🍜</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#3d4152", margin: "6px 0 2px" }}>{mode === "login" ? "Welcome back!" : "Create account"}</h2>
          <p style={{ color: "#888", fontSize: 12, margin: 0 }}>{mode === "login" ? "Sign in to continue" : "Join us today"}</p>
        </div>

        {mode === "register" && (
          <>
            {/* Name */}
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="👤 Full Name"
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />

            {/* Phone + DOB row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 0 }}>
              <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="📱 Phone Number"
                style={{ ...inputStyle, marginBottom: 0 }} onFocus={onFocus} onBlur={onBlur} />
              <div style={{ position: "relative", marginBottom: 10 }}>
                <input value={form.dob} onChange={e => set("dob", e.target.value)} placeholder="🎂 Date of Birth" type="date"
                  style={{ ...inputStyle, marginBottom: 0, color: form.dob ? "#3d4152" : "#aaa" }} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* City */}
            <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="🏙️ City"
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />

            {/* Address */}
            <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="📍 Delivery Address (Street, Area)"
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </>
        )}

        {/* Email */}
        <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="📧 Email" type="email"
          style={inputStyle} onFocus={onFocus} onBlur={onBlur} />

        {/* Password */}
        <input value={form.password} onChange={e => set("password", e.target.value)} placeholder="🔒 Password" type="password"
          style={{ ...inputStyle, marginBottom: 14 }} onFocus={onFocus} onBlur={onBlur}
          onKeyDown={e => e.key === "Enter" && submit()} />

        {err && <div style={{ color: "#f44336", fontSize: 12, marginBottom: 10, fontWeight: 600, padding: "8px 12px", background: "#ffebee", borderRadius: 8 }}>{err}</div>}

        <button onClick={submit} disabled={loading} style={{ width: "100%", padding: 13, background: loading ? "#ccc" : "linear-gradient(135deg,#FC8019,#ff5722)", color: "white", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 14 }}>
          {loading ? "Please wait..." : (mode === "login" ? "Sign In" : "Create Account")}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#888", margin: 0 }}>
          {mode === "login" ? "New here? " : "Already have account? "}
          <span onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }} style={{ color: "#FC8019", fontWeight: 700, cursor: "pointer" }}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </span>
        </p>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>✕</button>
      </div>
    </div>
  );
}

function NavLink({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 5,
        color: "#3d4152", fontSize: 14, fontWeight: 600,
        fontFamily: "inherit", padding: "6px 10px",
        borderRadius: 8, transition: "background 0.2s"
      }}
      onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
      onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
      <span>{icon}</span> {label}
    </button>
  );
}
