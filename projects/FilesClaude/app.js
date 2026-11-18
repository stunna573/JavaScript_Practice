/* BudgetBasics core: state, calculations, rendering, forms and tools. */
const CATS = ['Food', 'Transport', 'Education', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Communication', 'Subscriptions', 'Miscellaneous'];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const state = { income: 0, expenses: [], goals: [], history: [], monthKey: '', monthLabel: '' };

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '₦' + (Number.isFinite(n) ? Math.round(n) : 0).toLocaleString('en-NG');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
// Required amount: number > 0 and <= 10 billion, otherwise null.
const amount = v => { const n = parseFloat(String(v).replace(/,/g, '')); return Number.isFinite(n) && n > 0 && n <= 1e10 ? n : null; };
// Optional amount: blank = 0, otherwise 0..10 billion, or null when invalid.
const optAmount = v => { if (String(v).trim() === '') return 0; const n = parseFloat(String(v).replace(/,/g, '')); return Number.isFinite(n) && n >= 0 && n <= 1e10 ? n : null; };

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  $('#toasts').append(t);
  setTimeout(() => t.remove(), 3000);
}

// Confirmation dialog (native <dialog>: Escape + keyboard support built in).
function confirmBox(msg) {
  const dlg = $('#dlg');
  $('#dlgMsg').textContent = msg;
  dlg.returnValue = '';
  dlg.showModal();
  return new Promise(res => dlg.addEventListener('close', () => res(dlg.returnValue === 'yes'), { once: true }));
}

/* ---------- date / month (never hard-coded) ---------- */
function getMonth() {
  const d = new Date(), y = d.getFullYear(), m = d.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  return { key: `${y}-${m + 1}`, label: d.toLocaleString('en', { month: 'long', year: 'numeric' }), days, day: d.getDate(), left: days - d.getDate() + 1 };
}

/* ---------- data ---------- */
function loadData() {
  state.income = Store.get('income', 0);
  state.expenses = Store.get('expenses', []);
  state.goals = Store.get('goals', []);
  state.history = Store.get('history', []);
  state.monthKey = Store.get('current_month', '');
  state.monthLabel = Store.get('month_label', '');
}
function saveData() {
  Store.set('income', state.income); Store.set('expenses', state.expenses); Store.set('goals', state.goals);
  Store.set('history', state.history); Store.set('current_month', state.monthKey); Store.set('month_label', state.monthLabel);
}
// Archive the current month into history, then clear monthly figures (goals keep their savings).
function archiveMonth() {
  const c = calculateBudget();
  if (state.income || state.expenses.length) state.history.unshift({ label: state.monthLabel || getMonth().label, income: state.income, spent: c.spent, saved: c.added });
  state.expenses = [];
  state.goals.forEach(g => { g.added = 0; });
}
// Detect a new calendar month and preserve the previous one.
function checkMonthChange() {
  const m = getMonth();
  if (state.monthKey && state.monthKey !== m.key) { archiveMonth(); showToast('New month started. Last month is saved in history.'); }
  state.monthKey = m.key; state.monthLabel = m.label;
  saveData();
}

/* ---------- calculations ---------- */
function calculateBudget() {
  const spent = state.expenses.reduce((a, e) => a + e.amount, 0);
  const added = state.goals.reduce((a, g) => a + (g.added || 0), 0);
  const cats = {};
  state.expenses.forEach(e => { cats[e.cat] = (cats[e.cat] || 0) + e.amount; });
  const top = Object.entries(cats).sort((a, b) => b[1] - a[1])[0] || null;
  return { spent, added, remaining: state.income - spent - added, cats, top, pct: state.income ? spent / state.income * 100 : 0 };
}
const calculateRemainingBalance = () => calculateBudget().remaining;
function calculateSpendingPace(c = calculateBudget(), m = getMonth()) {
  return Math.max(c.remaining, 0) / Math.max(m.left, 1);
}
function goalStats(g) {
  const remaining = Math.max(g.target - g.saved, 0);
  const pct = Math.min(100, Math.round(g.saved / g.target * 100));
  let est = null;
  if (!remaining) est = 'done';
  else if (g.monthly > 0) {
    const months = Math.ceil(remaining / g.monthly);
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + months);
    est = { months, label: d.toLocaleString('en', { month: 'long', year: 'numeric' }) };
  }
  return { remaining, pct, est };
}
const calculateSavingsProgress = () => state.goals.map(g => ({ name: g.name, ...goalStats(g) }));

