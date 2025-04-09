  class Expense {
    constructor(name, amount) {
      this.name = name;
      this.amount = amount;
      this.date = new Date();
    }
  }

  module.exports = Expense;
