export default function Footer() {
  return (
    <footer style={{
      background: "#3d4152", color: "white",
      padding: "48px 20px 24px", marginTop: 40
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40, marginBottom: 40
        }}>
          {/* Brand */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 16
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "linear-gradient(135deg, #FC8019, #ff5722)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22
              }}>🍜</div>
              <span style={{ fontSize: 26, fontWeight: 800, color: "#FC8019" }}>swiggy</span>
            </div>
            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>
              Delivering happiness to your doorstep. Order food from the best restaurants near you.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              {["📘", "🐦", "📸", "▶️"].map((icon, i) => (
                <div key={i} style={{
                  width: 36, height: 36, background: "rgba(255,255,255,0.1)",
                  borderRadius: 8, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 18, cursor: "pointer",
                  transition: "background 0.2s"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FC8019"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Press", "Investors"]
            },
            {
              title: "For Restaurants",
              links: ["Partner with us", "Apps for you", "Business Type", "Register"]
            },
            {
              title: "Learn More",
              links: ["Privacy", "Security", "Terms", "Sitemap", "Help Center"]
            }
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ marginBottom: 16, fontWeight: 700, fontSize: 14, color: "#ddd" }}>
                {col.title}
              </h4>
              {col.links.map(link => (
                <div key={link} style={{
                  color: "#aaa", fontSize: 13, marginBottom: 10,
                  cursor: "pointer", transition: "color 0.2s"
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#FC8019"}
                  onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
                >
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12
        }}>
          <p style={{ color: "#888", fontSize: 12 }}>
            © 2025 Swiggy Clone. Made with ❤️ in React JS
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(item => (
              <span key={item} style={{
                color: "#888", fontSize: 12, cursor: "pointer",
                transition: "color 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#FC8019"}
                onMouseLeave={e => e.currentTarget.style.color = "#888"}
              >{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
