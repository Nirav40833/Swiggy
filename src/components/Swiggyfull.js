import { useState, useEffect, useRef } from "react";

// ============================================================
// 🗄️  LOCAL JSON "DATABASE"  (in-memory, same session)
// In production: swap DB.read/write with fetch() to your API
// ============================================================
const DB = (() => {
  const store = {
    users: [
      { id: "u1", name: "Admin User", email: "admin@swiggy.com", password: "admin123", role: "admin", joined: "2024-01-01" },
      { id: "u2", name: "Raj Patel", email: "raj@gmail.com", password: "raj123", role: "user", joined: "2024-03-15" },
    ],
    orders: [
      { id: "ORD001", userId: "u2", items: [{ name: "Chicken Dum Biryani", qty: 2, price: 249 }], total: 578, status: "Delivered", date: "2024-12-01 19:30", restaurant: "Biryani Blues" },
      { id: "ORD002", userId: "u2", items: [{ name: "Margherita Pizza", qty: 1, price: 199 }, { name: "Garlic Bread with Cheese", qty: 1, price: 119 }], total: 388, status: "Delivered", date: "2024-12-10 20:15", restaurant: "Pizza Paradise" },
    ],
    restaurants: [], // filled below from MENU_DATA
    cart: {},        // { userId: [items] }
  };

  return {
    // AUTH
    login: (email, password) => store.users.find(u => u.email === email && u.password === password) || null,
    register: (name, email, password) => {
      if (store.users.find(u => u.email === email)) return { error: "Email already exists" };
      const user = { id: "u" + Date.now(), name, email, password, role: "user", joined: new Date().toISOString().split("T")[0] };
      store.users.push(user);
      return { user };
    },
    // USERS
    getUsers: () => store.users.map(u => ({ ...u, password: "***" })),
    // ORDERS
    getOrders: (userId, role) => role === "admin" ? store.orders : store.orders.filter(o => o.userId === userId),
    placeOrder: (userId, items, total, restaurantName) => {
      const order = {
        id: "ORD" + String(store.orders.length + 1).padStart(3, "0"),
        userId, items, total,
        status: "Confirmed",
        date: new Date().toLocaleString("en-IN"),
        restaurant: restaurantName
      };
      store.orders.unshift(order);
      store.cart[userId] = [];
      return order;
    },
    updateOrderStatus: (orderId, status) => {
      const o = store.orders.find(o => o.id === orderId);
      if (o) o.status = status;
    },
    // CART
    getCart: (userId) => store.cart[userId] || [],
    setCart: (userId, items) => { store.cart[userId] = items; },
    // RESTAURANTS / MENU
    getRestaurants: () => store.restaurants,
    addMenuItem: (restaurantId, item) => {
      const r = store.restaurants.find(r => r.id === restaurantId);
      if (r) { item.id = Date.now(); r.menu.push(item); return item; }
    },
    updateMenuItem: (restaurantId, itemId, updates) => {
      const r = store.restaurants.find(r => r.id === restaurantId);
      if (r) { const i = r.menu.find(i => i.id === itemId); if (i) Object.assign(i, updates); }
    },
    deleteMenuItem: (restaurantId, itemId) => {
      const r = store.restaurants.find(r => r.id === restaurantId);
      if (r) r.menu = r.menu.filter(i => i.id !== itemId);
    },
    addRestaurant: (data) => {
      const r = { ...data, id: Date.now(), menu: [] };
      store.restaurants.push(r);
      return r;
    },
    updateRestaurant: (id, updates) => {
      const r = store.restaurants.find(r => r.id === id);
      if (r) Object.assign(r, updates);
    },
    deleteRestaurant: (id) => { store.restaurants = store.restaurants.filter(r => r.id !== id); },
    getStats: () => ({
      totalOrders: store.orders.length,
      totalUsers: store.users.length,
      totalRevenue: store.orders.reduce((s, o) => s + o.total, 0),
      totalRestaurants: store.restaurants.length,
    }),
  };
})();

