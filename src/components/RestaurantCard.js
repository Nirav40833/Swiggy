import { useState } from "react";

export default function RestaurantCard({ restaurant: r, onClick }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s",
        boxShadow: hovered
          ? "0 12px 40px rgba(0,0,0,0.15)"
          : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        animation: "fadeUp 0.4s ease both"
      }}
    >
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={r.image}
          alt={r.name}
          style={{
            width: "100%", height: 180, objectFit: "cover",
            transition: "transform 0.4s",
            transform: hovered ? "scale(1.06)" : "scale(1)"
          }}
          onError={e => {
            e.target.style.display = "none";
            e.target.parentElement.style.background = "#f0f0f0";
          }}
        />

        {/* Discount Badge */}
        {r.discount && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
            padding: "20px 12px 10px",
            color: "white", fontSize: 12, fontWeight: 700,
            letterSpacing: 0.3
          }}>
            🏷️ {r.discount}
          </div>
        )}

        {/* Pro Badge */}
        {r.isPro && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "linear-gradient(135deg, #5B4CDB, #7C3AED)",
            color: "white", padding: "4px 10px",
            borderRadius: 6, fontSize: 11, fontWeight: 700,
            letterSpacing: 0.5
          }}>
            ⚡ PRO
          </div>
        )}

        {/* Veg/Non-veg */}
        <div style={{
          position: "absolute", top: 10, right: 42,
          background: "white", borderRadius: 6,
          padding: "4px 8px", fontSize: 11, fontWeight: 700,
          color: r.isVeg ? "#4CAF50" : "#f44336",
          border: `2px solid ${r.isVeg ? "#4CAF50" : "#f44336"}`
        }}>
          {r.isVeg ? "🟢 VEG" : "🔴 NON-VEG"}
        </div>

        {/* Heart */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(!liked); }}
          style={{
            position: "absolute", top: 10, right: 10,
            background: "white", border: "none",
            borderRadius: "50%", width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "transform 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <h3 style={{
            fontSize: 16, fontWeight: 800, color: "#3d4152",
            margin: 0, letterSpacing: "-0.3px"
          }}>
            {r.name}
          </h3>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            background: r.rating >= 4.5 ? "#48c774" : r.rating >= 4 ? "#FC8019" : "#888",
            color: "white", padding: "4px 8px", borderRadius: 6,
            fontSize: 12, fontWeight: 700, flexShrink: 0
          }}>
            ⭐ {r.rating}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#888", fontWeight: 500, marginBottom: 10 }}>
          {r.cuisine}
        </p>

        <div style={{
          display: "flex", justifyContent: "space-between",
          paddingTop: 10, borderTop: "1px solid #f5f5f5"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#3d4152" }}>🕐 {r.deliveryTime}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Delivery</div>
          </div>
          <div style={{ width: 1, background: "#f0f0f0" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#3d4152" }}>
              {r.deliveryFee === 0 ? "🆓 Free" : `₹${r.deliveryFee}`}
            </div>
            <div style={{ fontSize: 11, color: "#888" }}>Delivery fee</div>
          </div>
          <div style={{ width: 1, background: "#f0f0f0" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#3d4152" }}>₹{r.minOrder}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Min. order</div>
          </div>
        </div>

        {/* Tags */}
        {r.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {r.tags.map(tag => (
              <span key={tag} style={{
                background: "#fff3e8", color: "#FC8019",
                padding: "3px 10px", borderRadius: 20,
                fontSize: 11, fontWeight: 600
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
