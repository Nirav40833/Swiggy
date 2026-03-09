import RestaurantCard from "./RestaurantCard";

export default function RestaurantGrid({ restaurants, onSelect }) {
  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 20
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#3d4152", letterSpacing: "-0.3px" }}>
          Restaurants Near You
          <span style={{
            fontSize: 14, fontWeight: 500, color: "#888",
            marginLeft: 10
          }}>
            ({restaurants.length} places)
          </span>
        </h2>
        <div style={{ display: "flex", gap: 10 }}>
          {["Rating", "Delivery Time", "Price"].map(filter => (
            <button key={filter} style={{
              padding: "8px 16px", borderRadius: 20,
              border: "1px solid #ddd", background: "white",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              color: "#3d4152", transition: "all 0.2s",
              fontFamily: "inherit"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.border = "1px solid #FC8019";
                e.currentTarget.style.color = "#FC8019";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = "1px solid #ddd";
                e.currentTarget.style.color = "#3d4152";
              }}
            >
              {filter} ↓
            </button>
          ))}
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: "white", borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No restaurants found</h3>
          <p style={{ color: "#888", fontSize: 14 }}>Try a different search or category</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20
        }}>
          {restaurants.map((r, i) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onClick={() => onSelect(r)}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
