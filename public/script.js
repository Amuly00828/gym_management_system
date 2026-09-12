const CATEGORIES = [
  {
    key: 'basic',
    title: 'Basic Queries',
    sub: 'Fundamental SELECT statements over the core tables.',
    actions: [
      { label: 'All members', method: 'GET', url: '/api/basic/members' },
      {
        label: 'Plans above price', method: 'GET', url: '/api/basic/plans-above',
        fields: [{ name: 'minPrice', placeholder: '5000', type: 'number' }]
      },
      {
        label: 'Members joined after date', method: 'GET', url: '/api/basic/members-joined-after',
        fields: [{ name: 'date', placeholder: 'YYYY-MM-DD', type: 'date' }]
      },
      { label: 'Active memberships', method: 'GET', url: '/api/basic/active-memberships' },
      {
        label: 'Trainers by specialization', method: 'GET', url: '/api/basic/trainers-by-specialization',
        fields: [{ name: 'specialization', placeholder: 'Yoga', type: 'text' }]
      }
    ]
  },
  {
    key: 'joins',
    title: 'Joins',
    sub: 'Combining Members, Trainers, Plans, Memberships and Payments.',
    actions: [
      { label: 'Members with plans', method: 'GET', url: '/api/joins/member-plans' },
      { label: 'Trainers with assigned members', method: 'GET', url: '/api/joins/trainer-members' },
      { label: 'Membership details', method: 'GET', url: '/api/joins/membership-details' },
      { label: 'Members with payments', method: 'GET', url: '/api/joins/member-payments' },
      { label: 'Plans with members', method: 'GET', url: '/api/joins/plan-members' }
    ]
  },
  {
    key: 'aggregate',
    title: 'Aggregate',
    sub: 'COUNT, AVG, SUM and grouped summaries.',
    actions: [
      { label: 'Total members', method: 'GET', url: '/api/aggregate/total-members' },
      { label: 'Average plan price', method: 'GET', url: '/api/aggregate/average-plan-price' },
      { label: 'Total revenue', method: 'GET', url: '/api/aggregate/total-revenue' },
      { label: 'Highest plan price', method: 'GET', url: '/api/aggregate/highest-plan-price' },
      { label: 'Members per plan', method: 'GET', url: '/api/aggregate/members-per-plan' }
    ]
  },
  {
    key: 'subqueries',
    title: 'Subqueries',
    sub: 'Nested SELECTs for comparisons and filtering.',
    actions: [
      { label: 'Members without memberships', method: 'GET', url: '/api/subqueries/members-without-memberships' },
      { label: 'Plans above average price', method: 'GET', url: '/api/subqueries/plans-above-average' },
      { label: 'Highest spending member', method: 'GET', url: '/api/subqueries/highest-spending-member' },
      { label: 'Plans with minimum price', method: 'GET', url: '/api/subqueries/plans-min-price' },
      { label: 'Members above average spending', method: 'GET', url: '/api/subqueries/members-above-average-spending' }
    ]
  },
  {
    key: 'updates',
    title: 'Updates & Deletes',
    sub: 'Mutating statements. These change data in the live database.',
    actions: [
      {
        label: 'Update plan price', method: 'PUT', url: '/api/updates/plan-price',
        fields: [{ name: 'plan_id', placeholder: 'plan_id', type: 'number' }, { name: 'new_price', placeholder: 'new_price', type: 'number' }],
        body: true
      },
      {
        label: 'Change member email', method: 'PUT', url: '/api/updates/member-email',
        fields: [{ name: 'member_id', placeholder: 'member_id', type: 'number' }, { name: 'email', placeholder: 'new email', type: 'text' }],
        body: true
      },
      { label: 'Delete inactive members', method: 'DELETE', url: '/api/updates/inactive-members', danger: true },
      {
        label: 'Update trainer details', method: 'PUT', url: '/api/updates/trainer-details',
        fields: [
          { name: 'trainer_id', placeholder: 'trainer_id', type: 'number' },
          { name: 'trainer_name', placeholder: 'name (optional)', type: 'text' },
          { name: 'specialization', placeholder: 'specialization (optional)', type: 'text' },
          { name: 'phone', placeholder: 'phone (optional)', type: 'text' }
        ],
        body: true
      },
      { label: 'Delete expired memberships', method: 'DELETE', url: '/api/updates/expired-memberships', danger: true }
    ]
  },
  {
    key: 'views',
    title: 'Views',
    sub: 'Reusable saved queries created once in the database.',
    actions: [
      { label: 'Membership details view', method: 'GET', url: '/api/views/membership-details' },
      { label: 'Payment summary view', method: 'GET', url: '/api/views/payment-summary' },
      { label: 'Member plans view', method: 'GET', url: '/api/views/member-plans' },
      { label: 'Trainer assignments view', method: 'GET', url: '/api/views/trainer-assignments' },
      { label: 'Active memberships view', method: 'GET', url: '/api/views/active-memberships' }
    ]
  },
  {
    key: 'procedures',
    title: 'Stored Procedures',
    sub: 'PL/pgSQL procedures and functions called directly.',
    actions: [
      {
        label: 'Insert a new member', method: 'POST', url: '/api/procedures/insert-member',
        fields: [
          { name: 'member_name', placeholder: 'name', type: 'text' },
          { name: 'email', placeholder: 'email', type: 'text' },
          { name: 'phone', placeholder: 'phone', type: 'text' },
          { name: 'join_date', placeholder: 'YYYY-MM-DD', type: 'date' }
        ],
        body: true
      },
      {
        label: 'Update plan price (proc)', method: 'POST', url: '/api/procedures/update-plan-price',
        fields: [{ name: 'plan_id', placeholder: 'plan_id', type: 'number' }, { name: 'new_price', placeholder: 'new_price', type: 'number' }],
        body: true
      },
      {
        label: 'Memberships of a member', method: 'GET', url: '/api/procedures/member-memberships',
        pathParam: 'member_id'
      },
      { label: 'Total revenue (function)', method: 'GET', url: '/api/procedures/total-revenue' },
      {
        label: 'Members of a plan', method: 'GET', url: '/api/procedures/plan-members',
        pathParam: 'plan_id'
      }
    ]
  },
  {
    key: 'reports',
    title: 'Reports / Analysis',
    sub: 'Higher-level business questions built on top of the schema.',
    actions: [
      { label: 'Top 5 popular plans', method: 'GET', url: '/api/reports/top-plans' },
      { label: 'Most active members', method: 'GET', url: '/api/reports/most-active-members' },
      { label: 'Monthly revenue report', method: 'GET', url: '/api/reports/monthly-revenue' },
      { label: 'Highest revenue plan', method: 'GET', url: '/api/reports/highest-revenue-plan' },
      { label: 'Member spending analysis', method: 'GET', url: '/api/reports/member-spending' },
      { label: 'Trainer performance report', method: 'GET', url: '/api/reports/trainer-performance' }
    ]
  }
];