// ============================================================
// 🍽️  MENU DATA  (100+ items across 8 restaurants)
// ============================================================
const MENU_DATA = [
  {
    id: 1, name: "Biryani Blues", cuisine: "Biryani, Mughlai", category: "Biryani",
    rating: 4.5, deliveryTime: "30-40 min", deliveryFee: 40, minOrder: 149,
    discount: "50% OFF up to ₹100", isVeg: false, isPro: true, tags: ["Trending", "Fast Delivery"], colorKey: "biryani",
    menu: [
      { id: 101, name: "Chicken Dum Biryani", price: 249, veg: false, rating: 4.6, desc: "Aromatic basmati rice slow-cooked with tender chicken", category: "Biryani", colorKey: "biryani" },
      { id: 102, name: "Mutton Biryani", price: 329, veg: false, rating: 4.7, desc: "Rich mutton cooked in authentic dum style with saffron", category: "Biryani", colorKey: "biryani" },
      { id: 103, name: "Veg Dum Biryani", price: 179, veg: true, rating: 4.3, desc: "Fragrant basmati rice with fresh seasonal vegetables", category: "Biryani", colorKey: "healthy" },
      { id: 104, name: "Egg Biryani", price: 199, veg: false, rating: 4.4, desc: "Fluffy basmati rice layered with spiced boiled eggs", category: "Biryani", colorKey: "biryani" },
      { id: 105, name: "Prawn Biryani", price: 359, veg: false, rating: 4.5, desc: "Juicy prawns in coastal spices with basmati rice", category: "Biryani", colorKey: "biryani" },
      { id: 106, name: "Chicken Tikka", price: 199, veg: false, rating: 4.6, desc: "Tandoor-grilled chicken marinated in yogurt and spices", category: "Starters", colorKey: "biryani" },
      { id: 107, name: "Seekh Kebab (4 pcs)", price: 179, veg: false, rating: 4.5, desc: "Minced lamb skewers grilled in tandoor", category: "Starters", colorKey: "biryani" },
      { id: 108, name: "Paneer Tikka", price: 159, veg: true, rating: 4.4, desc: "Soft paneer cubes marinated and grilled", category: "Starters", colorKey: "healthy" },
      { id: 109, name: "Dal Makhani", price: 149, veg: true, rating: 4.6, desc: "Slow-cooked black lentils in rich buttery tomato gravy", category: "Mains", colorKey: "biryani" },
      { id: 110, name: "Butter Chicken", price: 229, veg: false, rating: 4.7, desc: "Tender chicken in creamy tomato-based butter sauce", category: "Mains", colorKey: "biryani" },
      { id: 111, name: "Shahi Paneer", price: 199, veg: true, rating: 4.5, desc: "Paneer in royal cream and nut-based gravy", category: "Mains", colorKey: "healthy" },
      { id: 112, name: "Butter Naan (2 pcs)", price: 59, veg: true, rating: 4.3, desc: "Soft leavened bread brushed with butter", category: "Breads", colorKey: "biryani" },
      { id: 113, name: "Raita", price: 49, veg: true, rating: 4.2, desc: "Creamy yogurt with cucumber and mint", category: "Sides", colorKey: "healthy" },
    ]
  },
  {
    id: 2, name: "Pizza Paradise", cuisine: "Pizza, Italian", category: "Pizza",
    rating: 4.3, deliveryTime: "25-35 min", deliveryFee: 30, minOrder: 199,
    discount: "Buy 1 Get 1 Free", isVeg: false, isPro: false, tags: ["BOGO", "Best Seller"], colorKey: "pizza",
    menu: [
      { id: 201, name: "Margherita Pizza", price: 199, veg: true, rating: 4.4, desc: "Classic tomato base with fresh mozzarella and basil", category: "Pizza", colorKey: "pizza" },
      { id: 202, name: "Pepperoni Blast", price: 299, veg: false, rating: 4.6, desc: "Crispy pepperoni, jalapeños and extra cheese", category: "Pizza", colorKey: "pizza" },
      { id: 203, name: "BBQ Chicken Pizza", price: 329, veg: false, rating: 4.5, desc: "Smoky BBQ chicken with caramelized onions", category: "Pizza", colorKey: "pizza" },
      { id: 204, name: "Paneer Tikka Pizza", price: 279, veg: true, rating: 4.3, desc: "Indian fusion with tikka-spiced paneer", category: "Pizza", colorKey: "pizza" },
      { id: 205, name: "Double Cheese Pizza", price: 249, veg: true, rating: 4.4, desc: "Two layers of mozzarella and cheddar blend", category: "Pizza", colorKey: "pizza" },
      { id: 206, name: "Veggie Supreme", price: 239, veg: true, rating: 4.2, desc: "Bell peppers, mushrooms, olives and onions", category: "Pizza", colorKey: "healthy" },
      { id: 207, name: "Chicken BBQ Wings (6 pcs)", price: 199, veg: false, rating: 4.5, desc: "Crispy wings tossed in BBQ sauce", category: "Starters", colorKey: "burger" },
      { id: 208, name: "Garlic Bread with Cheese", price: 119, veg: true, rating: 4.4, desc: "Toasted bread with garlic butter and melted cheese", category: "Sides", colorKey: "pasta" },
      { id: 209, name: "Pasta Arrabiata", price: 229, veg: true, rating: 4.3, desc: "Penne in spicy tomato arrabbiata sauce", category: "Pasta", colorKey: "pasta" },
      { id: 210, name: "Chicken Pasta Bake", price: 269, veg: false, rating: 4.5, desc: "Baked penne with chicken in white sauce and cheese", category: "Pasta", colorKey: "pasta" },
      { id: 211, name: "Mojito (Mint)", price: 89, veg: true, rating: 4.4, desc: "Refreshing mint mojito with lime and soda", category: "Drinks", colorKey: "healthy" },
      { id: 212, name: "Cold Coffee", price: 99, veg: true, rating: 4.3, desc: "Chilled coffee with ice cream and chocolate", category: "Drinks", colorKey: "dessert" },
    ]
  },
  {
    id: 3, name: "Burger Factory", cuisine: "Burgers, American", category: "Burger",
    rating: 4.4, deliveryTime: "20-30 min", deliveryFee: 25, minOrder: 99,
    discount: "₹75 OFF above ₹299", isVeg: false, isPro: true, tags: ["Quick Delivery", "Popular"], colorKey: "burger",
    menu: [
      { id: 301, name: "Classic Chicken Burger", price: 149, veg: false, rating: 4.5, desc: "Juicy grilled chicken with fresh lettuce and sauce", category: "Burgers", colorKey: "burger" },
      { id: 302, name: "Double Smash Burger", price: 229, veg: false, rating: 4.7, desc: "Two crispy smashed patties with special house sauce", category: "Burgers", colorKey: "burger" },
      { id: 303, name: "Veggie Crunch Burger", price: 129, veg: true, rating: 4.2, desc: "Crispy veggie patty with coleslaw and spicy mayo", category: "Burgers", colorKey: "healthy" },
      { id: 304, name: "Spicy Zinger Burger", price: 169, veg: false, rating: 4.6, desc: "Fiery crispy chicken with jalapeños and pepper sauce", category: "Burgers", colorKey: "burger" },
      { id: 305, name: "Mushroom Swiss Burger", price: 199, veg: true, rating: 4.4, desc: "Sautéed mushrooms with Swiss cheese on brioche bun", category: "Burgers", colorKey: "healthy" },
      { id: 306, name: "BBQ Bacon Burger", price: 239, veg: false, rating: 4.7, desc: "Crispy bacon, cheddar cheese with smoky BBQ sauce", category: "Burgers", colorKey: "burger" },
      { id: 307, name: "Loaded Cheese Fries", price: 99, veg: true, rating: 4.5, desc: "Golden fries with nacho cheese sauce and jalapeños", category: "Sides", colorKey: "burger" },
      { id: 308, name: "Onion Rings (8 pcs)", price: 79, veg: true, rating: 4.3, desc: "Crispy golden onion rings with dipping sauce", category: "Sides", colorKey: "burger" },
      { id: 309, name: "Chicken Nuggets (6 pcs)", price: 119, veg: false, rating: 4.4, desc: "Crispy bite-sized chicken nuggets", category: "Snacks", colorKey: "burger" },
      { id: 310, name: "Hot Dog Classic", price: 99, veg: false, rating: 4.2, desc: "Sausage in soft bun with mustard and ketchup", category: "Snacks", colorKey: "burger" },
      { id: 311, name: "Chocolate Shake", price: 109, veg: true, rating: 4.5, desc: "Thick creamy chocolate milkshake with whipped cream", category: "Shakes", colorKey: "dessert" },
      { id: 312, name: "Strawberry Shake", price: 109, veg: true, rating: 4.4, desc: "Fresh strawberry blended with ice cream", category: "Shakes", colorKey: "dessert" },
    ]
  },
  {
    id: 4, name: "Dragon House", cuisine: "Chinese, Thai", category: "Chinese",
    rating: 4.2, deliveryTime: "35-45 min", deliveryFee: 35, minOrder: 149,
    discount: "20% OFF above ₹399", isVeg: false, isPro: false, tags: ["New", "Spicy"], colorKey: "chinese",
    menu: [
      { id: 401, name: "Chicken Fried Rice", price: 199, veg: false, rating: 4.3, desc: "Wok-tossed rice with chicken, eggs and vegetables", category: "Rice", colorKey: "chinese" },
      { id: 402, name: "Veg Fried Rice", price: 169, veg: true, rating: 4.2, desc: "Classic fried rice with mixed vegetables", category: "Rice", colorKey: "chinese" },
      { id: 403, name: "Schezwan Fried Rice", price: 189, veg: false, rating: 4.4, desc: "Spicy Schezwan sauce tossed with rice and chicken", category: "Rice", colorKey: "chinese" },
      { id: 404, name: "Kung Pao Chicken", price: 249, veg: false, rating: 4.5, desc: "Spicy stir-fried chicken with peanuts and dried chilies", category: "Mains", colorKey: "chinese" },
      { id: 405, name: "Sweet & Sour Chicken", price: 239, veg: false, rating: 4.3, desc: "Crispy chicken in tangy sweet and sour sauce", category: "Mains", colorKey: "chinese" },
      { id: 406, name: "Veg Manchurian Gravy", price: 179, veg: true, rating: 4.2, desc: "Crispy vegetable balls in spicy Manchurian gravy", category: "Mains", colorKey: "chinese" },
      { id: 407, name: "Chicken Hakka Noodles", price: 199, veg: false, rating: 4.4, desc: "Stir-fried noodles with chicken and vegetables", category: "Noodles", colorKey: "chinese" },
      { id: 408, name: "Veg Hakka Noodles", price: 169, veg: true, rating: 4.1, desc: "Classic hakka noodles with crispy vegetables", category: "Noodles", colorKey: "chinese" },
      { id: 409, name: "Pad Thai Noodles", price: 229, veg: false, rating: 4.5, desc: "Thai rice noodles with shrimp and peanuts", category: "Noodles", colorKey: "chinese" },
      { id: 410, name: "Spring Rolls (6 pcs)", price: 149, veg: true, rating: 4.3, desc: "Crispy golden rolls stuffed with cabbage", category: "Starters", colorKey: "chinese" },
      { id: 411, name: "Chili Chicken Dry", price: 219, veg: false, rating: 4.6, desc: "Crispy chicken tossed with green chilies and onions", category: "Starters", colorKey: "chinese" },
      { id: 412, name: "Tom Yum Soup", price: 149, veg: false, rating: 4.3, desc: "Spicy Thai soup with mushrooms and lemongrass", category: "Soups", colorKey: "chinese" },
    ]
  },
  {
    id: 5, name: "South Spice", cuisine: "South Indian, Dosa", category: "South Indian",
    rating: 4.6, deliveryTime: "30-40 min", deliveryFee: 20, minOrder: 99,
    discount: "Free delivery above ₹199", isVeg: true, isPro: true, tags: ["Pure Veg", "Top Rated"], colorKey: "southindian",
    menu: [
      { id: 501, name: "Masala Dosa", price: 99, veg: true, rating: 4.7, desc: "Crispy dosa filled with spiced potato masala", category: "Dosa", colorKey: "southindian" },
      { id: 502, name: "Plain Dosa", price: 69, veg: true, rating: 4.5, desc: "Thin crispy dosa with sambar and 2 chutneys", category: "Dosa", colorKey: "southindian" },
      { id: 503, name: "Paneer Dosa", price: 129, veg: true, rating: 4.5, desc: "Crispy dosa stuffed with spiced paneer filling", category: "Dosa", colorKey: "southindian" },
      { id: 504, name: "Ghee Roast Dosa", price: 119, veg: true, rating: 4.6, desc: "Crispy dosa roasted in pure ghee", category: "Dosa", colorKey: "southindian" },
      { id: 505, name: "Idli Sambar (4 pcs)", price: 79, veg: true, rating: 4.5, desc: "Soft rice cakes with sambar and coconut chutney", category: "Tiffin", colorKey: "southindian" },
      { id: 506, name: "Medu Vada (2 pcs)", price: 69, veg: true, rating: 4.4, desc: "Crispy urad dal donuts with sambar", category: "Tiffin", colorKey: "southindian" },
      { id: 507, name: "Uttapam", price: 89, veg: true, rating: 4.4, desc: "Thick rice pancake with onion, tomato and chili", category: "Tiffin", colorKey: "southindian" },
      { id: 508, name: "Sambar Rice", price: 99, veg: true, rating: 4.4, desc: "Rice mixed with tangy sambar, topped with ghee", category: "Rice", colorKey: "southindian" },
      { id: 509, name: "Curd Rice", price: 89, veg: true, rating: 4.5, desc: "Creamy rice with yogurt tempered with mustard seeds", category: "Rice", colorKey: "healthy" },
      { id: 510, name: "Lemon Rice", price: 89, veg: true, rating: 4.3, desc: "Tangy turmeric rice with peanuts and curry leaves", category: "Rice", colorKey: "southindian" },
      { id: 511, name: "Filter Coffee", price: 49, veg: true, rating: 4.8, desc: "Traditional South Indian filter coffee in steel tumbler", category: "Drinks", colorKey: "dessert" },
      { id: 512, name: "Buttermilk (Chaas)", price: 39, veg: true, rating: 4.4, desc: "Chilled spiced buttermilk with ginger and coriander", category: "Drinks", colorKey: "healthy" },
    ]
  },
  {
    id: 6, name: "Sweet Cravings", cuisine: "Desserts, Ice Cream", category: "Desserts",
    rating: 4.5, deliveryTime: "20-30 min", deliveryFee: 30, minOrder: 149,
    discount: "₹50 OFF on first order", isVeg: true, isPro: false, tags: ["Sweet Tooth", "Bestseller"], colorKey: "dessert",
    menu: [
      { id: 601, name: "Chocolate Lava Cake", price: 149, veg: true, rating: 4.6, desc: "Warm chocolate cake with gooey molten center", category: "Cakes", colorKey: "dessert" },
      { id: 602, name: "Red Velvet Cake Slice", price: 129, veg: true, rating: 4.5, desc: "Moist red velvet with cream cheese frosting", category: "Cakes", colorKey: "dessert" },
      { id: 603, name: "Gulab Jamun (6 pcs)", price: 99, veg: true, rating: 4.7, desc: "Soft milk dumplings in rose-flavored sugar syrup", category: "Indian Sweets", colorKey: "dessert" },
      { id: 604, name: "Rasgulla (4 pcs)", price: 89, veg: true, rating: 4.5, desc: "Spongy cottage cheese balls in light sugar syrup", category: "Indian Sweets", colorKey: "dessert" },
      { id: 605, name: "Gajar Halwa", price: 109, veg: true, rating: 4.6, desc: "Slow-cooked carrot halwa with khoya and cardamom", category: "Indian Sweets", colorKey: "dessert" },
      { id: 606, name: "Kaju Katli (8 pcs)", price: 149, veg: true, rating: 4.7, desc: "Premium cashew fudge with silver vark topping", category: "Indian Sweets", colorKey: "dessert" },
      { id: 607, name: "Ice Cream Sundae", price: 129, veg: true, rating: 4.5, desc: "3 scoops with hot fudge, nuts and whipped cream", category: "Ice Cream", colorKey: "dessert" },
      { id: 608, name: "Kulfi (Malai)", price: 79, veg: true, rating: 4.6, desc: "Traditional frozen dessert with cardamom and pistachios", category: "Ice Cream", colorKey: "dessert" },
      { id: 609, name: "Brownie + Ice Cream", price: 159, veg: true, rating: 4.8, desc: "Warm fudgy brownie with vanilla ice cream scoop", category: "Cakes", colorKey: "dessert" },
      { id: 610, name: "Jalebi (200g)", price: 99, veg: true, rating: 4.5, desc: "Crispy golden spirals in saffron sugar syrup", category: "Indian Sweets", colorKey: "dessert" },
      { id: 611, name: "Paan Ice Cream", price: 89, veg: true, rating: 4.4, desc: "Unique betel leaf ice cream with gulkand and fennel", category: "Ice Cream", colorKey: "dessert" },
    ]
  },
  {
    id: 7, name: "Green Bowl", cuisine: "Healthy, Salads", category: "Healthy",
    rating: 4.3, deliveryTime: "25-35 min", deliveryFee: 35, minOrder: 199,
    discount: "10% OFF above ₹499", isVeg: false, isPro: true, tags: ["Healthy", "Calorie Counted"], colorKey: "healthy",
    menu: [
      { id: 701, name: "Grilled Chicken Salad", price: 249, veg: false, rating: 4.4, desc: "Tender grilled chicken on mixed greens with balsamic", category: "Salads", colorKey: "healthy" },
      { id: 702, name: "Caesar Salad", price: 219, veg: true, rating: 4.3, desc: "Romaine with caesar dressing, croutons and parmesan", category: "Salads", colorKey: "healthy" },
      { id: 703, name: "Greek Salad", price: 199, veg: true, rating: 4.2, desc: "Cucumbers, olives, feta cheese with olive oil dressing", category: "Salads", colorKey: "healthy" },
      { id: 704, name: "Quinoa Buddha Bowl", price: 299, veg: true, rating: 4.5, desc: "Nutritious quinoa with roasted veggies and hummus", category: "Bowls", colorKey: "healthy" },
      { id: 705, name: "Acai Bowl", price: 279, veg: true, rating: 4.4, desc: "Thick acai smoothie with granola, banana and honey", category: "Bowls", colorKey: "healthy" },
      { id: 706, name: "Chicken Grain Bowl", price: 319, veg: false, rating: 4.5, desc: "Brown rice with grilled chicken, avocado and veggies", category: "Bowls", colorKey: "healthy" },
      { id: 707, name: "Green Smoothie", price: 149, veg: true, rating: 4.2, desc: "Spinach, banana, almond milk and honey blend", category: "Drinks", colorKey: "healthy" },
      { id: 708, name: "Berry Blast Smoothie", price: 169, veg: true, rating: 4.4, desc: "Mixed berry smoothie with Greek yogurt and flaxseeds", category: "Drinks", colorKey: "dessert" },
      { id: 709, name: "Mango Lassi", price: 99, veg: true, rating: 4.6, desc: "Thick mango drink made with yogurt and cardamom", category: "Drinks", colorKey: "healthy" },
      { id: 710, name: "Avocado Toast", price: 199, veg: true, rating: 4.3, desc: "Multigrain toast with smashed avocado and chili flakes", category: "Breakfast", colorKey: "healthy" },
      { id: 711, name: "Overnight Oats", price: 159, veg: true, rating: 4.2, desc: "Chia seed oats with almond milk, berries and honey", category: "Breakfast", colorKey: "healthy" },
      { id: 712, name: "Protein Wrap", price: 229, veg: false, rating: 4.4, desc: "Whole wheat wrap with grilled chicken, hummus and veggies", category: "Wraps", colorKey: "healthy" },
    ]
  },
  {
    id: 8, name: "The Pasta House", cuisine: "Italian, Pasta", category: "Pizza",
    rating: 4.4, deliveryTime: "30-40 min", deliveryFee: 40, minOrder: 199,
    discount: "Flat ₹100 OFF above ₹599", isVeg: false, isPro: false, tags: ["Italian", "Gourmet"], colorKey: "pasta",
    menu: [
      { id: 801, name: "Spaghetti Carbonara", price: 279, veg: false, rating: 4.6, desc: "Classic Roman pasta with eggs, guanciale and pecorino", category: "Pasta", colorKey: "pasta" },
      { id: 802, name: "Penne Arrabbiata", price: 229, veg: true, rating: 4.3, desc: "Penne in fiery tomato arrabbiata sauce", category: "Pasta", colorKey: "pasta" },
      { id: 803, name: "Chicken Alfredo", price: 299, veg: false, rating: 4.7, desc: "Fettuccine in rich creamy parmesan sauce with chicken", category: "Pasta", colorKey: "pasta" },
      { id: 804, name: "Pasta Bolognese", price: 289, veg: false, rating: 4.5, desc: "Slow-cooked beef ragù sauce with tagliatelle pasta", category: "Pasta", colorKey: "pasta" },
      { id: 805, name: "Mushroom Risotto", price: 299, veg: true, rating: 4.6, desc: "Creamy Arborio rice with wild mushrooms and truffle oil", category: "Risotto", colorKey: "pasta" },
      { id: 806, name: "Chicken Pesto Pasta", price: 269, veg: false, rating: 4.4, desc: "Fusilli with homemade basil pesto and grilled chicken", category: "Pasta", colorKey: "pasta" },
      { id: 807, name: "Lasagna Al Forno", price: 319, veg: false, rating: 4.7, desc: "Layers of pasta, beef bolognese and béchamel", category: "Baked", colorKey: "pasta" },
      { id: 808, name: "Veg Lasagna", price: 289, veg: true, rating: 4.4, desc: "Layers of pasta with roasted veggies and white sauce", category: "Baked", colorKey: "pasta" },
      { id: 809, name: "Bruschetta (4 pcs)", price: 149, veg: true, rating: 4.3, desc: "Toasted bread with fresh tomato, basil and olive oil", category: "Starters", colorKey: "pasta" },
      { id: 810, name: "Tiramisu", price: 179, veg: true, rating: 4.8, desc: "Classic Italian dessert with espresso-soaked ladyfingers", category: "Desserts", colorKey: "dessert" },
      { id: 811, name: "Panna Cotta", price: 159, veg: true, rating: 4.5, desc: "Italian silky cream dessert with berry coulis", category: "Desserts", colorKey: "dessert" },
      { id: 812, name: "Lemonade Italiana", price: 89, veg: true, rating: 4.4, desc: "Fresh lemon juice with basil syrup and sparkling water", category: "Drinks", colorKey: "healthy" },
    ]
  }
];

