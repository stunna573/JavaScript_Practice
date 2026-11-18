/* Centralized localStorage access. Nothing else touches localStorage. */
const Store = {
  prefix: 'budgetbasics_',
  get(name, fallback) {
    try {
      const v = localStorage.getItem(this.prefix + name);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set(name, value) {
    try { localStorage.setItem(this.prefix + name, JSON.stringify(value)); } catch (e) { /* storage full/blocked */ }
  },
  clearBudget() {
    ['income', 'expenses', 'goals', 'history', 'current_month', 'month_label'].forEach(k => {
      try { localStorage.removeItem(this.prefix + k); } catch (e) {}
    });
  }
};
