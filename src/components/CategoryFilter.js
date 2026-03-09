import { categories } from "../restaurants";

export default function CategoryFilter({ activeCategory, setActiveCategory }) {
  return (
    <div style={{ padding: "28px 0 16px" }}>
      <h2 style={{
        fontSize: 22, fontWeight: 800, color: "#3d4152",
        marginBottom: 20, letterSpacing: "-0.3px"
      }}>
        What's on your mind?
      </h2>
      <div style={{
        display: "flex", gap: 12, overflowX: "auto",
        paddingBottom: 8,
        scrollbarWidth: "none"
      }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 8,
              padding: "14px 20px", borderRadius: 16,
              border: activeCategory === cat.id
                ? "2px solid #FC8019"
                : "2px solid transparent",
              background: activeCategory === cat.id
                ? "#fff3e8"
                : "white",
              cursor: "pointer", transition: "all 0.2s",
              minWidth: 90, flexShrink: 0,
              boxShadow: activeCategory === cat.id
                ? "0 4px 16px rgba(252,128,25,0.2)"
                : "0 2px 8px rgba(0,0,0,0.06)",
              transform: activeCategory === cat.id ? "scale(1.05)" : "scale(1)"
            }}
            onMouseEnter={e => {
              if (activeCategory !== cat.id) {
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
                e.currentTarget.style.transform = "scale(1.03)";
              }
            }}
            onMouseLeave={e => {
              if (activeCategory !== cat.id) {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <span style={{ fontSize: 32 }}>{cat.icon}</span>
            <span style={{
              fontSize: 12, fontWeight: 700,
              color: activeCategory === cat.id ? "#FC8019" : "#3d4152",
              whiteSpace: "nowrap"
            }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
    