// seed DB
MENU_DATA.forEach(r => DB.addRestaurant(r));

// ============================================================
// HELPERS
// ============================================================
const colorMap = {
  biryani: ["#FF8F00","#FFA726","🍛"], pizza: ["#E53935","#FF7043","🍕"],
  burger: ["#F57C00","#FF8A65","🍔"], chinese: ["#C62828","#EF5350","🥡"],
  southindian: ["#2E7D32","#66BB6A","🥘"], dessert: ["#AD1457","#F06292","🍰"],
  healthy: ["#1B5E20","#4CAF50","🥗"], pasta: ["#E65100","#FF8A65","🍝"],
};

function ColorBox({ colorKey, style }) {
  const [c1, c2, emoji] = colorMap[colorKey] || ["#FC8019","#FFB74D","🍽️"];
  return (
    <div style={{ ...style, background: `linear-gradient(135deg,${c1},${c2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize: style?.height > 100 ? 56 : 32, flexShrink:0 }}>
      {emoji}
    </div>
  );
}

const STATUS_COLORS = { Confirmed:"#2196F3", Preparing:"#FF9800", "Out for Delivery":"#9C27B0", Delivered:"#4CAF50", Cancelled:"#f44336" };

// ============================================================
// SVG ICONS
// ============================================================
const FoodIcons = {
  All: () => <svg width="36" height="36" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#FFF3E8"/><path d="M8 14h24M8 20h24M8 26h24" stroke="#FC8019" strokeWidth="2.5" strokeLinecap="round"/><circle cx="14" cy="14" r="2" fill="#FC8019"/><circle cx="14" cy="20" r="2" fill="#FC8019"/><circle cx="14" cy="26" r="2" fill="#FC8019"/></svg>,
  Biryani: () => <svg width="36" height="36" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#FFF8E1"/><ellipse cx="20" cy="26" rx="12" ry="6" fill="#FF8F00"/><ellipse cx="20" cy="22" rx="12" ry="6" fill="#FFB74D"/><ellipse cx="20" cy="20" rx="10" ry="4" fill="#FFCC80"/><circle cx="16" cy="19" r="1.5" fill="#F44336"/><circle cx="24" cy="19" r="1.5" fill="#4CAF50"/></svg>,
  Pizza: () => <svg width="36" height="36" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#FFF3E8"/><path d="M20 8 L32 30 L8 30 Z" fill="#FF8A65"/><circle cx="18" cy="22" r="2" fill="#F44336"/><circle cx="23" cy="18" r="2" fill="#F44336"/><path d="M8 30 Q20 33 32 30" stroke="#D84315" strokeWidth="2" fill="none"/></svg>,
  Burger: () => <svg width="36" height="36" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#FFF8E1"/><ellipse cx="20" cy="12" rx="11" ry="5" fill="#FF8F00"/><rect x="9" y="17" width="22" height="4" rx="1" fill="#4CAF50"/><rect x="9" y="21" width="22" height="4" rx="1" fill="#F44336"/><rect x="9" y="25" width="22" height="3" rx="1" fill="#FFB300"/><ellipse cx="20" cy="29" rx="11" ry="4" fill="#FF8F00"/></svg>,
  Chinese: () => <svg width="36" height="36" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#FCE4EC"/><rect x="10" y="22" width="20" height="10" rx="3" fill="#E53935"/><path d="M10 22 Q20 14 30 22" fill="#EF9A9A"/><line x1="18" y1="10" x2="16" y2="22" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/><line x1="22" y1="10" x2="24" y2="22" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/></svg>,
  "South Indian": () => <svg width="36" height="36" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#E8F5E9"/><ellipse cx="20" cy="26" rx="13" ry="5" fill="#A5D6A7"/><ellipse cx="20" cy="20" rx="11" ry="8" fill="#C8E6C9" stroke="#81C784" strokeWidth="1"/><ellipse cx="20" cy="19" rx="7" ry="5" fill="#F9A825"/></svg>,
  Desserts: () => <svg width="36" height="36" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#FCE4EC"/><rect x="14" y="22" width="12" height="10" rx="2" fill="#8D6E63"/><path d="M12 22 Q20 10 28 22 Z" fill="#F48FB1"/><circle cx="17" cy="19" r="1.5" fill="white"/></svg>,
  Healthy: () => <svg width="36" height="36" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#E8F5E9"/><circle cx="20" cy="21" r="11" fill="#A5D6A7"/><path d="M13 18 Q20 12 27 18 Q27 26 20 30 Q13 26 13 18Z" fill="#66BB6A"/><circle cx="16" cy="20" r="2" fill="#F44336" opacity="0.8"/></svg>,
};

const categories = [
  {id:"All",label:"All"},{id:"Biryani",label:"Biryani"},{id:"Pizza",label:"Pizza"},
  {id:"Burger",label:"Burger"},{id:"Chinese",label:"Chinese"},
  {id:"South Indian",label:"South Indian"},{id:"Desserts",label:"Desserts"},{id:"Healthy",label:"Healthy"},
];

// ============================================================
// AUTH MODAL
// ============================================================
function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState("");
  const set = (k,v) => setForm(p => ({ ...p, [k]:v }));

  const submit = () => {
    setErr("");
    if (mode === "login") {
      const user = DB.login(form.email, form.password);
      if (user) { onLogin(user); onClose(); }
      else setErr("❌ Invalid email or password");
    } else {
      if (!form.name || !form.email || !form.password) return setErr("❌ All fields required");
      const res = DB.register(form.name, form.email, form.password);
      if (res.error) setErr("❌ " + res.error);
      else { onLogin(res.user); onClose(); }
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, backdropFilter:"blur(4px)" }}>
      <div style={{ background:"white", borderRadius:20, padding:32, width:380, boxShadow:"0 20px 60px rgba(0,0,0,0.25)", animation:"fadeUp 0.3s ease" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:48 }}>🍜</div>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#3d4152" }}>{mode==="login" ? "Welcome back!" : "Create account"}</h2>
          <p style={{ color:"#888", fontSize:13 }}>{mode==="login" ? "Sign in to your Swiggy account" : "Join millions of happy customers"}</p>
        </div>
        {mode==="register" && (
          <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Full Name"
            style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"2px solid #f0f0f0", outline:"none", fontSize:14, marginBottom:10, fontFamily:"inherit" }}
            onFocus={e=>e.target.style.borderColor="#FC8019"} onBlur={e=>e.target.style.borderColor="#f0f0f0"} />
        )}
        <input value={form.email} onChange={e=>set("email",e.target.value)} placeholder="Email address" type="email"
          style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"2px solid #f0f0f0", outline:"none", fontSize:14, marginBottom:10, fontFamily:"inherit" }}
          onFocus={e=>e.target.style.borderColor="#FC8019"} onBlur={e=>e.target.style.borderColor="#f0f0f0"} />
        <input value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Password" type="password"
          style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"2px solid #f0f0f0", outline:"none", fontSize:14, marginBottom:16, fontFamily:"inherit" }}
          onFocus={e=>e.target.style.borderColor="#FC8019"} onBlur={e=>e.target.style.borderColor="#f0f0f0"}
          onKeyDown={e=>e.key==="Enter"&&submit()} />
        {err && <div style={{ color:"#f44336", fontSize:12, marginBottom:10, fontWeight:600 }}>{err}</div>}
        <button onClick={submit} style={{ width:"100%", padding:13, background:"linear-gradient(135deg,#FC8019,#ff5722)", color:"white", border:"none", borderRadius:10, fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginBottom:14 }}>
          {mode==="login" ? "Sign In" : "Create Account"}
        </button>
        <p style={{ textAlign:"center", fontSize:13, color:"#888" }}>
          {mode==="login" ? "New to Swiggy? " : "Already have account? "}
          <span onClick={()=>{setMode(mode==="login"?"register":"login");setErr("");}} style={{ color:"#FC8019", fontWeight:700, cursor:"pointer" }}>
            {mode==="login" ? "Sign Up" : "Sign In"}
          </span>
        </p>
        {mode==="login" && <p style={{ textAlign:"center", fontSize:11, color:"#aaa", marginTop:8 }}>Demo: admin@swiggy.com / admin123</p>}
        <button onClick={onClose} style={{ position:"absolute", top:16, right:18, background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#888" }}>✕</button>
      </div>
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ cartCount, cartTotal, onCartClick, onHomeClick, address, setAddress, searchQuery, setSearchQuery, user, onLogin, onLogout, onOrdersClick, onAdminClick }) {
  const [editAddr, setEditAddr] = useState(false);
  const [tmp, setTmp] = useState(address);
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <nav style={{ position:"sticky", top:0, zIndex:1000, background:"white", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", padding:"0 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", height:68, gap:16 }}>
          <div onClick={onHomeClick} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#FC8019,#ff5722)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🍜</div>
            <span style={{ fontSize:22, fontWeight:800, color:"#FC8019" }}>swiggy</span>
          </div>
          {/* Location */}
          <div onClick={()=>{setTmp(address);setEditAddr(true);}} style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer", padding:"6px 10px", borderRadius:8, flexShrink:0 }}
            onMouseEnter={e=>e.currentTarget.style.background="#fff3e8"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{ color:"#FC8019" }}>📍</span>
            <div>
              <div style={{ fontSize:10, color:"#888" }}>Delivering to</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#3d4152" }}>{address.split(",")[0]} <span style={{ color:"#FC8019" }}>▾</span></div>
            </div>
          </div>
          {/* Search */}
          <div style={{ flex:1, maxWidth:420, display:"flex", alignItems:"center", background:"#f5f5f5", borderRadius:10, padding:"9px 14px", gap:8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search restaurants and food..."
              style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:13, fontFamily:"inherit", color:"#3d4152" }} />
            {searchQuery && <span onClick={()=>setSearchQuery("")} style={{ cursor:"pointer", color:"#aaa" }}>✕</span>}
          </div>
          <div style={{ flex:1 }} />
          {/* Nav */}
          <button onClick={onHomeClick} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, color:"#3d4152", fontFamily:"inherit", padding:"6px 10px", borderRadius:8 }}
            onMouseEnter={e=>e.currentTarget.style.background="#f5f5f5"} onMouseLeave={e=>e.currentTarget.style.background="none"}>🏠 Home</button>
          {/* User */}
          {user ? (
            <div style={{ position:"relative" }}>
              <button onClick={()=>setShowMenu(!showMenu)} style={{ display:"flex", alignItems:"center", gap:7, background:"#fff3e8", border:"none", borderRadius:10, padding:"8px 14px", cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:13, color:"#FC8019" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#FC8019,#ff5722)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:14, fontWeight:800 }}>{user.name[0].toUpperCase()}</div>
                {user.name.split(" ")[0]} ▾
              </button>
              {showMenu && (
                <div style={{ position:"absolute", top:46, right:0, background:"white", borderRadius:12, boxShadow:"0 8px 30px rgba(0,0,0,0.15)", minWidth:180, overflow:"hidden", zIndex:999 }}>
                  <div style={{ padding:"12px 16px", borderBottom:"1px solid #f0f0f0" }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{user.name}</div>
                    <div style={{ fontSize:11, color:"#888" }}>{user.email}</div>
                    {user.role==="admin" && <div style={{ background:"#7C3AED", color:"white", display:"inline-block", padding:"2px 8px", borderRadius:10, fontSize:10, fontWeight:700, marginTop:4 }}>⚡ Admin</div>}
                  </div>
                  {[
                    ["📋","My Orders", onOrdersClick],
                    ...(user.role==="admin" ? [["🛠️","Admin Panel", onAdminClick]] : []),
                    ["🚪","Sign Out", ()=>{onLogout();setShowMenu(false);}],
                  ].map(([ic,lb,fn])=>(
                    <button key={lb} onClick={()=>{fn();setShowMenu(false);}} style={{ width:"100%", padding:"11px 16px", background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, textAlign:"left", display:"flex", alignItems:"center", gap:10, fontFamily:"inherit", color: lb==="Sign Out"?"#f44336":"#3d4152" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#f5f5f5"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                      {ic} {lb}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button onClick={()=>setShowAuth(true)} style={{ background:"none", border:"2px solid #FC8019", color:"#FC8019", borderRadius:10, padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>Sign In</button>
          )}
          {/* Cart */}
          <button onClick={onCartClick} style={{ display:"flex", alignItems:"center", gap:7, background: cartCount>0?"linear-gradient(135deg,#FC8019,#ff5722)":"#f5f5f5", color: cartCount>0?"white":"#3d4152", border:"none", borderRadius:10, padding:"10px 16px", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit", boxShadow: cartCount>0?"0 4px 16px rgba(252,128,25,0.35)":"none" }}>
            🛒 {cartCount>0?`${cartCount} • ₹${cartTotal+40}`:"Cart"}
          </button>
        </div>
      </nav>
      {editAddr && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
          <div style={{ background:"white", borderRadius:18, padding:28, width:370 }}>
            <h3 style={{ marginBottom:14, fontWeight:700 }}>📍 Delivery Address</h3>
            <input value={tmp} onChange={e=>setTmp(e.target.value)} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"2px solid #FC8019", outline:"none", fontSize:13, marginBottom:14, fontFamily:"inherit" }} />
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>{setAddress(tmp);setEditAddr(false);}} style={{ flex:1, padding:11, background:"#FC8019", color:"white", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Save</button>
              <button onClick={()=>setEditAddr(false)} style={{ flex:1, padding:11, background:"#f5f5f5", color:"#333", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={onLogin} />}
    </>
  );
}

// ============================================================
// HERO BANNER
// ============================================================
function HeroBanner() {
  const banners = [
    { bg:"linear-gradient(135deg,#FF6B35,#F7931E)", emoji:"🍔", title:"Order Anytime, Anywhere", sub:"100+ restaurants at your door", tag:"🔥 Trending Now" },
    { bg:"linear-gradient(135deg,#7C3AED,#A855F7)", emoji:"🍕", title:"50% OFF Your First Order!", sub:"Use code WELCOME50 at checkout", tag:"🎉 Special Offer" },
    { bg:"linear-gradient(135deg,#059669,#34D399)", emoji:"🥗", title:"Healthy Food Delivered", sub:"Fresh salads & bowls at your door", tag:"💚 Healthy Picks" },
  ];
  const [cur, setCur] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setCur(p=>(p+1)%banners.length),4000); return ()=>clearInterval(t); },[]);
  const b = banners[cur];
  return (
    <div style={{ padding:"20px 24px 0", maxWidth:1200, margin:"0 auto" }}>
      <div style={{ background:b.bg, borderRadius:22, padding:"36px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:174, position:"relative", overflow:"hidden", boxShadow:"0 8px 30px rgba(0,0,0,0.1)", transition:"background 0.6s" }}>
        <div style={{ position:"absolute", right:-40, top:-40, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <span style={{ display:"inline-block", background:"rgba(255,255,255,0.22)", padding:"5px 14px", borderRadius:20, color:"white", fontSize:12, fontWeight:700, marginBottom:10 }}>{b.tag}</span>
          <h1 style={{ color:"white", fontSize:28, fontWeight:800, marginBottom:7 }}>{b.title}</h1>
          <p style={{ color:"rgba(255,255,255,0.88)", fontSize:14, marginBottom:18 }}>{b.sub}</p>
          <button style={{ background:"white", color:"#FC8019", border:"none", padding:"11px 24px", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Order Now →</button>
        </div>
        <div style={{ fontSize:90, position:"relative", zIndex:1, animation:"float 3s ease-in-out infinite" }}>{b.emoji}</div>
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:12 }}>
        {banners.map((_,i)=><button key={i} onClick={()=>setCur(i)} style={{ width:i===cur?24:7, height:7, borderRadius:4, border:"none", background:i===cur?"#FC8019":"#ddd", cursor:"pointer", transition:"all 0.3s", padding:0 }}/>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginTop:18 }}>
        {[["🍽️","100+","Items"],["⚡","30 min","Delivery"],["⭐","4.5","Rating"],["🕐","24/7","Open"]].map(([ic,v,lb])=>(
          <div key={lb} style={{ background:"white", borderRadius:14, padding:"13px 16px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ width:38, height:38, background:"#fff3e8", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{ic}</div>
            <div><div style={{ fontSize:16, fontWeight:800, color:"#3d4152" }}>{v}</div><div style={{ fontSize:11, color:"#888" }}>{lb}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// RESTAURANT CARD & GRID
// ============================================================
function RestaurantCard({ r, onClick }) {
  const [liked, setLiked] = useState(false);
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"white", borderRadius:18, overflow:"hidden", cursor:"pointer", transition:"all 0.3s", boxShadow:hov?"0 14px 40px rgba(0,0,0,0.14)":"0 2px 12px rgba(0,0,0,0.07)", transform:hov?"translateY(-4px)":"translateY(0)" }}>
      <div style={{ position:"relative", overflow:"hidden" }}>
        <ColorBox colorKey={r.colorKey} style={{ width:"100%", height:170 }}/>
        {r.discount && <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(to top,rgba(0,0,0,0.72),transparent)", padding:"20px 12px 10px", color:"white", fontSize:12, fontWeight:700 }}>🏷️ {r.discount}</div>}
        {r.isPro && <div style={{ position:"absolute", top:10, left:10, background:"linear-gradient(135deg,#5B4CDB,#7C3AED)", color:"white", padding:"3px 9px", borderRadius:6, fontSize:10, fontWeight:700 }}>⚡ PRO</div>}
        <div style={{ position:"absolute", top:10, right:36, background:"white", borderRadius:6, padding:"3px 7px", fontSize:10, fontWeight:700, color:r.isVeg?"#4CAF50":"#f44336", border:`1.5px solid ${r.isVeg?"#4CAF50":"#f44336"}` }}>{r.isVeg?"🟢 VEG":"🔴 NON"}</div>
        <button onClick={e=>{e.stopPropagation();setLiked(!liked);}} style={{ position:"absolute", top:10, right:8, background:"white", border:"none", borderRadius:"50%", width:30, height:30, cursor:"pointer", fontSize:14, boxShadow:"0 2px 8px rgba(0,0,0,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>{liked?"❤️":"🤍"}</button>
      </div>
      <div style={{ padding:"12px 14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:2 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:"#3d4152", margin:0 }}>{r.name}</h3>
          <div style={{ background:r.rating>=4.5?"#48c774":"#FC8019", color:"white", padding:"3px 8px", borderRadius:6, fontSize:11, fontWeight:700, flexShrink:0 }}>⭐ {r.rating}</div>
        </div>
        <p style={{ fontSize:11, color:"#93959f", marginBottom:9 }}>{r.cuisine}</p>
        <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid #f5f5f5" }}>
          <div style={{ textAlign:"center" }}><div style={{ fontSize:12, fontWeight:700, color:"#3d4152" }}>🕐 {r.deliveryTime}</div><div style={{ fontSize:10, color:"#888" }}>Delivery</div></div>
          <div style={{ width:1, background:"#f0f0f0" }}/>
          <div style={{ textAlign:"center" }}><div style={{ fontSize:12, fontWeight:700, color:"#3d4152" }}>{r.deliveryFee===0?"🆓 Free":`₹${r.deliveryFee}`}</div><div style={{ fontSize:10, color:"#888" }}>Fee</div></div>
          <div style={{ width:1, background:"#f0f0f0" }}/>
          <div style={{ textAlign:"center" }}><div style={{ fontSize:12, fontWeight:700, color:"#3d4152" }}>₹{r.minOrder}</div><div style={{ fontSize:10, color:"#888" }}>Min.</div></div>
        </div>
        {r.tags?.length>0 && <div style={{ display:"flex", gap:5, marginTop:8, flexWrap:"wrap" }}>{r.tags.map(t=><span key={t} style={{ background:"#fff3e8", color:"#FC8019", padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:600 }}>{t}</span>)}</div>}
      </div>
    </div>
  );
}

function RestaurantGrid({ list, onSelect, active, setActive, searchQuery, setSearchQuery }) {
  return (
    <div style={{ paddingBottom:40 }}>
      {/* Category Filter */}
      <div style={{ paddingTop:24, paddingBottom:12 }}>
        <h2 style={{ fontSize:19, fontWeight:800, color:"#3d4152", marginBottom:14 }}>What's on your mind?</h2>
        <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:6 }}>
          {categories.map(cat=>{ const Icon=FoodIcons[cat.id]||FoodIcons["All"]; const isA=active===cat.id; return (
            <button key={cat.id} onClick={()=>setActive(cat.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"12px 15px", borderRadius:14, minWidth:78, flexShrink:0, border:isA?"2px solid #FC8019":"2px solid transparent", background:isA?"#fff3e8":"white", cursor:"pointer", transition:"all 0.2s", fontFamily:"inherit", boxShadow:isA?"0 4px 16px rgba(252,128,25,0.2)":"0 2px 8px rgba(0,0,0,0.05)", transform:isA?"scale(1.05)":"scale(1)" }}>
              <Icon/><span style={{ fontSize:11, fontWeight:700, color:isA?"#FC8019":"#3d4152", whiteSpace:"nowrap" }}>{cat.label}</span>
            </button>
          );})}
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ fontSize:19, fontWeight:800, color:"#3d4152" }}>Restaurants Near You <span style={{ fontSize:13, fontWeight:500, color:"#888" }}>({list.length})</span></h2>
      </div>
      {list.length===0 ? (
        <div style={{ textAlign:"center", padding:"50px 20px", background:"white", borderRadius:16 }}><div style={{ fontSize:56 }}>🔍</div><h3 style={{ marginTop:12 }}>No restaurants found</h3></div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))", gap:18 }}>
          {list.map(r=><RestaurantCard key={r.id} r={r} onClick={()=>onSelect(r)}/>)}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MENU ITEM
// ============================================================
function MenuItem({ item, qty, onAdd, onRemove }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"white", borderRadius:14, padding:"14px 18px", display:"flex", gap:14, alignItems:"center", boxShadow:hov?"0 4px 18px rgba(0,0,0,0.09)":"0 2px 8px rgba(0,0,0,0.05)", border:qty>0?"2px solid #FC8019":"2px solid transparent", transition:"all 0.2s" }}>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
          <div style={{ width:13, height:13, borderRadius:2, border:`2px solid ${item.veg?"#4CAF50":"#f44336"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:item.veg?"#4CAF50":"#f44336" }}/>
          </div>
          <h4 style={{ fontSize:14, fontWeight:700, color:"#3d4152", margin:0 }}>{item.name}</h4>
          <span style={{ background:"#f5f5f5", color:"#666", padding:"1px 7px", borderRadius:8, fontSize:10, fontWeight:600 }}>⭐ {item.rating}</span>
        </div>
        <div style={{ fontSize:15, fontWeight:800, color:"#3d4152", marginBottom:3 }}>₹{item.price}</div>
        <p style={{ fontSize:11, color:"#93959f", lineHeight:1.5, margin:0 }}>{item.desc}</p>
      </div>
      <div style={{ position:"relative", flexShrink:0 }}>
        <ColorBox colorKey={item.colorKey} style={{ width:98, height:74, borderRadius:10 }}/>
        <div style={{ position:"absolute", bottom:-11, left:"50%", transform:"translateX(-50%)" }}>
          {qty===0 ? (
            <button onClick={onAdd} style={{ background:"white", color:"#FC8019", border:"2px solid #FC8019", padding:"4px 16px", borderRadius:7, fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#FC8019";e.currentTarget.style.color="white";}}
              onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color="#FC8019";}}>+ ADD</button>
          ) : (
            <div style={{ display:"flex", alignItems:"center", background:"#FC8019", borderRadius:7, overflow:"hidden" }}>
              <button onClick={onRemove} style={{ background:"none", border:"none", color:"white", padding:"4px 10px", cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"inherit" }}>−</button>
              <span style={{ color:"white", fontWeight:800, fontSize:13, padding:"4px 4px", minWidth:20, textAlign:"center" }}>{qty}</span>
              <button onClick={onAdd} style={{ background:"none", border:"none", color:"white", padding:"4px 10px", cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"inherit" }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RESTAURANT DETAIL
// ============================================================
function RestaurantDetail({ r, cartItems, onAdd, onRemove, onBack, onCartClick }) {
  const [menuCat, setMenuCat] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [search, setSearch] = useState("");
  const cats = ["All", ...new Set(r.menu.map(i=>i.category))];
  const cartCount = cartItems.reduce((s,i)=>s+i.qty,0);
  const cartTotal = cartItems.reduce((s,i)=>s+i.price*i.qty,0);
  const filtered = r.menu.filter(item => (menuCat==="All"||item.category===menuCat) && (!vegOnly||item.veg) && item.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:"20px 24px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, color:"#FC8019", fontFamily:"inherit", marginBottom:16, padding:0 }}>← Back</button>
      <div style={{ background:"white", borderRadius:20, overflow:"hidden", marginBottom:16, boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ position:"relative" }}>
          <ColorBox colorKey={r.colorKey} style={{ width:"100%", height:200 }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 60%)" }}/>
          <div style={{ position:"absolute", bottom:18, left:22 }}>
            <h1 style={{ color:"white", fontSize:24, fontWeight:800, margin:0 }}>{r.name}</h1>
            <p style={{ color:"rgba(255,255,255,0.85)", fontSize:13, margin:"4px 0 0" }}>{r.cuisine}</p>
          </div>
        </div>
        <div style={{ padding:"13px 20px", display:"grid", gridTemplateColumns:"repeat(5,1fr)" }}>
          {[["⭐",r.rating,"Rating"],["🕐",r.deliveryTime,"Delivery"],["🚚",r.deliveryFee===0?"Free":`₹${r.deliveryFee}`,"Fee"],["💰",`₹${r.minOrder}`,"Min."],[(r.isVeg?"🟢":"🔴"),(r.isVeg?"Veg":"Non-Veg"),"Type"]].map(([ic,v,lb],i,a)=>(
            <div key={lb} style={{ textAlign:"center", padding:"6px 0", borderRight:i<a.length-1?"1px solid #f0f0f0":"none" }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#3d4152" }}>{ic} {v}</div>
              <div style={{ fontSize:10, color:"#888" }}>{lb}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"linear-gradient(135deg,#fff3e8,#ffe8d6)", borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", gap:10, marginBottom:14, border:"1px dashed #FC8019" }}>
        <span style={{ fontSize:20 }}>🏷️</span>
        <div><div style={{ fontSize:13, fontWeight:700, color:"#FC8019" }}>{r.discount}</div><div style={{ fontSize:11, color:"#888" }}>Limited time</div></div>
      </div>
      <div style={{ background:"white", borderRadius:14, padding:"13px 16px", marginBottom:12, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ display:"flex", gap:9, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:160, display:"flex", alignItems:"center", background:"#f5f5f5", borderRadius:9, padding:"8px 12px", gap:7 }}>
            <span>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search menu..." style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:12, fontFamily:"inherit" }}/>
          </div>
          <button onClick={()=>setVegOnly(!vegOnly)} style={{ padding:"8px 13px", borderRadius:9, border:`2px solid ${vegOnly?"#4CAF50":"#ddd"}`, background:vegOnly?"#e8f5e9":"white", cursor:"pointer", fontWeight:700, fontSize:12, fontFamily:"inherit", color:vegOnly?"#4CAF50":"#888" }}>🟢 Veg Only</button>
        </div>
        <div style={{ display:"flex", gap:7, marginTop:10, overflowX:"auto" }}>
          {cats.map(c=><button key={c} onClick={()=>setMenuCat(c)} style={{ padding:"5px 13px", borderRadius:18, border:"none", background:menuCat===c?"#FC8019":"#f5f5f5", color:menuCat===c?"white":"#555", fontWeight:700, fontSize:11, cursor:"pointer", flexShrink:0, fontFamily:"inherit" }}>{c}</button>)}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:cartCount>0?72:20 }}>
        {filtered.map(item=><MenuItem key={item.id} item={item} qty={cartItems.find(i=>i.id===item.id)?.qty||0} onAdd={()=>onAdd(item,r)} onRemove={()=>onRemove(item.id)}/>)}
      </div>
      {cartCount>0 && (
        <div onClick={onCartClick} style={{ position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#FC8019,#ff5722)", color:"white", borderRadius:14, padding:"13px 26px", display:"flex", alignItems:"center", justifyContent:"space-between", width:"calc(100% - 80px)", maxWidth:580, boxShadow:"0 8px 30px rgba(252,128,25,0.45)", zIndex:100, cursor:"pointer" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:7, padding:"3px 9px", fontWeight:800 }}>{cartCount}</div>
            <span style={{ fontWeight:700, fontSize:13 }}>{cartCount} item{cartCount>1?"s":""}</span>
          </div>
          <span style={{ fontWeight:800, fontSize:14 }}>View Cart • ₹{cartTotal} →</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CART
// ============================================================
function Cart({ isOpen, onClose, items, onAdd, onRemove, onClear, total, user, onOrderPlaced }) {
  const [ordered, setOrdered] = useState(false);
  const [promo, setPromo] = useState("");
  const [disc, setDisc] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [lastOrder, setLastOrder] = useState(null);
  const deliveryFee = total>299?0:40;
  const taxes = Math.round(total*0.05);
  const grand = total+deliveryFee+taxes-disc;
  const applyPromo = ()=>{ const map={SAVE50:50,FIRST100:100,SWIGGY20:Math.round(total*0.2)}; const v=map[promo.toUpperCase()]; if(v){setDisc(v);setPromoMsg(`✅ ₹${v} off!`);}else{setPromoMsg("❌ Invalid code");setDisc(0);}};
  const placeOrder = ()=>{
    if (!user) return alert("Please sign in to place an order!");
    const restaurantName = items[0]?.restaurantName || "Restaurant";
    const order = DB.placeOrder(user.id, items.map(i=>({name:i.name,qty:i.qty,price:i.price})), grand, restaurantName);
    setLastOrder(order);
    setOrdered(true);
    onOrderPlaced && onOrderPlaced(order);
    setTimeout(()=>{ setOrdered(false); onClear(); onClose(); setDisc(0); setPromo(""); setPromoMsg(""); },4500);
  };
  return (
    <>
      {isOpen && <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000, backdropFilter:"blur(4px)" }}/>}
      <div style={{ position:"fixed", top:0, right:0, width:385, height:"100vh", background:"white", boxShadow:"-4px 0 40px rgba(0,0,0,0.14)", zIndex:1001, transform:isOpen?"translateX(0)":"translateX(100%)", transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"17px 20px", borderBottom:"1px solid #f0f0f0", display:"flex", justifyContent:"space-between", alignItems:"center", background:"linear-gradient(135deg,#FC8019,#ff5722)" }}>
          <div><h2 style={{ color:"white", margin:0, fontSize:18, fontWeight:800 }}>🛒 Your Cart</h2><p style={{ color:"rgba(255,255,255,0.85)", margin:0, fontSize:11 }}>{items.length>0?`${items.reduce((s,i)=>s+i.qty,0)} items`:"Empty"}</p></div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"white", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:16, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        {ordered && (
          <div style={{ position:"absolute", inset:0, background:"white", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:10, gap:12 }}>
            <div style={{ fontSize:72 }}>🎉</div>
            <h2 style={{ fontSize:21, fontWeight:800 }}>Order Placed!</h2>
            <div style={{ background:"#f5f5f5", borderRadius:12, padding:"12px 20px", textAlign:"center" }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#FC8019" }}>{lastOrder?.id}</div>
              <div style={{ fontSize:12, color:"#888" }}>Estimated: 30-45 mins</div>
            </div>
            <div style={{ background:"#e8f5e9", color:"#4CAF50", padding:"10px 22px", borderRadius:10, fontWeight:700, fontSize:13 }}>✅ Confirmed • ₹{grand}</div>
          </div>
        )}
        {items.length===0&&!ordered && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 }}>
            <div style={{ fontSize:70 }}>🛒</div>
            <h3 style={{ fontSize:17, fontWeight:700 }}>Cart is empty</h3>
            <button onClick={onClose} style={{ background:"#FC8019", color:"white", border:"none", padding:"10px 24px", borderRadius:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Browse</button>
          </div>
        )}
        {items.length>0&&!ordered && (
          <>
            <div style={{ flex:1, overflowY:"auto", padding:"13px 17px" }}>
              {items[0]?.restaurantName && <div style={{ background:"#fff3e8", borderRadius:9, padding:"6px 12px", marginBottom:10, fontSize:11, fontWeight:700, color:"#FC8019" }}>🍽️ {items[0].restaurantName}</div>}
              {items.map(item=>(
                <div key={item.id} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 0", borderBottom:"1px solid #f5f5f5" }}>
                  <div style={{ width:11, height:11, borderRadius:2, border:`1.5px solid ${item.veg?"#4CAF50":"#f44336"}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ width:5, height:5, borderRadius:"50%", background:item.veg?"#4CAF50":"#f44336" }}/></div>
                  <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:700 }}>{item.name}</div><div style={{ fontSize:11, color:"#888" }}>₹{item.price}</div></div>
                  <div style={{ display:"flex", alignItems:"center", background:"#FC8019", borderRadius:7, overflow:"hidden" }}>
                    <button onClick={()=>onRemove(item.id)} style={{ background:"none", border:"none", color:"white", padding:"3px 9px", cursor:"pointer", fontWeight:800, fontSize:14 }}>−</button>
                    <span style={{ color:"white", fontWeight:800, fontSize:12, minWidth:20, textAlign:"center" }}>{item.qty}</span>
                    <button onClick={()=>onAdd(item,{name:item.restaurantName})} style={{ background:"none", border:"none", color:"white", padding:"3px 9px", cursor:"pointer", fontWeight:800, fontSize:14 }}>+</button>
                  </div>
                  <div style={{ fontSize:12, fontWeight:800, minWidth:42, textAlign:"right" }}>₹{item.price*item.qty}</div>
                </div>
              ))}
              <div style={{ marginTop:13 }}>
                <div style={{ display:"flex", gap:7, marginBottom:5 }}>
                  <input value={promo} onChange={e=>setPromo(e.target.value)} placeholder="Promo code (SAVE50)" style={{ flex:1, padding:"8px 11px", borderRadius:8, border:"2px solid #f0f0f0", outline:"none", fontSize:12, fontFamily:"inherit" }} onFocus={e=>e.target.style.borderColor="#FC8019"} onBlur={e=>e.target.style.borderColor="#f0f0f0"}/>
                  <button onClick={applyPromo} style={{ background:"#FC8019", color:"white", border:"none", borderRadius:8, padding:"8px 12px", fontWeight:700, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Apply</button>
                </div>
                {promoMsg&&<div style={{ fontSize:11, fontWeight:600, color:promoMsg.startsWith("✅")?"#4CAF50":"#f44336" }}>{promoMsg}</div>}
              </div>
              <div style={{ background:"#fafafa", borderRadius:11, padding:13, marginTop:11 }}>
                <h4 style={{ fontSize:12, fontWeight:800, marginBottom:9 }}>Bill Details</h4>
                {[["Item Total",`₹${total}`],["Delivery Fee",deliveryFee===0?"FREE 🎉":`₹${deliveryFee}`],["GST",`₹${taxes}`]].map(([l,v])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5, color:"#666" }}><span>{l}</span><span>{v}</span></div>
                ))}
                {disc>0&&<div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5, color:"#4CAF50", fontWeight:700 }}><span>Promo</span><span>-₹{disc}</span></div>}
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, fontWeight:800, paddingTop:7, borderTop:"1px dashed #ddd", marginTop:4 }}><span>To Pay</span><span>₹{grand}</span></div>
              </div>
            </div>
            <div style={{ padding:"13px 17px", borderTop:"1px solid #f0f0f0" }}>
              {!user&&<div style={{ background:"#fff3e8", borderRadius:9, padding:"8px 12px", marginBottom:10, fontSize:12, fontWeight:600, color:"#FC8019", textAlign:"center" }}>⚠️ Sign in to place order</div>}
              <button onClick={placeOrder} style={{ width:"100%", padding:13, background:"linear-gradient(135deg,#FC8019,#ff5722)", color:"white", border:"none", borderRadius:12, fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
                {user?"Place Order":"Sign In & Order"} • ₹{grand}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ============================================================
// ORDER HISTORY
// ============================================================
function OrderHistory({ user, onClose }) {
  const orders = DB.getOrders(user.id, user.role);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9998, backdropFilter:"blur(4px)" }}>
      <div style={{ background:"white", borderRadius:20, width:520, maxHeight:"85vh", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #f0f0f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ fontSize:19, fontWeight:800 }}>📋 {user.role==="admin"?"All Orders":"My Orders"}</h2>
          <button onClick={onClose} style={{ background:"#f5f5f5", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 24px" }}>
          {orders.length===0 ? (
            <div style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:56 }}>📦</div><p style={{ color:"#888", marginTop:12 }}>No orders yet</p></div>
          ) : orders.map(order=>(
            <div key={order.id} style={{ background:"#fafafa", borderRadius:14, padding:"14px 16px", marginBottom:12, border:"1px solid #f0f0f0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:14, color:"#3d4152" }}>{order.id}</div>
                  <div style={{ fontSize:11, color:"#888" }}>{order.restaurant} • {order.date}</div>
                </div>
                <div style={{ background:STATUS_COLORS[order.status]+"22", color:STATUS_COLORS[order.status], padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>{order.status}</div>
              </div>
              <div style={{ fontSize:12, color:"#555", marginBottom:8 }}>
                {order.items.map(i=>`${i.name} x${i.qty}`).join(" • ")}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:800, color:"#FC8019" }}>₹{order.total}</span>
                {user.role==="admin" && (
                  <select defaultValue={order.status} onChange={e=>DB.updateOrderStatus(order.id, e.target.value)}
                    style={{ fontSize:11, padding:"4px 8px", borderRadius:8, border:"1px solid #ddd", cursor:"pointer", fontFamily:"inherit" }}>
                    {Object.keys(STATUS_COLORS).map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PANEL
// ============================================================
function AdminPanel({ onClose }) {
  const [tab, setTab] = useState("dashboard");
  const [restaurants, setRestaurants] = useState(DB.getRestaurants());
  const [selR, setSelR] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddR, setShowAddR] = useState(false);
  const [newItem, setNewItem] = useState({ name:"", price:"", veg:true, desc:"", category:"", rating:4.5, colorKey:"biryani" });
  const [newR, setNewR] = useState({ name:"", cuisine:"", category:"Biryani", rating:4.3, deliveryTime:"30-40 min", deliveryFee:30, minOrder:149, discount:"", isVeg:false, isPro:false, tags:[], colorKey:"biryani" });
  const stats = DB.getStats();
  const refresh = () => setRestaurants([...DB.getRestaurants()]);

  const addItem = () => {
    if (!newItem.name||!newItem.price) return;
    DB.addMenuItem(selR.id, { ...newItem, price:+newItem.price, id:Date.now(), image:"" });
    setNewItem({ name:"", price:"", veg:true, desc:"", category:"", rating:4.5, colorKey:"biryani" });
    setShowAddItem(false); refresh();
  };
  const addRestaurant = () => {
    if (!newR.name) return;
    DB.addRestaurant(newR);
    setShowAddR(false); refresh();
  };

  const tabs = [["📊","Dashboard","dashboard"],["🍽️","Restaurants","restaurants"],["📋","Orders","orders"]];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9998, backdropFilter:"blur(6px)" }}>
      <div style={{ background:"white", borderRadius:20, width:720, maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>
        {/* Header */}
        <div style={{ padding:"18px 24px", borderBottom:"1px solid #f0f0f0", display:"flex", justifyContent:"space-between", alignItems:"center", background:"linear-gradient(135deg,#5B4CDB,#7C3AED)", borderRadius:"20px 20px 0 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:24 }}>🛠️</span>
            <h2 style={{ color:"white", margin:0, fontSize:19, fontWeight:800 }}>Admin Panel</h2>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"white", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        {/* Tabs */}
        <div style={{ display:"flex", gap:4, padding:"12px 20px", borderBottom:"1px solid #f0f0f0", background:"#fafafa" }}>
          {tabs.map(([ic,lb,id])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ padding:"8px 18px", borderRadius:10, border:"none", background:tab===id?"#5B4CDB":"transparent", color:tab===id?"white":"#555", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>{ic} {lb}</button>
          ))}
        </div>
        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"18px 22px" }}>
          {/* DASHBOARD */}
          {tab==="dashboard" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
                {[["📦",stats.totalOrders,"Total Orders","#FC8019"],["👥",stats.totalUsers,"Users","#5B4CDB"],["💰","₹"+stats.totalRevenue,"Revenue","#059669"],["🍽️",stats.totalRestaurants,"Restaurants","#E53935"]].map(([ic,v,lb,color])=>(
                  <div key={lb} style={{ background:`${color}11`, borderRadius:14, padding:"16px 18px", border:`1px solid ${color}33` }}>
                    <div style={{ fontSize:24 }}>{ic}</div>
                    <div style={{ fontSize:22, fontWeight:800, color }}>{v}</div>
                    <div style={{ fontSize:11, color:"#888" }}>{lb}</div>
                  </div>
                ))}
              </div>
              <h3 style={{ fontWeight:800, marginBottom:12 }}>All Users</h3>
              {DB.getUsers().map(u=>(
                <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f5f5f5" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#FC8019,#ff5722)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800 }}>{u.name[0]}</div>
                  <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13 }}>{u.name}</div><div style={{ fontSize:11, color:"#888" }}>{u.email}</div></div>
                  <div style={{ background:u.role==="admin"?"#7C3AED22":"#4CAF5022", color:u.role==="admin"?"#7C3AED":"#4CAF50", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>{u.role}</div>
                  <div style={{ fontSize:11, color:"#888" }}>Joined {u.joined}</div>
                </div>
              ))}
            </div>
          )}
          {/* RESTAURANTS */}
          {tab==="restaurants" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <h3 style={{ fontWeight:800 }}>Manage Restaurants ({restaurants.length})</h3>
                <button onClick={()=>setShowAddR(true)} style={{ background:"#FC8019", color:"white", border:"none", borderRadius:10, padding:"8px 16px", fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>+ Add Restaurant</button>
              </div>
              {showAddR && (
                <div style={{ background:"#f9f9f9", borderRadius:14, padding:16, marginBottom:16, border:"1px solid #f0f0f0" }}>
                  <h4 style={{ marginBottom:12 }}>New Restaurant</h4>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {[["name","Name"],["cuisine","Cuisine"],["deliveryTime","Delivery Time"],["discount","Discount"]].map(([k,ph])=>(
                      <input key={k} value={newR[k]} onChange={e=>setNewR(p=>({...p,[k]:e.target.value}))} placeholder={ph}
                        style={{ padding:"9px 12px", borderRadius:9, border:"1px solid #e0e0e0", outline:"none", fontSize:13, fontFamily:"inherit" }}/>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:8 }}>
                    <button onClick={addRestaurant} style={{ background:"#FC8019", color:"white", border:"none", borderRadius:9, padding:"9px 18px", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Save</button>
                    <button onClick={()=>setShowAddR(false)} style={{ background:"#f0f0f0", border:"none", borderRadius:9, padding:"9px 18px", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
                  </div>
                </div>
              )}
              {restaurants.map(r=>(
                <div key={r.id} style={{ background:"#fafafa", borderRadius:14, padding:"13px 16px", marginBottom:10, border:"1px solid #f0f0f0" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:14 }}>{r.name}</div>
                      <div style={{ fontSize:11, color:"#888" }}>{r.cuisine} • ⭐{r.rating} • {r.menu?.length||0} items</div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>{setSelR(r);setShowAddItem(true);}} style={{ background:"#FC8019", color:"white", border:"none", borderRadius:8, padding:"6px 12px", fontWeight:700, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>+ Item</button>
                      <button onClick={()=>{setSelR(selR?.id===r.id?null:r);}} style={{ background:selR?.id===r.id?"#5B4CDB":"#f0f0f0", color:selR?.id===r.id?"white":"#333", border:"none", borderRadius:8, padding:"6px 12px", fontWeight:700, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
                        {selR?.id===r.id?"Hide":"Menu"}
                      </button>
                      <button onClick={()=>{DB.deleteRestaurant(r.id);refresh();setSelR(null);}} style={{ background:"#ffebee", color:"#f44336", border:"none", borderRadius:8, padding:"6px 12px", fontWeight:700, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Delete</button>
                    </div>
                  </div>
                  {/* Add Item Form */}
                  {showAddItem&&selR?.id===r.id && (
                    <div style={{ background:"white", borderRadius:12, padding:14, marginTop:10, border:"1px solid #f0f0f0" }}>
                      <h4 style={{ marginBottom:10, fontSize:13 }}>Add Menu Item</h4>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                        <input value={newItem.name} onChange={e=>setNewItem(p=>({...p,name:e.target.value}))} placeholder="Item Name" style={{ padding:"8px 11px", borderRadius:8, border:"1px solid #e0e0e0", fontSize:12, fontFamily:"inherit" }}/>
                        <input value={newItem.price} onChange={e=>setNewItem(p=>({...p,price:e.target.value}))} placeholder="Price (₹)" type="number" style={{ padding:"8px 11px", borderRadius:8, border:"1px solid #e0e0e0", fontSize:12, fontFamily:"inherit" }}/>
                        <input value={newItem.category} onChange={e=>setNewItem(p=>({...p,category:e.target.value}))} placeholder="Category" style={{ padding:"8px 11px", borderRadius:8, border:"1px solid #e0e0e0", fontSize:12, fontFamily:"inherit" }}/>
                        <input value={newItem.desc} onChange={e=>setNewItem(p=>({...p,desc:e.target.value}))} placeholder="Description" style={{ padding:"8px 11px", borderRadius:8, border:"1px solid #e0e0e0", fontSize:12, fontFamily:"inherit" }}/>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <label style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer", fontSize:13 }}>
                          <input type="checkbox" checked={newItem.veg} onChange={e=>setNewItem(p=>({...p,veg:e.target.checked}))}/> 🟢 Veg
                        </label>
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={addItem} style={{ background:"#FC8019", color:"white", border:"none", borderRadius:8, padding:"8px 16px", fontWeight:700, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Add Item</button>
                        <button onClick={()=>setShowAddItem(false)} style={{ background:"#f0f0f0", border:"none", borderRadius:8, padding:"8px 16px", fontWeight:700, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {/* Menu List */}
                  {selR?.id===r.id&&!showAddItem && (
                    <div style={{ marginTop:10 }}>
                      {(r.menu||[]).map(item=>(
                        <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px solid #f0f0f0", fontSize:12 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <div style={{ width:8, height:8, borderRadius:"50%", background:item.veg?"#4CAF50":"#f44336" }}/>
                            <span style={{ fontWeight:600 }}>{item.name}</span>
                            <span style={{ color:"#888" }}>• {item.category}</span>
                          </div>
                          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                            <span style={{ fontWeight:800, color:"#FC8019" }}>₹{item.price}</span>
                            <button onClick={()=>{DB.deleteMenuItem(r.id,item.id);refresh();}} style={{ background:"#ffebee", color:"#f44336", border:"none", borderRadius:6, padding:"3px 8px", cursor:"pointer", fontSize:11, fontWeight:700 }}>Del</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* ORDERS */}
          {tab==="orders" && (
            <div>
              <h3 style={{ fontWeight:800, marginBottom:14 }}>All Orders ({DB.getOrders(null,"admin").length})</h3>
              {DB.getOrders(null,"admin").map(order=>(
                <div key={order.id} style={{ background:"#fafafa", borderRadius:14, padding:"13px 16px", marginBottom:10, border:"1px solid #f0f0f0" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:13 }}>{order.id} <span style={{ fontSize:11, color:"#888" }}>by User #{order.userId}</span></div>
                      <div style={{ fontSize:11, color:"#888" }}>{order.restaurant} • {order.date}</div>
                    </div>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:14, fontWeight:800, color:"#FC8019" }}>₹{order.total}</span>
                      <select defaultValue={order.status} onChange={e=>DB.updateOrderStatus(order.id,e.target.value)}
                        style={{ fontSize:11, padding:"4px 8px", borderRadius:8, border:"1px solid #ddd", cursor:"pointer", background:STATUS_COLORS[order.status]+"11", color:STATUS_COLORS[order.status], fontWeight:700, fontFamily:"inherit" }}>
                        {Object.keys(STATUS_COLORS).map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ fontSize:11, color:"#555" }}>{order.items.map(i=>`${i.name} ×${i.qty}`).join(" • ")}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer style={{ background:"#3d4152", color:"white", padding:"36px 24px 20px", marginTop:40 }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:32, marginBottom:28 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#FC8019,#ff5722)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🍜</div>
              <span style={{ fontSize:22, fontWeight:800, color:"#FC8019" }}>swiggy</span>
            </div>
            <p style={{ color:"#aaa", fontSize:12, lineHeight:1.7, maxWidth:230 }}>Delivering happiness to your doorstep. 100+ items from 8 restaurants.</p>
          </div>
          {[{title:"Company",links:["About","Careers","Blog","Press"]},{title:"Restaurants",links:["Partner","Register","Apps"]},{title:"Support",links:["Privacy","Terms","Help"]}].map(col=>(
            <div key={col.title}>
              <h4 style={{ marginBottom:12, fontWeight:700, fontSize:13, color:"#ddd" }}>{col.title}</h4>
              {col.links.map(l=><div key={l} style={{ color:"#aaa", fontSize:12, marginBottom:8, cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.color="#FC8019"} onMouseLeave={e=>e.currentTarget.style.color="#aaa"}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:14, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <p style={{ color:"#888", fontSize:11 }}>© 2025 Swiggy Clone • React JS + Local JSON DB</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedR, setSelectedR] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [address, setAddress] = useState("Ahmedabad, Gujarat");
  const [notif, setNotif] = useState(null);
  const [user, setUser] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const showNotif = (msg) => { setNotif(msg); setTimeout(()=>setNotif(null), 2200); };

  const addToCart = (item, restaurant) => {
    setCartItems(prev => {
      const ex = prev.find(i=>i.id===item.id);
      if (ex) { showNotif(`${item.name} updated!`); return prev.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i); }
      showNotif(`${item.name} added!`);
      return [...prev, { ...item, qty:1, restaurantName:restaurant.name }];
    });
  };
  const removeFromCart = (id) => {
    setCartItems(prev => {
      const ex = prev.find(i=>i.id===id);
      if (ex?.qty===1) return prev.filter(i=>i.id!==id);
      return prev.map(i=>i.id===id?{...i,qty:i.qty-1}:i);
    });
  };

  const handleLogin = (u) => {
    setUser(u);
    // restore cart from DB
    const saved = DB.getCart(u.id);
    if (saved.length > 0) setCartItems(saved);
    showNotif(`Welcome back, ${u.name.split(" ")[0]}! 👋`);
  };
  const handleLogout = () => {
    if (user) DB.setCart(user.id, cartItems);
    setUser(null); setCartItems([]);
    showNotif("Signed out successfully");
  };

  // Save cart to DB on change
  useEffect(() => { if (user) DB.setCart(user.id, cartItems); }, [cartItems, user]);

  const cartCount = cartItems.reduce((s,i)=>s+i.qty,0);
  const cartTotal = cartItems.reduce((s,i)=>s+i.price*i.qty,0);
  const allR = DB.getRestaurants();
  const filtered = allR.filter(r =>
    (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeCategory==="All" || r.category===activeCategory)
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f9f9f9", fontFamily:"'Segoe UI','Helvetica Neue',Arial,sans-serif" }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes slideIn { from{transform:translateX(80px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-thumb{background:#FC8019;border-radius:3px}
        button{font-family:inherit}
      `}</style>

      {/* Toast */}
      {notif && <div style={{ position:"fixed", top:74, right:18, zIndex:9999, background:"#FC8019", color:"white", padding:"10px 18px", borderRadius:10, fontWeight:700, fontSize:13, boxShadow:"0 4px 20px rgba(252,128,25,0.4)", animation:"slideIn 0.3s ease" }}>🛒 {notif}</div>}

      <Navbar cartCount={cartCount} cartTotal={cartTotal} onCartClick={()=>setIsCartOpen(true)}
        onHomeClick={()=>{setPage("home");setSelectedR(null);}}
        address={address} setAddress={setAddress}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        user={user} onLogin={handleLogin} onLogout={handleLogout}
        onOrdersClick={()=>setShowOrders(true)}
        onAdminClick={()=>setShowAdmin(true)} />

      {page==="home" && (
        <>
          <HeroBanner/>
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
            <RestaurantGrid list={filtered} onSelect={r=>{setSelectedR(r);setPage("restaurant");}} active={activeCategory} setActive={setActiveCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
          </div>
        </>
      )}

      {page==="restaurant" && selectedR && (
        <RestaurantDetail r={selectedR} cartItems={cartItems} onAdd={addToCart} onRemove={removeFromCart}
          onBack={()=>{setPage("home");setSelectedR(null);}} onCartClick={()=>setIsCartOpen(true)}/>
      )}

      <Cart isOpen={isCartOpen} onClose={()=>setIsCartOpen(false)} items={cartItems}
        onAdd={addToCart} onRemove={removeFromCart} onClear={()=>setCartItems([])}
        total={cartTotal} user={user}
        onOrderPlaced={()=>showNotif("Order placed successfully! 🎉")} />

      {showOrders && user && <OrderHistory user={user} onClose={()=>setShowOrders(false)}/>}
      {showAdmin && user?.role==="admin" && <AdminPanel onClose={()=>setShowAdmin(false)}/>}

      <Footer/>
    </div>
  );
}