const nav = document.getElementById('nav');
const actionRow = document.getElementById('action-row');
const formRow = document.getElementById('form-row');
const resultBody = document.getElementById('result-body');
const resultMeta = document.getElementById('result-meta');
const sectionTitle = document.getElementById('section-title');
const sectionSub = document.getElementById('section-sub');

let activeCategory = CATEGORIES[0];
let activeAction = null;

function renderNav() {
  nav.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'nav-btn' + (cat.key === activeCategory.key ? ' active' : '');
    btn.innerHTML = `<span>${cat.title}</span><span class="count">${cat.actions.length}</span>`;
    btn.onclick = () => {
      activeCategory = cat;
      activeAction = null;
      renderAll();
    };
    nav.appendChild(btn);
  });
}

function renderActions() {
  sectionTitle.textContent = activeCategory.title;
  sectionSub.textContent = activeCategory.sub;
  actionRow.innerHTML = '';
  activeCategory.actions.forEach(action => {
    const btn = document.createElement('button');
    btn.className = 'query-btn';
    btn.textContent = action.label;
    btn.onclick = () => selectAction(action, btn);
    actionRow.appendChild(btn);
  });
}

function selectAction(action, btnEl) {
  activeAction = action;
  document.querySelectorAll('.query-btn').forEach(b => b.classList.remove('primary'));
  if (btnEl) btnEl.classList.add('primary');

  formRow.innerHTML = '';
  const needsForm = (action.fields && action.fields.length) || action.pathParam || action.danger;

  if (action.fields && action.fields.length) {
    action.fields.forEach(f => {
      const label = document.createElement('label');
      label.textContent = f.name;
      const input = document.createElement('input');
      input.type = f.type || 'text';
      input.placeholder = f.placeholder || '';
      input.dataset.field = f.name;
      label.appendChild(input);
      formRow.appendChild(label);
    });
  }

  if (action.pathParam) {
    const label = document.createElement('label');
    label.textContent = action.pathParam;
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = action.pathParam;
    input.dataset.field = '__path';
    label.appendChild(input);
    formRow.appendChild(label);
  }

  const run = document.createElement('button');
  run.className = 'query-btn primary';
  run.textContent = action.danger ? 'Confirm & Run' : 'Run query';
  run.onclick = () => executeAction(action);
  formRow.appendChild(run);

  formRow.hidden = !needsForm && false; // always show the run row
  formRow.hidden = false;
}