function calculateHealth(c) {
  if (!state.income) return '';
  const sv = c.added / state.income * 100;
  const t = c.pct > 100 ? 'Your spending is above your income.' : c.pct > 80 ? 'Your plan is tight this month.' : c.pct > 50 ? 'Your plan is on track.' : 'Your plan has room to spare.';
  return `${t} Numbers used: spent ${c.pct.toFixed(0)}% of income, saved ${sv.toFixed(0)}%, remaining ${money(c.remaining)}. This is a simple educational reading, not financial advice.`;
}
function calculateMonthlyAnalysis() {
  const c = calculateBudget(), out = [];
  if (!state.income && !state.expenses.length) return out;
  if (c.top) out.push(`${c.top[0]} is currently your largest expense category (${money(c.top[1])}, ${(c.top[1] / c.spent * 100).toFixed(0)}% of spending).`);
  if (state.income) {
    out.push(`You have spent ${c.pct.toFixed(0)}% of your income and set aside ${(c.added / state.income * 100).toFixed(0)}% for goals.`);
    if (c.added < state.income * 0.2) out.push(`Savings are below the 20% guideline (${money(state.income * 0.2)}). Guidelines can be adjusted to your situation.`);
  }
  if (c.remaining < 0) out.push(`You are ${money(-c.remaining)} over your income this month.`);
  state.goals.forEach(g => { const s = goalStats(g); out.push(`${g.name}: ${s.pct}% complete.`); });
  return out;
}

/* ---------- rendering ---------- */
function renderDashboard() {
  const m = getMonth(), c = calculateBudget();
  $('#monthLine').textContent = `${m.label} · Day ${m.day} of ${m.days} · ${m.left} days left (including today)`;
  $('#pvMonth').textContent = m.label;
  $('#pvIncome').textContent = money(state.income);
  $('#pvSpent').textContent = money(c.spent);
  $('#pvLeft').textContent = money(c.remaining);
  $('#pvBar').style.width = Math.min(100, c.pct) + '%';
  if (!state.income) {
    $('#stats').innerHTML = '<p class="empty">Add your monthly income to start planning.</p>';
    $('#pace').innerHTML = ''; return;
  }
  const S = (l, v, cls = '', extra = '') => `<div class="card stat ${cls}"><small class="mut">${l}</small><b>${money(v)}</b>${extra}</div>`;
  $('#stats').innerHTML = S('Income', state.income) + S('Spent', c.spent) + S('Saved this month', c.added) +
    S('Remaining', c.remaining, c.remaining < 0 ? 'neg' : '', c.remaining < 0 ? '<em>Over budget</em>' : '');
  $('#pace').innerHTML = `<b>Spending pace</b>
    <div class="bar ${c.pct > 100 ? 'over' : ''}"><i style="width:${Math.min(100, c.pct)}%"></i></div>
    <p>${c.pct.toFixed(0)}% of income spent. Average available per remaining day: <b>${money(calculateSpendingPace(c, m))}</b>
    (${money(Math.max(c.remaining, 0))} ÷ ${m.left} days). This is a simple planning estimate.</p>`;
}

function renderExpenses() {
  const list = $('#expList');
  if (!state.expenses.length) {
    list.innerHTML = '<li class="empty" style="display:block">No expenses yet. Add your first expense to start tracking your month.</li>';
    $('#catBars').innerHTML = ''; return;
  }
  list.innerHTML = [...state.expenses].sort((a, b) => b.date.localeCompare(a.date)).map(e => `
    <li><span class="tag">${esc(e.cat)}</span>
    <span class="grow">${esc(e.desc)}<br><small>${esc(e.date)}</small></span><b>${money(e.amount)}</b>
    <span><button class="btn sm ghost" data-act="edit" data-id="${e.id}" aria-label="Edit ${esc(e.desc)}">Edit</button>
    <button class="btn sm ghost" data-act="del" data-id="${e.id}" aria-label="Delete ${esc(e.desc)}">Delete</button></span></li>`).join('');
  const c = calculateBudget();
  $('#catBars').innerHTML = '<h4>By category</h4>' + Object.entries(c.cats).sort((a, b) => b[1] - a[1]).map(([k, v]) =>
    `<div>${esc(k)}: ${money(v)} (${(v / c.spent * 100).toFixed(0)}%)<div class="bar"><i style="width:${v / c.spent * 100}%"></i></div></div>`).join('');
}

