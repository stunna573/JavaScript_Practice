/* Educational content. Embedded in JS so the site works when opened directly from disk. */
const CONTENT = {
  lessons: [
    { t: 'Budgeting basics', b: 'A budget is a plan for your money: what comes in, what goes out, and what you set aside.' },
    { t: 'Income', b: 'Money you receive: allowance, salary, scholarships, part-time pay. Know your real monthly total first.' },
    { t: 'Expenses', b: 'Money you spend. Fixed expenses repeat (rent, data); variable ones change (food, outings).' },
    { t: 'Needs', b: 'Things you must have to live and study: housing, basic food, transport to school, fees, essential health.' },
    { t: 'Wants', b: 'Things that improve life but are optional: new sneakers, takeaways, streaming, games.' },
    { t: 'Savings', b: 'Money you keep for later. Even small, regular amounts add up faster than occasional big ones.' },
    { t: 'Budget planning', b: 'Start with income, list needs, choose a savings amount, then give what remains to wants.' },
    { t: 'Goal setting', b: 'Give each goal a name, target, and monthly amount. "Laptop: ₦400,000 in 8 months" beats "save more".' },
    { t: 'Spending habits', b: 'Small daily purchases repeat. Tracking them for a month shows where money really goes.' }
  ],
  mistakes: [
    { t: 'Impulse buying', s: 'You see a sale on your phone and buy sneakers you did not plan for.', w: 'Unplanned buys quietly eat your savings.', a: 'Wait 24 hours before any non-essential purchase.' },
    { t: 'Ignoring small expenses', s: '₦1,500 snacks every day feels tiny.', w: 'It becomes ₦45,000 in a 30-day month.', a: 'Log every small purchase for two weeks.' },
    { t: 'Late payments', s: 'You forget a bill due date.', w: 'Late fees and stress add avoidable cost.', a: 'Put due dates in your phone calendar.' },
    { t: 'Unused subscriptions', s: 'Three streaming and app plans, but you use one.', w: 'You pay for things you never use.', a: 'Review subscriptions monthly and cancel extras.' },
    { t: 'Spending without a plan', s: 'Money is gone by week three and you are unsure why.', w: 'Without a plan, needs get squeezed.', a: 'Plan the month on day one.' },
    { t: 'Emotional spending', s: 'A bad day ends with online shopping.', w: 'Spending to feel better rarely lasts.', a: 'Pause, take a walk, then decide.' },
    { t: 'Lifestyle inflation', s: 'Your allowance rises, and so does your spending.', w: 'Savings never grow if costs match income.', a: 'Save part of any raise before spending it.' },
    { t: 'Not tracking expenses', s: 'You guess what you spent.', w: 'Guesses are usually too low.', a: 'Record expenses in the planner as you spend.' }
  ],
  quiz: [
    { i: 'School fees', need: true, why: 'Education access is an essential need.' },
    { i: 'New sneakers (you already have a pair)', need: false, why: 'Nice to have, but optional.' },
    { i: 'Basic groceries', need: true, why: 'Food is essential to live.' },
    { i: 'Streaming subscription', need: false, why: 'Entertainment is a want.' },
    { i: 'Transport to school', need: true, why: 'You need it to attend classes.' },
    { i: 'Latest phone upgrade', need: false, why: 'A working phone may be a need; the upgrade is a want.' },
    { i: 'Medicine prescribed by a doctor', need: true, why: 'Health essentials are needs.' },
    { i: 'Restaurant dinner with friends', need: false, why: 'Enjoyable, but a want.' }
  ],
  tips: [
    'Track small purchases.',
    'Give yourself time before impulse purchases.',
    'Set a specific savings target.',
    'Review subscriptions regularly.',
    'Pay yourself first: move savings out as soon as money arrives.',
    'Plan the month before spending anything.'
  ],
  faq: [
    { q: 'What is BudgetBasics?', a: 'A free educational tool to learn budgeting and plan your month.' },
    { q: 'Is BudgetBasics a bank?', a: 'No. It never connects to banks or moves money.' },
    { q: 'How is my data stored?', a: 'Only in this browser (localStorage). Nothing is sent to a server.' },
    { q: 'What is 50/30/20?', a: 'A guideline: about 50% needs, 30% wants, 20% savings. Adjust it to your situation.' },
    { q: 'How are savings goals calculated?', a: 'Remaining = target - saved. Months = remaining ÷ monthly saving, rounded up.' },
    { q: 'Does BudgetBee give financial advice?', a: 'No. It gives basic educational information and calculations from what you enter.' },
    { q: 'Can I use BudgetBasics on mobile?', a: 'Yes. The layout adapts to phones and tablets.' }
  ]
};