async function executeAction(action) {
  resultBody.innerHTML = '<p class="placeholder">Running…</p>';
  resultMeta.textContent = '';

  let url = action.url;
  const inputs = Array.from(formRow.querySelectorAll('input'));
  const values = {};
  inputs.forEach(i => { values[i.dataset.field] = i.value; });

  if (action.pathParam && values.__path) {
    url = `${url}/${encodeURIComponent(values.__path)}`;
  } else if (action.fields && action.fields.length && action.method === 'GET') {
    const params = new URLSearchParams();
    action.fields.forEach(f => { if (values[f.name]) params.append(f.name, values[f.name]); });
    const qs = params.toString();
    if (qs) url = `${url}?${qs}`;
  }

  const opts = { method: action.method, headers: {} };
  if (action.body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(values);
  }

  try {
    const res = await fetch(url, opts);
    const data = await res.json();
    if (!data.success) {
      resultBody.innerHTML = `<div class="error-box">${escapeHtml(data.error || 'Request failed')}</div>`;
      return;
    }
    if (data.rows) {
      renderTable(data.rows);
      resultMeta.textContent = `${data.rows.length} row${data.rows.length === 1 ? '' : 's'}`;
    } else {
      resultBody.innerHTML = `<div class="success-box">${escapeHtml(data.message || 'Done')}</div>`;
      resultMeta.textContent = 'OK';
    }
  } catch (err) {
    resultBody.innerHTML = `<div class="error-box">${escapeHtml(err.message)}</div>`;
  }
}

function renderTable(rows) {
  if (!rows.length) {
    resultBody.innerHTML = '<p class="placeholder">No rows returned.</p>';
    return;
  }
  const cols = Object.keys(rows[0]);
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr>${cols.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr>`;
  const tbody = document.createElement('tbody');
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = cols.map(c => `<td>${escapeHtml(formatCell(r[c]))}</td>`).join('');
    tbody.appendChild(tr);
  });
  table.appendChild(thead);
  table.appendChild(tbody);
  resultBody.innerHTML = '';
  resultBody.appendChild(table);
}

function formatCell(val) {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderAll() {
  renderNav();
  renderActions();
  formRow.hidden = true;
  resultBody.innerHTML = '<p class="placeholder">Pick a query above to run it against the live database.</p>';
  resultMeta.textContent = '';
}

renderAll();