function renderGoals() {
  const list = $('#goalList');
  if (!state.goals.length) { list.innerHTML = '<li class="empty" style="display:block">You don\'t have a savings goal yet. Create one above.</li>'; return; }
  list.innerHTML = state.goals.map(g => {
    const s = goalStats(g);
    const when = s.est === 'done' ? '<b class="ok">🎉 Goal Completed!</b>' :
      s.est ? `Estimated completion: <b>${s.est.label}</b> (${s.est.months} months)` : 'Add a monthly saving amount to see an estimate.';
    return `<li class="goal"><div class="row" style="justify-content:space-between"><b>${esc(g.name)}</b><span>${s.pct}%</span></div>
      <div class="bar"><i style="width:${s.pct}%"></i></div>
      <p class="mut">${money(g.saved)} / ${money(g.target)} · Remaining ${money(s.remaining)}</p><p>${when}</p>
      <div class="row"><input inputmode="decimal" placeholder="Amount" aria-label="Savings amount for ${esc(g.name)}">
      <button class="btn sm" data-act="contrib" data-id="${g.id}">Add savings</button>
      <button class="btn sm ghost" data-act="gedit" data-id="${g.id}">Edit</button>
      <button class="btn sm ghost" data-act="gdel" data-id="${g.id}">Delete</button></div></li>`;
  }).join('');
}

