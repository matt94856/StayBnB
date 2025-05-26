// --- Mock Data ---
const properties = [
  {
    id: 1,
    title: "Condo in Orlando",
    location: "Orlando, FL",
    price: 302,
    nights: 2,
    rating: 4.83,
    guestFavorite: true,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Home in Davenport",
    location: "Davenport, FL",
    price: 354,
    nights: 2,
    rating: 5.0,
    guestFavorite: true,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Home in Kissimmee",
    location: "Kissimmee, FL",
    price: 422,
    nights: 2,
    rating: 4.95,
    guestFavorite: true,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Tiny home in Orlando",
    location: "Orlando, FL",
    price: 330,
    nights: 2,
    rating: 4.97,
    guestFavorite: true,
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Home in Kissimmee",
    location: "Kissimmee, FL",
    price: 487,
    nights: 2,
    rating: 4.76,
    guestFavorite: false,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    title: "Home in Kissimmee",
    location: "Kissimmee, FL",
    price: 504,
    nights: 2,
    rating: 4.83,
    guestFavorite: false,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    title: "Home in Kissimmee",
    location: "Kissimmee, FL",
    price: 331,
    nights: 2,
    rating: 4.93,
    guestFavorite: true,
    image: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=600&q=80",
  },
];

// --- Utility: Favorites System ---
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}
function setFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}
function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  setFavorites(favs);
  renderListings();
}
function isFavorite(id) {
  return getFavorites().includes(id);
}

// --- Dynamic Property Card Generation ---
function createPropertyCard(property) {
  const card = document.createElement("div");
  card.className = "property-card";
  card.innerHTML = `
    <div class="property-image-wrapper">
      <img src="${property.image}" alt="${property.title}">
      ${property.guestFavorite ? '<span class="guest-fav-badge">Guest favorite</span>' : ''}
      <button class="save-btn${isFavorite(property.id) ? " saved" : ""}" title="Save for later" data-id="${property.id}">&#10084;</button>
    </div>
    <div class="property-card-content">
      <div class="property-title">${property.title}</div>
      <div class="property-location">${property.location}</div>
      <div class="property-meta">
        <span class="property-price">$${property.price} for ${property.nights} nights</span>
        <span class="property-rating">&#9733; ${property.rating}</span>
      </div>
      <div class="property-actions">
        <a href="booking.html" class="cta-btn">View Details</a>
      </div>
    </div>
  `;
  card.querySelector(".save-btn").addEventListener("click", e => {
    e.preventDefault();
    toggleFavorite(property.id);
  });
  return card;
}

// --- Render Listings (for homepage and listings page) ---
function renderListings() {
  // Homepage featured
  const featuredGrid = document.querySelector("#featured-listings .listings-grid");
  if (featuredGrid) {
    featuredGrid.innerHTML = "";
    properties.slice(0, 3).forEach(p => featuredGrid.appendChild(createPropertyCard(p)));
  }
  // Listings page
  const allGrid = document.getElementById("all-listings-grid");
  if (allGrid) {
    allGrid.innerHTML = "";
    let filtered = filterProperties();
    filtered.forEach(p => allGrid.appendChild(createPropertyCard(p)));
  }
}

// --- Search & Filter ---
function filterProperties() {
  let filtered = [...properties];
  const search = document.getElementById("search-input");
  const price = document.getElementById("price-filter");
  const guests = document.getElementById("guest-filter");
  if (search && search.value) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(search.value.toLowerCase()) ||
      p.location.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  if (price && price.value) {
    if (price.value === "1") filtered = filtered.filter(p => p.price < 200);
    if (price.value === "2") filtered = filtered.filter(p => p.price >= 200 && p.price < 300);
    if (price.value === "3") filtered = filtered.filter(p => p.price >= 300);
  }
  // Guests filter is a placeholder (no guest data in mock)
  return filtered;
}
function setupSearchFilters() {
  const search = document.getElementById("search-input");
  const price = document.getElementById("price-filter");
  const guests = document.getElementById("guest-filter");
  const btn = document.getElementById("search-btn");
  [search, price, guests, btn].forEach(el => {
    if (el) el.addEventListener("input", renderListings);
    if (el && el.tagName === "BUTTON") el.addEventListener("click", e => { e.preventDefault(); renderListings(); });
  });
}

// --- Booking Form Logic ---
function setupBookingForm() {
  const form = document.getElementById("booking-form");
  const propertySelect = document.getElementById("property");
  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const guests = document.getElementById("guests");
  const total = document.getElementById("estimated-total");
  if (propertySelect) {
    propertySelect.innerHTML = properties.map(p => `<option value="${p.id}">${p.title} (${p.location})</option>`).join("");
  }
  function updateTotal() {
    if (!propertySelect || !checkin || !checkout) return;
    const prop = properties.find(p => p.id == propertySelect.value);
    if (!prop) return;
    const d1 = new Date(checkin.value);
    const d2 = new Date(checkout.value);
    const nights = (d2 - d1) / (1000 * 60 * 60 * 24);
    if (nights > 0) {
      total.textContent = `$${nights * prop.price}`;
    } else {
      total.textContent = "$0";
    }
  }
  [propertySelect, checkin, checkout, guests].forEach(el => {
    if (el) el.addEventListener("change", updateTotal);
  });
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert("Booking submitted! (Prototype only)");
      form.reset();
      updateTotal();
    });
  }
}

// --- Navbar Hamburger Toggle ---
function setupNavbarToggle() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }
}

// --- Host Dashboard Collapsible Panels ---
function setupDashboardPanels() {
  const panels = document.querySelectorAll(".dashboard-panel");
  panels.forEach(panel => {
    const toggle = panel.querySelector(".panel-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        panel.classList.toggle("active");
      });
    }
  });
  // Add property form logic (mock)
  const addForm = document.getElementById("add-property-form");
  const hostList = document.getElementById("host-properties-list");
  if (addForm && hostList) {
    addForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = addForm["property-name"].value;
      const location = addForm["property-location"].value;
      const price = addForm["property-price"].value;
      hostList.innerHTML += `<div class='property-card'><div class='property-card-content'><div class='property-title'>${name}</div><div class='property-location'>${location}</div><div class='property-price'>$${price}/night</div></div></div>`;
      addForm.reset();
    });
  }
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  renderListings();
  setupSearchFilters();
  setupBookingForm();
  setupNavbarToggle();
  setupDashboardPanels();
}); 
