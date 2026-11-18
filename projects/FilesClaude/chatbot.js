/* BudgetBee: rule-based educational assistant.
   Flow: handleChatMessage -> generateChatResponse -> (goal match | findChatIntent) -> answer.
   It reads the user's local budget data and never gives financial advice. */
const BEE_SUGGEST = ['What is a budget?', 'How does 50/30/20 work?', 'What is a need?', 'How can I save money?',
  'How do I avoid overspending?', 'How much have I spent this month?', 'How much money do I have left?', 'What are my savings goals?', 'Can I afford this purchase?'];
const BEE_FALLBACK = "I'm currently focused on budgeting, saving, expenses, goals, and the BudgetBasics learning topics. Try asking me something about your budget or money habits.";
const NO_INCOME = 'Add your monthly income in My Month first, then I can work with your numbers.';

// Ordered intents: user-data questions first, then education. Regex = keywords + synonyms.
const BEE_INTENTS = [
  { r: /\b(hi|hello|hey|good (morning|afternoon|evening))\b/, a: "Hi! I'm BudgetBee 🐝. Ask me about budgeting, saving, needs vs wants, or your own month." },
  { r: /(how much|total).*\b(spent|spend)\b|\bmy expenses\b/, a: () => state.expenses.length ? `You have spent ${money(calculateBudget().spent)} across ${state.expenses.length} expenses this month.` : 'No expenses recorded yet. Add one in My Month and I can total it.' },
  { r: /\b(left|remaining|balance)\b/, a: () => { if (!state.income) return NO_INCOME; const c = calculateBudget(); return `Income ${money(state.income)} - spent ${money(c.spent)} - savings added ${money(c.added)} = ${money(c.remaining)} remaining.\nAbout ${money(calculateSpendingPace())} per remaining day.`; } },
  { r: /\bmy\b.*\bgoals?\b|\bgoals? (list|status)\b|what goals/, a: () => state.goals.length ? 'Your goals:\n' + state.goals.map(g => `• ${g.name}: ${goalStats(g).pct}% (${money(g.saved)} of ${money(g.target)})`).join('\n') : "You don't have a savings goal yet. Create one in My Month." },
  { r: /how much.*\b(saved|save)\b|\bmy savings\b|\bsaved so far\b/, a: () => { const t = state.goals.reduce((a, g) => a + g.saved, 0); return state.goals.length ? `Across your goals you have saved ${money(t)}; ${money(calculateBudget().added)} of it was added this month.` : "You haven't set a savings goal yet, so there is nothing tracked."; } },
  { r: /afford|can i buy/, a: (m) => {
      const n = amount((m.replace(/,/g, '').match(/\d+(\.\d+)?/) || [''])[0]);
      if (!n) return 'Use the "Can I afford it?" planner in Tools, or tell me a price, for example "Can I afford 50000?".';
      if (!state.income) return NO_INCOME;
      const after = calculateBudget().remaining - n;
      return `Remaining ${money(calculateBudget().remaining)} - purchase ${money(n)} = ${money(after)}.\n${after >= 0 ? 'It fits inside your remaining balance.' : 'It is more than your remaining balance.'} This is a simple calculation, not advice.`; } },
  { r: /50.?\/?.?30.?\/?.?20/, a: 'The 50/30/20 guideline splits income into about 50% needs, 30% wants and 20% savings. It is an educational starting point that you can adjust. Try the calculator in Tools.' },
  { r: /impulse/, a: 'Impulse buying is an unplanned purchase made on emotion. Try waiting 24 hours before non-essential buys.' },
  { r: /subscription/, a: 'Subscriptions are repeating charges. Review them monthly and cancel those you do not use.' },
  { r: /overspend|spending too much|control (my )?spending|avoid spending/, a: 'To avoid overspending: plan the month first, track every expense, set a limit per category, and wait before impulse buys.' },
  { r: /mistake/, a: 'Common money mistakes: impulse buying, ignoring small expenses, unused subscriptions, no plan, emotional spending, lifestyle inflation and not tracking. See Learn for examples.' },
  { r: /track|record/, a: 'Expense tracking means writing down what you spend as you spend it. Add each purchase in My Month; small purchases add up.' },
  { r: /analy|report|insight/, a: () => { const i = calculateMonthlyAnalysis(); return i.length ? 'Your monthly analysis:\n• ' + i.join('\n• ') : 'Add income and expenses first, then I can summarize your month.'; } },
  { r: /needs?\b.*\bwants?\b|difference between/, a: 'Needs are essentials (housing, food, transport to school, fees). Wants are optional extras (streaming, takeaways, upgrades). Try the Needs vs Wants quiz in Tools.' },
  { r: /\bneeds?\b/, a: 'A need is something essential to live, study or work: housing, basic food, school fees, essential health and transport.' },
  { r: /\bwants?\b/, a: 'A want is something nice but optional, like new sneakers, streaming or eating out. Wants are fine within your plan.' },
  { r: /\bsav(e|ing|ings)\b|save money/, a: 'Ways to save: set a specific target, save first when money arrives, track small purchases, and cut unused subscriptions. Even small regular amounts add up.' },
  { r: /\bgoals?\b/, a: 'A good savings goal has a name, a target amount and a monthly contribution. BudgetBasics divides what remains by your monthly saving to estimate the finish date.' },
  { r: /\bincome|allowance|salary/, a: 'Income is money you receive: allowance, salary, scholarships or part-time pay. Set it in My Month so everything else can be calculated.' },
  { r: /\bexpenses?\b|\bspending\b/, a: 'Expenses are money you spend. Fixed ones repeat (data, fees); variable ones change (food, outings).' },
  { r: /budget|plan my (money|month)/, a: 'A budget is a plan for your money: what comes in, what goes out and what you save. Start with your income, cover needs, choose a savings amount, then spend the rest on wants.' },
  { r: /who are you|what can you|\bhelp\b/, a: 'I can explain budgeting ideas and calculate from the numbers you enter: spending, balance left, savings goals and simple purchase checks. I cannot see bank accounts or give financial advice.' },
  { r: /thank/, a: "You're welcome! Keep tracking, small steps add up 🐝" }
];

