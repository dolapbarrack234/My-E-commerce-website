// ========== CART FUNCTIONS ==========
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
    loadCart();
}

function loadCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    const cartTotalSpan = document.getElementById("cart-total");
    if (!cartItemsDiv) return; // only run on cart page

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsDiv.innerHTML = "";

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <span>${item.name} ($${item.price})</span>
                <span>Qty: ${item.quantity}</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });

    cartTotalSpan.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        alert("⚠️ Please login first to checkout.");
        window.location.href = "login.html";
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // ===== Save order history =====
    let allOrders = JSON.parse(localStorage.getItem("orders")) || {};
    if (!allOrders[currentUser.email]) {
        allOrders[currentUser.email] = [];
    }
    allOrders[currentUser.email].push({
        items: cart,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("orders", JSON.stringify(allOrders));

    alert(`✅ Purchase successful! Thank you, ${currentUser.name}.`);
    localStorage.removeItem("cart");
    loadCart();
}

// ========== AUTH FUNCTIONS ==========
function signup(e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === email)) {
        alert("Email already exists!");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    showLogin();
}

function login(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(`Welcome back, ${user.name}!`);
    window.location.href = "index.html";
}

function logout() {
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
    window.location.href = "index.html";
}

function showSignup() {
    document.getElementById("signup-box").style.display = "block";
    document.querySelector(".auth .form-container").style.display = "none";
}

function showLogin() {
    document.getElementById("signup-box").style.display = "none";
    document.querySelector(".auth .form-container").style.display = "block";
}

// ========== ORDERS FUNCTIONS ==========
function loadOrders() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const ordersList = document.getElementById("orders-list");

    if (!ordersList) return; // only run on orders.html

    if (!currentUser) {
        ordersList.innerHTML = "<p>Please <a href='login.html'>login</a> to see your orders.</p>";
        return;
    }

    let allOrders = JSON.parse(localStorage.getItem("orders")) || {};
    let myOrders = allOrders[currentUser.email] || [];

    if (myOrders.length === 0) {
        ordersList.innerHTML = "<p>You have no orders yet.</p>";
        return;
    }

    ordersList.innerHTML = myOrders.map(order => `
        <div class="order">
            <h3>Order on ${order.date}</h3>
            <ul>
                ${order.items.map(i => `<li>${i.name} - $${i.price} x ${i.quantity}</li>`).join("")}
            </ul>
        </div>
    `).join("");
}

// ========== AUTO LOAD ==========
window.onload = () => {
    loadCart();   // auto load cart items if on cart.html
    loadOrders(); // auto load orders if on orders.html
};
