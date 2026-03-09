import { useState } from "react";

export default function MenuItem({ item, cartQty, onAdd, onRemove }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white", borderRadius: 16,
        padding: "16px 20px",
        display: "flex", gap: 16, alignItems: "center",
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.05)",
        transition: "all 0.2s",
        border: cartQty > 0 ? "2px solid #FC8019" : "2px solid transparent"
      }}
    >
      {/* Item Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 14, height: 14, borderRadius: 3,
            border: `2px solid ${item.veg ? "#4CAF50" : "#f44336"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: item.veg ? "#4CAF50" : "#f44336"
            }} />
          </div>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#3d4152", margin: 0 }}>
            {item.name}
          </h4>
          {item.rating && (
            <span style={{
              background: "#f5f5f5", color: "#666",
              padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600
            }}>
              ⭐ {item.rating}
            </span>
          )}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#3d4152", marginBottom: 4 }}>
          ₹{item.price}
        </div>
        <p style={{ fontSize: 12, color: "#93959f", lineHeight: 1.5, margin: 0 }}>
          {item.desc}
        </p>
      </div>

      {/* Item Image + Add Button */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: 110, height: 82, objectFit: "cover",
            borderRadius: 12,
            transition: "transform 0.3s",
            transform: hovered ? "scale(1.05)" : "scale(1)"
          }}
          onError={e => {
            e.target.style.display = "none";
          }}
        />
        <div style={{
          position: "absolute", bottom: -12, left: "50%",
          transform: "translateX(-50%)"
        }}>
          {cartQty === 0 ? (
            <button
              onClick={onAdd}
              style={{
                background: "white", color: "#FC8019",
                border: "2px solid #FC8019", padding: "5px 20px",
                borderRadius: 8, fontWeight: 800, fontSize: 13,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 2px 8px rgba(252,128,25,0.3)",
                transition: "all 0.2s", whiteSpace: "nowrap"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#FC8019";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "#FC8019";
              }}
            >
              + ADD
            </button>
          ) : (
            <div style={{
              display: "flex", alignItems: "center",
              background: "#FC8019", borderRadius: 8,
              overflow: "hidden", boxShadow: "0 2px 8px rgba(252,128,25,0.4)"
            }}>
              <button
                onClick={onRemove}
                style={{
                  background: "none", border: "none",
                  color: "white", fontSize: 18, fontWeight: 800,
                  cursor: "pointer", padding: "4px 12px",
                  fontFamily: "inherit", lineHeight: 1
                }}
              >
                −
              </button>
              <span style={{
                color: "white", fontWeight: 800, fontSize: 14,
                padding: "4px 6px", minWidth: 24, textAlign: "center"
              }}>
                {cartQty}
              </span>
              <button
                onClick={onAdd}
                style={{
                  background: "none", border: "none",
                  color: "white", fontSize: 18, fontWeight: 800,
                  cursor: "pointer", padding: "4px 12px",
                  fontFamily: "inherit", lineHeight: 1
                }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