function findChatIntent(msg) { return BEE_INTENTS.find(i => i.r.test(msg)); }

function generateChatResponse(raw) {
  const msg = raw.toLowerCase().replace(/[?!]/g, ' ').replace(/\s+/g, ' ').trim();
  if (/password|\bpin\b|card number|cvv/.test(msg)) return 'Please never share passwords, PINs or card numbers. I never need them and cannot access bank accounts.';
  // Goal-specific question, e.g. "How much do I need for my laptop?"
  const goal = state.goals.find(g => msg.includes(g.name.toLowerCase()));
  if (goal) {
    const s = goalStats(goal);
    return `${goal.name}: ${money(goal.saved)} of ${money(goal.target)} saved (${s.pct}%). You still need ${money(s.remaining)}.` +
      (s.est && s.est !== 'done' ? `\nAt ${money(goal.monthly)} a month: about ${s.est.months} months (${s.est.label}).` : s.est === 'done' ? '\n🎉 Goal completed!' : '');
  }
  const intent = findChatIntent(msg);
  if (!intent) return BEE_FALLBACK;
  return typeof intent.a === 'function' ? intent.a(msg) : intent.a;
}

function addChatMessage(who, text) {
  const d = document.createElement('div');
  d.className = 'msg ' + who; d.textContent = text; // textContent: user input is never parsed as HTML
  $('#beeLog').append(d); d.scrollIntoView({ block: 'end' });
}
function handleChatMessage(text) {
  text = String(text || '').trim();
  if (!text) return;
  addChatMessage('me', text);
  let reply;
  try { reply = generateChatResponse(text); } catch (e) { reply = BEE_FALLBACK; }
  setTimeout(() => addChatMessage('bot', reply), 250);
}

function renderChatbot() {
  $('#beeChips').innerHTML = BEE_SUGGEST.map(s => `<button type="button" class="chip">${esc(s)}</button>`).join('');
  addChatMessage('bot', "Hi! I'm BudgetBee 🐝 Ask me about budgeting, or about your own month: spending, money left, and goals.");
}
function initializeChatbot() {
  const btn = $('#beeBtn'), panel = $('#beePanel'), input = $('#beeInput');
  const toggle = open => { panel.hidden = !open; btn.setAttribute('aria-expanded', open); if (open) input.focus(); };
  btn.onclick = () => toggle(panel.hidden);
  $('#openBee').onclick = () => toggle(true);
  $('#beeClose').onclick = () => { toggle(false); btn.focus(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && !$('#dlg').open) toggle(false); });
  $('#beeForm').onsubmit = e => { e.preventDefault(); handleChatMessage(input.value); input.value = ''; };
  $('#beeChips').onclick = e => { if (e.target.classList.contains('chip')) handleChatMessage(e.target.textContent); };
  renderChatbot();
}
