const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const userDisplay = document.getElementById('user-display');

const typeInput = document.getElementById('type');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addBtn = document.getElementById('add-btn');

const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const netBalanceEl = document.getElementById('net-balance');
const incomeList = document.getElementById('income-list');
const expenseList = document.getElementById('expense-list');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentUser = localStorage.getItem('budgetUser') || '';

if (currentUser) {
    showDashboard(currentUser);
}

loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('budgetUser', username);
        showDashboard(username);
    }
});

function showDashboard(name) {
    currentUser = name;
    userDisplay.textContent = name;
    loginContainer.style.display = 'block';
    loginContainer.classList.add('dashboard-active');
    dashboardContainer.style.display = 'block';
    renderTransactions();
}

addBtn.addEventListener('click', () => {
    const type = typeInput.value;
    const description = descriptionInput.value.trim() || (type === 'income' ? 'Income' : 'Expense');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid positive amount.');
        return;
    }

    const transaction = {
        id: Date.now(),
        type,
        description,
        amount
    };

    transactions.push(transaction);
    saveAndRender();
    
    amountInput.value = '';
    descriptionInput.value = '';
});

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
}

function renderTransactions() {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';

    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach(t => {
        const li = document.createElement('li');
        li.classList.add(t.type);

        if (t.type === 'income') {
            incomeTotal += t.amount;
            li.innerHTML = `
                <div>
                    ${t.description}
                </div>
                <div>
                    <span class="amount">+₱${t.amount.toFixed(2)}</span>
                    <button class="delete-btn" onclick="deleteTransaction(${t.id})">×</button>
                </div>
            `;
            incomeList.appendChild(li);
        } else {
            expenseTotal += t.amount;
            li.innerHTML = `
                <div>
                    ${t.description}
                </div>
                <div>
                    <span class="amount">-₱${t.amount.toFixed(2)}</span>
                    <button class="delete-btn" onclick="deleteTransaction(${t.id})">×</button>
                </div>
            `;
            expenseList.appendChild(li);
        }
    });

    const netBalance = incomeTotal - expenseTotal;

    totalIncomeEl.textContent = `₱${incomeTotal.toFixed(2)}`;
    totalExpensesEl.textContent = `₱${expenseTotal.toFixed(2)}`;
    netBalanceEl.textContent = `Net Balance: ₱${netBalance.toFixed(2)}`;
}
