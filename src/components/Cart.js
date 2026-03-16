import { useState } from "react";

export default function Cart({ isOpen, onClose, items, onAdd, onRemove, onClear, total, user, onPlaceOrder, loading: apiLoading }) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");

  const deliveryFee = total > 299 ? 0 : 40;
  const taxes = Math.round(total * 0.05);
  const grandTotal = total + deliveryFee + taxes - discount;

  const applyPromo = () => {
    const codes = { SAVE50: 50, FIRST100: 100, SWIGGY20: Math.round(total * 0.2) };
    if (codes[promoCode.toUpperCase()]) {
      setDiscount(codes[promoCode.toUpperCase()]);
      setPromoMsg(`✅ ₹${codes[promoCode.toUpperCase()]} discount applied!`);
    } else {
      setPromoMsg("❌ Invalid promo code");
      setDiscount(0);
    }
  };

  const placeOrder = async () => {
    if (!user) {
      alert("Please sign in to place an order!");
      return;
    }
    try {
      if (onPlaceOrder) {
        await onPlaceOrder({
          total: grandTotal,
          deliveryFee,
          tax: taxes,
          discount,
          promoCode: discount > 0 ? promoCode : null,
        });
      }
      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        onClose();
      }, 4000);
    } catch (e) {
      alert("Order failed: " + e.message);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            backdropFilter: "blur(4px)"
          }}
        />
      )}

      {/* Cart Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0,
        width: 400, height: "100vh",
        background: "white",
        boxShadow: "-4px 0 40px rgba(0,0,0,0.15)",
        zIndex: 1001,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", flexDirection: "column"
      }}>

        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "linear-gradient(135deg, #FC8019, #ff5722)"
        }}>
          <div>
            <h2 style={{ color: "white", margin: 0, fontSize: 20, fontWeight: 800 }}>
              🛒 Your Cart
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, fontSize: 12 }}>
              {items.length > 0 ? `${items.reduce((s, i) => s + i.qty, 0)} items` : "Add items to get started"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)", border: "none",
              color: "white", width: 36, height: 36, borderRadius: "50%",
              cursor: "pointer", fontSize: 18, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >✕</button>
        </div>

        {/* Order Success */}
        {orderPlaced && (
          <div style={{
            position: "absolute", inset: 0, background: "white",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            zIndex: 10, gap: 16
          }}>
            <div style={{ fontSize: 80, animation: "bounce 1s infinite" }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#3d4152" }}>Order Placed!</h2>
            <p style={{ color: "#888", textAlign: "center", maxWidth: 260 }}>
              Your food is being prepared. Estimated delivery: 30-45 mins
            </p>
            <div style={{
              background: "#e8f5e9", color: "#4CAF50",
              padding: "12px 24px", borderRadius: 12,
              fontWeight: 700, fontSize: 14
            }}>
              ✅ Order Confirmed • ₹{grandTotal}
            </div>
            <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>
          </div>
        )}

        {/* Empty Cart */}
        {items.length === 0 && !orderPlaced && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: 32, gap: 12
          }}>
            <div style={{ fontSize: 80 }}>🛒</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#3d4152" }}>Your cart is empty</h3>
            <p style={{ color: "#888", textAlign: "center", fontSize: 14 }}>
              Add items from a restaurant to get started
            </p>
            <button onClick={onClose} style={{
              background: "#FC8019", color: "white",
              border: "none", padding: "12px 28px", borderRadius: 10,
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              fontFamily: "inherit"
            }}>
              Browse Restaurants
            </button>
          </div>
        )}

        {/* Cart Items */}
        {items.length > 0 && !orderPlaced && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {/* Restaurant name */}
              {items[0]?.restaurantName && (
                <div style={{
                  background: "#fff3e8", borderRadius: 10, padding: "8px 14px",
                  marginBottom: 14, fontSize: 12, fontWeight: 700, color: "#FC8019"
                }}>
                  🍽️ {items[0].restaurantName}
                </div>
              )}

              {items.map(item => (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 0",
                  borderBottom: "1px solid #f5f5f5"
                }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: 2,
                    border: `2px solid ${item.veg ? "#4CAF50" : "#f44336"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: item.veg ? "#4CAF50" : "#f44336"
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#3d4152" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>₹{item.price} each</div>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center",
                    background: "#FC8019", borderRadius: 8, overflow: "hidden"
                  }}>
                    <button onClick={() => onRemove(item.id)} style={{
                      background: "none", border: "none", color: "white",
                      padding: "4px 10px", cursor: "pointer", fontWeight: 800, fontSize: 16
                    }}>−</button>
                    <span style={{
                      color: "white", fontWeight: 800, fontSize: 13,
                      padding: "4px 6px", minWidth: 22, textAlign: "center"
                    }}>{item.qty}</span>
                    <button onClick={() => onAdd(item, { name: item.restaurantName })} style={{
                      background: "none", border: "none", color: "white",
                      padding: "4px 10px", cursor: "pointer", fontWeight: 800, fontSize: 16
                    }}>+</button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#3d4152", minWidth: 50, textAlign: "right" }}>
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}

              {/* Promo Code */}
              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <div style={{
                  display: "flex", gap: 8, marginBottom: 6
                }}>
                  <input
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="Enter promo code (SAVE50)"
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 10,
                      border: "2px solid #f0f0f0", outline: "none",
                      fontSize: 13, fontFamily: "inherit"
                    }}
                    onFocus={e => e.target.style.border = "2px solid #FC8019"}
                    onBlur={e => e.target.style.border = "2px solid #f0f0f0"}
                  />
                  <button onClick={applyPromo} style={{
                    background: "#FC8019", color: "white",
                    border: "none", borderRadius: 10, padding: "10px 16px",
                    fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    fontSize: 12
                  }}>Apply</button>
                </div>
                {promoMsg && (
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    color: promoMsg.startsWith("✅") ? "#4CAF50" : "#f44336"
                  }}>{promoMsg}</div>
                )}
              </div>

              {/* Bill Summary */}
              <div style={{
                background: "#fafafa", borderRadius: 14, padding: "16px",
                marginTop: 12
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, color: "#3d4152" }}>
                  Bill Details
                </h4>
                {[
                  { label: "Item Total", val: `₹${total}` },
                  { label: "Delivery Fee", val: deliveryFee === 0 ? "FREE 🎉" : `₹${deliveryFee}` },
                  { label: "GST & Charges", val: `₹${taxes}` },
                  ...(discount > 0 ? [{ label: "Promo Discount", val: `-₹${discount}`, green: true }] : []),
                ].map(row => (
                  <div key={row.label} style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: 13, marginBottom: 8, color: row.green ? "#4CAF50" : "#666"
                  }}>
                    <span>{row.label}</span>
                    <span style={{ fontWeight: row.green ? 700 : 500 }}>{row.val}</span>
                  </div>
                ))}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 15, fontWeight: 800, color: "#3d4152",
                  paddingTop: 10, borderTop: "1px dashed #ddd", marginTop: 4
                }}>
                  <span>To Pay</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0f0" }}>
              {!user && (
                <div style={{ background: "#fff3e8", border: "1px solid #FC8019", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#FC8019", fontWeight: 600, textAlign: "center" }}>
                  ⚠️ Please Sign In to place order
                </div>
              )}
              <button
                onClick={placeOrder}
                disabled={apiLoading}
                style={{
                  width: "100%", padding: "16px",
                  background: apiLoading ? "#ccc" : "linear-gradient(135deg, #FC8019, #ff5722)",
                  color: "white", border: "none", borderRadius: 14,
                  fontWeight: 800, fontSize: 16, cursor: apiLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 20px rgba(252,128,25,0.4)",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={e => { if(!apiLoading) e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {apiLoading ? "Placing Order..." : `Place Order • ₹${grandTotal}`}
              </button>
              <p style={{
                textAlign: "center", fontSize: 11, color: "#aaa",
                marginTop: 8
              }}>
                🔒 Secure payment • Free cancellation before prep starts
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
