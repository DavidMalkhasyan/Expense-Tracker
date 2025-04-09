const Income = require("../models/Income");
const Expense = require("../models/Expens");
const FileService = require("./FileService");

class FinanceService {
    constructor(
        expensFileName = "../Expense-Tracker/Data/expens.json",
        incomeFileName = "../Expense-Tracker/Data/income.json"
    ) {
        this.expensFileName = expensFileName;
        this.incomeFileName = incomeFileName;
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
      FileService.saveToFile(this.expensFileName, this.expensArr);
    }
    
    saveIncome() {
      FileService.saveToFile(this.incomeFileName,this.incomeArr);
    }

    load() {
        const incomeData = FileService.loadFromFile(this.incomeFileName);
    
        if (incomeData) {
            this.incomeArr = incomeData.map(
                (i) => new Income(i.name, i.amount)
            );
        }
    
        const expenseData = FileService.loadFromFile(this.expensFileName);
        if (expenseData) {
            this.expensArr = expenseData.map(
                (e) => new Expense(e.name, e.amount)
            );
        }
    }
    
}

module.exports = FinanceService;
