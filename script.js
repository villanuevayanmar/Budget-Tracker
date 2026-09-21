let currentUser = "";
let userData = { income: 0, expense: 0 };

document.getElementById("btn-login").addEventListener("click", loginUser);
document.getElementById("btn-save").addEventListener("click", addTransaction);
document.getElementById("btn-logout").addEventListener("click", logout);

function loginUser() {
    const nameInput = document.getElementById("user-name").value.trim();
    if (!nameInput) {
        alert("Please enter a valid name!");
        return;
    }
    currentUser = nameInput.toLowerCase();
    
    const savedData = localStorage.getItem(`budget_${currentUser}`);
    if (savedData) {
        userData = JSON.parse(savedData);
    } else {
        userData = { income: 0, expense: 0 };
        saveToStorage();
    }

    document.getElementById("display-name").innerText = nameInput;
    document.getElementById("login-card").classList.add("hidden");
    document.getElementById("dashboard-card").classList.remove("hidden");
    updateUI();
}

function addTransaction() {
    const type = document.getElementById("trans-type").value;
    const amount = parseFloat(document.getElementById("trans-amount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
    }

    if (type === "income") {
        userData.income += amount;
    } else {
        userData.expense += amount;
    }

    saveToStorage();
    updateUI();
    document.getElementById("trans-amount").value = ""; 
}

function updateUI() {
    document.getElementById("total-income").innerText = `₱${userData.income.toFixed(2)}`;
    document.getElementById("total-expense").innerText = `₱${userData.expense.toFixed(2)}`;
    
    const net = userData.income - userData.expense;
    const netDiv = document.getElementById("net-balance");
    netDiv.innerText = `Net Balance: ₱${net.toFixed(2)}`;
    
    if (net >= 0) {
        netDiv.style.backgroundColor = "#e8f5e9";
        netDiv.style.color = "#2e7d32";
    } else {
        netDiv.style.backgroundColor = "#ffebee";
        netDiv.style.color = "#c62828";
    }
}

function saveToStorage() {
    localStorage.setItem(`budget_${currentUser}`, JSON.stringify(userData));
}

function logout() {
    document.getElementById("user-name").value = "";
    document.getElementById("login-card").classList.remove("hidden");
    document.getElementById("dashboard-card").classList.add("hidden");
}
