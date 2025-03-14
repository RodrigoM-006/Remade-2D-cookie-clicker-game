// Initial game state
let cookies = 0;
let cookiesPerClick = 1;
let upgrades = [
  { name: "Cursor", cost: 10, multiplier: 1, quantity: 0 },
  { name: "Grandma", cost: 50, multiplier: 2, quantity: 0 },
  { name: "Farm", cost: 100, multiplier: 5, quantity: 0 },
  { name: "Auto-Clicker", cost: 500, multiplier: 10, quantity: 0, interval: 1000 } // Auto-Clicker upgrade
];

// DOM elements
const cookieCountElement = document.getElementById("cookie-count");
const clickButton = document.getElementById("click-button");
const upgradesElement = document.getElementById("upgrades");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("load-button");

// Function to update the cookie count display
function updateCookieCount() {
  cookieCountElement.textContent = cookies;
  updateUpgradeButtons(); // Refresh upgrade buttons when cookies change
}

// Function to handle clicking the cookie
clickButton.addEventListener("click", () => {
  cookies += cookiesPerClick;
  updateCookieCount();
  animateClick(); // Add visual feedback
});

// Function to create upgrade buttons
function createUpgradeButtons() {
  upgradesElement.innerHTML = ""; // Clear existing buttons
  upgrades.forEach((upgrade, index) => {
    const upgradeButton = document.createElement("button");
    upgradeButton.className = "upgrade-button";
    upgradeButton.innerHTML = `
      <p>${upgrade.name}</p>
      <p>Cost: ${upgrade.cost} cookies</p>
      <p>Multiplier: ${upgrade.multiplier}x</p>
      <p>Quantity: ${upgrade.quantity}</p>
    `;
    upgradeButton.disabled = cookies < upgrade.cost; // Disable if not enough cookies
    upgradeButton.addEventListener("click", () => purchaseUpgrade(index));
    upgradesElement.appendChild(upgradeButton);
  });
}

// Function to handle purchasing upgrades
function purchaseUpgrade(index) {
  const upgrade = upgrades[index];
  if (cookies >= upgrade.cost) {
    cookies -= upgrade.cost;
    cookiesPerClick += upgrade.multiplier;
    upgrade.quantity++;
    upgrade.cost = Math.ceil(upgrade.cost * 1.15); // Increase cost by 15% after each purchase

    // Start auto-clicker if it's the Auto-Clicker upgrade
    if (upgrade.name === "Auto-Clicker") {
      startAutoClicker(upgrade);
    }

    updateCookieCount();
    animateUpgrade(); // Add visual feedback
  } else {
    alert("Not enough cookies!");
  }
}

// Function to start auto-clicker
function startAutoClicker(upgrade) {
  setInterval(() => {
    cookies += upgrade.multiplier * upgrade.quantity;
    updateCookieCount();
  }, upgrade.interval);
}

// Function to refresh upgrade buttons
function updateUpgradeButtons() {
  createUpgradeButtons();
}

// Function to save the game state
saveButton.addEventListener("click", () => {
  const gameState = {
    cookies,
    cookiesPerClick,
    upgrades,
  };
  localStorage.setItem("cookieClickerSave", JSON.stringify(gameState));
  alert("Game saved!");
});

// Function to load the game state
loadButton.addEventListener("click", () => {
  const savedGame = localStorage.getItem("cookieClickerSave");
  if (savedGame) {
    const gameState = JSON.parse(savedGame);
    cookies = gameState.cookies;
    cookiesPerClick = gameState.cookiesPerClick;
    upgrades = gameState.upgrades;
    updateCookieCount();
    updateUpgradeButtons();
    alert("Game loaded!");
  } else {
    alert("No saved game found!");
  }
});

// Function to animate cookie click
function animateClick() {
  clickButton.style.transform = "scale(0.95)";
  setTimeout(() => {
    clickButton.style.transform = "scale(1)";
  }, 100);
}

// Function to animate upgrade purchase
function animateUpgrade() {
  upgradesElement.style.backgroundColor = "#e0f7fa";
  setTimeout(() => {
    upgradesElement.style.backgroundColor = "";
  }, 300);
}

// Initialize the game
createUpgradeButtons();