function renderAnalysis() {
  const c = calculateBudget(), items = calculateMonthlyAnalysis();
  $('#insights').innerHTML = !items.length ? '<p class="empty">Add income and expenses to see your analysis.</p>' :
    `<p class="notice">${esc(calculateHealth(c))}</p><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

function renderHistory() {
  $('#history').innerHTML = state.history.length ? state.history.map(h =>
    `<li><b>${esc(h.label)}</b><span>Income ${money(h.income)}</span><span>Spent ${money(h.spent)}</span><span>Saved ${money(h.saved)}</span></li>`).join('') :
    '<li class="empty" style="display:block">No archived months yet. Use "Start new month" when you are ready.</li>';
}
function renderAll() { renderDashboard(); renderExpenses(); renderGoals(); renderAnalysis(); renderHistory(); }

/* ---------- income ---------- */
function setIncome(value, errEl) {
  const n = amount(value);
  if (!n) { errEl.textContent = 'Enter an income above 0, using numbers only (for example 200000).'; return false; }
  errEl.textContent = '';
  state.income = n; saveData(); renderAll(); showToast('Budget updated.');
  return true;
}

/* ---------- expenses ---------- */
function resetExpenseForm() {
  const f = $('#expForm'); f.reset();
  f.elements.eid.value = ''; f.elements.date.value = new Date().toISOString().slice(0, 10);
  $('#expBtn').textContent = 'Add expense'; $('#expCancel').hidden = true; $('#expErr').textContent = '';
}
function addExpense(data) { state.expenses.push({ id: uid(), ...data }); showToast('Expense added successfully.'); }
function editExpense(id, data) { const e = state.expenses.find(x => x.id === id); if (e) Object.assign(e, data); showToast('Expense updated.'); }
function deleteExpense(id) { state.expenses = state.expenses.filter(x => x.id !== id); showToast('Expense deleted.'); }

/* ---------- goals ---------- */
function resetGoalForm() { $('#goalForm').reset(); $('#goalForm').elements.geid.value = ''; $('#goalBtn').textContent = 'Add goal'; $('#goalCancel').hidden = true; $('#goalErr').textContent = ''; }
function addGoal(data) { state.goals.push({ id: uid(), added: 0, ...data }); showToast('Goal created.'); }
function editGoal(id, data) { const g = state.goals.find(x => x.id === id); if (g) Object.assign(g, data); showToast('Goal updated.'); }
function deleteGoal(id) { state.goals = state.goals.filter(x => x.id !== id); showToast('Goal deleted.'); }

/* ---------- tools ---------- */
function analyzePurchase(name, price) {
  const c = calculateBudget(), after = c.remaining - price;
  let h = `<p><b>${esc(name)}</b> costs ${money(price)}</p>
    <ul><li>Available balance now: ${money(c.remaining)}</li><li>After purchase: ${money(after)}</li></ul>`;
  h += after >= 0 ? '<p class="ok">✔ Fits inside your remaining balance.</p>' : `<p class="err">✖ ${money(-after)} more than your remaining balance.</p>`;
  const active = state.goals.filter(g => g.monthly > 0 && g.saved < g.target);
  if (after < 0 && active.length) h += `<p>If that gap came from goal money, <b>${esc(active[0].name)}</b> would slip by about ${(-after / active[0].monthly).toFixed(1)} months.</p>`;
  else if (state.goals.length) h += '<p>Your goals are not affected unless you pay from money set aside for them.</p>';
  return h + '<p class="mut">Educational estimate from your entered numbers, not financial advice.</p>';
}

function render503020(income) {
  const parts = [['Needs', 50, 's1'], ['Wants', 30, 's2'], ['Savings', 20, 's3']];
  $('#r503020').innerHTML = '<div class="stack" role="img" aria-label="50 percent needs, 30 percent wants, 20 percent savings">' +
    parts.map(([l, p, c]) => `<span class="${c}" style="flex:${p}">${l} ${p}%</span>`).join('') + '</div>' +
    '<div class="grid">' + parts.map(([l, p]) => `<div class="card"><small class="mut">${l}</small><b class="big">${money(income * p / 100)}</b></div>`).join('') + '</div>';
}

let quizIndex = 0, quizScore = 0;
function renderQuiz() {
  const q = CONTENT.quiz[quizIndex], box = $('#quizBox');
  if (!q) {
    box.innerHTML = `<p class="big">Final score: ${quizScore} / ${CONTENT.quiz.length}</p><button class="btn" id="qRetry">Try Again</button>`;
    $('#qRetry').onclick = () => { quizIndex = 0; quizScore = 0; renderQuiz(); };
    return;
  }
  box.innerHTML = `<p class="mut">Question ${quizIndex + 1} of ${CONTENT.quiz.length} · Score ${quizScore}</p><p class="big">${esc(q.i)}</p>
    <div class="row"><button class="btn" data-a="need">Need</button><button class="btn" data-a="want">Want</button></div><div id="qFb" aria-live="polite"></div>`;
}
function answerQuiz(choice) {
  const q = CONTENT.quiz[quizIndex], right = (choice === 'need') === q.need;
  if (right) quizScore++;
  $$('#quizBox [data-a]').forEach(b => b.disabled = true);
  $('#qFb').innerHTML = `<p class="${right ? 'ok' : 'err'}">${right ? '✔ Matches our classification.' : '✖ Different from our classification.'} We classify this as a ${q.need ? 'need' : 'want'}. ${esc(q.why)}</p><button class="btn sm" id="qNext">Next</button>`;
  $('#qNext').onclick = () => { quizIndex++; renderQuiz(); };
}

/* ---------- static content, tips, clock ---------- */
function initializeContent() {
  $('#lessons').innerHTML = CONTENT.lessons.map(l => `<div class="card"><h3>${esc(l.t)}</h3><p>${esc(l.b)}</p></div>`).join('');
  $('#mistakes').innerHTML = CONTENT.mistakes.map(m => `<details><summary>${esc(m.t)}</summary>
    <p><b>Scenario:</b> ${esc(m.s)}</p><p><b>Why it matters:</b> ${esc(m.w)}</p><p><b>Do this:</b> ${esc(m.a)}</p></details>`).join('');
  $('#faq').innerHTML = CONTENT.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
  $('#eCat').innerHTML = CATS.map(c => `<option>${c}</option>`).join('');
  let tip = 0;
  const showTip = () => { $('#tipText').textContent = CONTENT.tips[tip]; tip = (tip + 1) % CONTENT.tips.length; };
  showTip();
  $('#nextTip').onclick = showTip;
  setInterval(showTip, 10000);
  renderQuiz();
  $('#year').textContent = new Date().getFullYear();
  // Demo counter: counts visits in THIS browser only, not a real global count.
  const v = Store.get('visits', 0) + 1; Store.set('visits', v); $('#visits').textContent = v;
}
function updateClock() { $('#clock').textContent = new Date().toLocaleString('en', { dateStyle: 'full', timeStyle: 'short' }); }

/* ---------- initialization (one place, runs once) ---------- */
function initializeNavigation() {
  const links = $('#links'), btn = $('#menuBtn');
  btn.onclick = () => { const o = links.classList.toggle('open'); btn.setAttribute('aria-expanded', o); };
  links.onclick = e => { if (e.target.tagName === 'A') { links.classList.remove('open'); btn.setAttribute('aria-expanded', false); } };
  $$('[data-go]').forEach(b => b.onclick = () => {
    const t = $('#' + b.dataset.go); t.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const i = $('input:not([type=hidden])', t); if (i) i.focus({ preventScroll: true });
  });
}
function initializeTheme() {
  const set = t => { document.documentElement.dataset.theme = t; Store.set('theme', t); };
  $('#themeBtn').onclick = () => set(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}
function initializeBudget() {
  $('#quick').addEventListener('submit', e => { e.preventDefault(); if (setIncome($('#qInc').value, $('#qErr'))) $('#plan').scrollIntoView({ behavior: 'smooth' }); });
  $('#incForm').addEventListener('submit', e => { e.preventDefault(); setIncome($('#inc').value, $('#incErr')); });
  $('#newMonth').onclick = async () => {
    if (await confirmBox('Save this month to history and start a new monthly budget?')) { archiveMonth(); saveData(); renderAll(); showToast('New month started.'); }
  };
  $('#resetBtn').onclick = async () => {
    if (await confirmBox('Reset my budget? This clears income, expenses, goals and history in this browser.')) {
      Store.clearBudget(); loadData(); checkMonthChange(); renderAll(); showToast('Budget reset.');
    }
  };
}
function initializeExpenses() {
  const f = $('#expForm'); resetExpenseForm();
  f.addEventListener('submit', e => {
    e.preventDefault();
    const x = f.elements, amt = amount(x.amt.value), desc = x.desc.value.trim(), date = x.date.value;
    const err = !date || isNaN(new Date(date)) ? 'Choose a valid date.' : !desc ? 'Add a short description.' : !amt ? 'Enter an amount above 0 (numbers only).' : '';
    $('#expErr').textContent = err; if (err) return;
    const data = { date, cat: x.cat.value, desc, amount: amt };
    x.eid.value ? editExpense(x.eid.value, data) : addExpense(data);
    saveData(); renderAll(); resetExpenseForm();
  });
  $('#expCancel').onclick = resetExpenseForm;
  $('#expList').addEventListener('click', async e => {
    const b = e.target.closest('button'); if (!b) return;
    const ex = state.expenses.find(x => x.id === b.dataset.id); if (!ex) return;
    if (b.dataset.act === 'edit') {
      const x = f.elements; x.eid.value = ex.id; x.date.value = ex.date; x.cat.value = ex.cat; x.desc.value = ex.desc; x.amt.value = ex.amount;
      $('#expBtn').textContent = 'Save changes'; $('#expCancel').hidden = false; f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (await confirmBox('Delete this expense?')) { deleteExpense(ex.id); saveData(); renderAll(); }
  });
}
function initializeGoals() {
  const f = $('#goalForm');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const x = f.elements, name = x.gname.value.trim(), target = amount(x.gtarget.value), saved = optAmount(x.gsaved.value), monthly = optAmount(x.gmonthly.value);
    const err = !name ? 'Name your goal.' : !target ? 'Enter a target above 0.' : saved === null || monthly === null ? 'Saved and monthly amounts must be numbers of 0 or more.' : '';
    $('#goalErr').textContent = err; if (err) return;
    const data = { name, target, saved, monthly };
    x.geid.value ? editGoal(x.geid.value, data) : addGoal(data);
    saveData(); renderAll(); resetGoalForm();
  });
  $('#goalCancel').onclick = resetGoalForm;
  $('#goalList').addEventListener('click', async e => {
    const b = e.target.closest('button'); if (!b) return;
    const g = state.goals.find(x => x.id === b.dataset.id); if (!g) return;
    if (b.dataset.act === 'contrib') {
      const n = amount(b.parentElement.querySelector('input').value);
      if (!n) { showToast('Enter a savings amount above 0.'); return; }
      g.saved += n; g.added = (g.added || 0) + n; saveData(); renderAll(); showToast('Savings added. Progress updated.');
    } else if (b.dataset.act === 'gedit') {
      const x = f.elements; x.geid.value = g.id; x.gname.value = g.name; x.gtarget.value = g.target; x.gsaved.value = g.saved; x.gmonthly.value = g.monthly;
      $('#goalBtn').textContent = 'Save changes'; $('#goalCancel').hidden = false; f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (b.dataset.act === 'gdel' && await confirmBox('Delete this goal?')) { deleteGoal(g.id); saveData(); renderAll(); }
  });
}
function initializeCalculators() {
  $('#f503020').addEventListener('submit', e => {
    e.preventDefault();
    const n = amount($('#i503020').value);
    if (!n) { $('#r503020').innerHTML = '<p class="err">Enter an income above 0 (numbers only).</p>'; return; }
    render503020(n);
  });
  $('#pForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#pItem').value.trim(), price = amount($('#pPrice').value);
    const err = !name ? 'Tell us what you want to buy.' : !price ? 'Enter a price above 0.' : !state.income ? 'Set your monthly income first so the plan has numbers to use.' : '';
    $('#pErr').textContent = err;
    $('#pResult').innerHTML = err ? '' : analyzePurchase(name, price);
  });
  $('#quizBox').addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b) answerQuiz(b.dataset.a); });
}

function initializeBudgetBasics() {
  loadData(); checkMonthChange();
  initializeContent(); initializeNavigation(); initializeTheme();
  initializeBudget(); initializeExpenses(); initializeGoals(); initializeCalculators();
  initializeChatbot();
  renderAll(); updateClock(); setInterval(updateClock, 30000);
}
document.addEventListener('DOMContentLoaded', initializeBudgetBasics);
