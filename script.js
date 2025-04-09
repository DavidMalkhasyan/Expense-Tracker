class Income {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
        this.date = new Date();
    }
}

class Expense {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
        this.date = new Date();
    }
}

class FileService {
    static saveToFile(key, data) {
        if (!key) throw new Error("Storage key is undefined");
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`${key}:`, e.message);
        }
    }

    static loadFromFile(key) {
        if (!key) return [];
        try {
            const rawData = localStorage.getItem(key);
            if (!rawData || !rawData.trim()) return [];
            return JSON.parse(rawData);
        } catch (e) {
            console.error(`${key}:`, e.message);
            return [];
        }
    }
}

class FinanceService {
    constructor(expensStorageKey = "incomes", incomeStorageKey = "expenses") {
        this.expensStorageKey = expensStorageKey;
        this.incomeStorageKey = incomeStorageKey;
        this.incomeArr = [];
        this.expensArr = [];

        this.load();
    }

    get totalIncome() {
        return this.incomeArr.reduce((sum, i) => sum + i.amount, 0);
    }

    get totalExpense() {
        return this.expensArr.reduce((sum, e) => sum + e.amount, 0);
    }

    get totalBalance() {
        return this.totalIncome - this.totalExpense;
    }

    addIncome(name, amount) {
        this.incomeArr.push(new Income(name, amount));
        this.saveIncome();
    }

    addExpense(name, amount) {
        this.expensArr.push(new Expense(name, amount));
        this.saveExpens();
    }

    deleteByName(name) {
        this.incomeArr = this.incomeArr.filter((i) => i.name !== name);
        this.expensArr = this.expensArr.filter((e) => e.name !== name);
        this.saveIncome();
        this.saveExpens();
    }

    editByName(name, newName, newAmount) {
        const income = this.incomeArr.find((i) => i.name === name);
        if (income) {
            if (newName !== undefined) income.name = newName;
            if (newAmount !== undefined) income.amount = newAmount;
        }

        const expense = this.expensArr.find((e) => e.name === name);
        if (expense) {
            if (newName !== undefined) expense.name = newName;
            if (newAmount !== undefined) expense.amount = newAmount;
        }

        this.saveIncome();
        this.saveExpens();
    }

    getIncomes() {
        return this.incomeArr;
    }

    getExpenses() {
        return this.expensArr;
    }

    getSummary() {
        return {
            totalIncome: this.totalIncome,
            totalExpense: this.totalExpense,
            totalBalance: this.totalBalance,
        };
    }

    saveExpens() {
        FileService.saveToFile(this.expensStorageKey, this.expensArr);
    }

    saveIncome() {
        FileService.saveToFile(this.incomeStorageKey, this.incomeArr);
    }

    load() {
        const incomeData = FileService.loadFromFile(this.incomeStorageKey);

        if (incomeData) {
            this.incomeArr = incomeData.map(
                (i) => new Income(i.name, i.amount)
            );
        }

        const expenseData = FileService.loadFromFile(this.expensStorageKey);
        if (expenseData) {
            this.expensArr = expenseData.map(
                (e) => new Expense(e.name, e.amount)
            );
        }
    }
}

class UI {
    constructor() {
        this.incomeList = document.querySelector("#income-list");
        this.expenseList = document.querySelector("#expense-list");
    }

    renderIncome(income) {
        const li = document.createElement("li");
        li.textContent = `${income.name}: $${income.amount}`;
        this.incomeList.appendChild(li);
    }

    renderExpense(expense) {
        const li = document.createElement("li");
        li.textContent = `${expense.name}: $${expense.amount}`;
        this.expenseList.appendChild(li);
    }

    renderSummary(summary) {
        const summaryDiv = document.querySelector(".summary__section");
        summaryDiv.innerHTML = `
            <p class="summary__label">Total Income: $${summary.totalIncome}</p>
            <p class="summary__label">Total Expense: $${summary.totalExpense}</p>
            <p class="summary__label">Total Balance: $${summary.totalBalance}</p>
        `;
      }

      renderAll(income,expense,summary){
          income.map((e) => this.renderIncome(e))
          expense.map((e) =>this.renderExpense(e))
          this.renderSummary(summary)
      }
}


const incomeSub = document.querySelector(".income-input__submit");
const expensSub = document.querySelector(".expense-input__submit");

const financeService = new FinanceService();
const ui = new UI();

ui.renderAll(financeService.getIncomes(),financeService.getExpenses(),financeService.getSummary());

incomeSub.addEventListener("click", (e) => {
    const name = document.querySelector(".income_name").value;
    const amount = parseFloat(document.querySelector(".income_amount").value);

    if (name.trim() === "" || isNaN(amount)) {
        alert("Please fill all fields");
        return;
    }

    financeService.addIncome(name, amount);
    ui.renderIncome(new Income(name, amount));

    ui.renderSummary(financeService.getSummary());

    document.querySelector(".income_name").value = "";
    document.querySelector(".income_amount").value = "";
});

expensSub.addEventListener("click", (e) => {
    const name = document.querySelector(".expense_name").value;
    const amount = parseFloat(document.querySelector(".expense_amount").value);

    if (name.trim() === "" || isNaN(amount)) {
        alert("Please fill all fields");
        return;
    }

    financeService.addExpense(name, amount);
    ui.renderExpense(new Expense(name, amount));
    ui.renderSummary(financeService.getSummary());
    
    document.querySelector(".expense_name").value = "";
    document.querySelector(".expense_amount").value = "";
});


