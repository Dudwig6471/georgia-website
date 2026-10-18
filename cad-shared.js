// GSRP CAD courts console: lookups, warrants, records, license applications,
// license and registration control, and (for admins) bank adjustments.
(() => {
  'use strict';

  const C = window.CAD;
  const { app, LICENSE_NAMES, h, icon, act, bind, tool, sep, shell, fileMenu, toolsMenu, helpMenu, formDialog, refreshNow, grid, tabStrip, stamp, up, money, child } = C;

  const btn = (...a) => C.btn(...a);
  let tab = 'requests';

  function warrantDialog(p) {
    return formDialog({
      title: `Issue Warrant - ${up(p.lastName)}, ${up(p.firstName)}`,
      submitLabel: 'Sign and Issue',
      icon: 'warrant',
      width: 520,
      fields: [
        { name: 'type', label: 'Type', type: 'select', options: [['arrest', 'Arrest warrant'], ['search', 'Search warrant'], ['bench', 'Bench warrant']] },
        { name: 'bond', label: 'Bond ($)', type: 'number', min: 0, value: '' },
        { name: 'charges', label: 'Charges / grounds', required: true, wide: true, max: 300 },
        { name: 'notes', label: 'Notes', type: 'textarea', max: 1000 },
      ],
      onSubmit: (v) => act('issueWarrant', { civId: p.id, ...v, bond: Number(v.bond) || 0 }, 'Warrant issued.'),
    });
  }

  function adjustBalanceBtn(p) {
    if (!app.data.me?.admin) return null;
    return btn('Adjust Balance', () => formDialog({
      title: `Adjust Balance - ${up(p.lastName)}, ${up(p.firstName)}`,
      submitLabel: 'Apply',
      icon: 'bank',
      intro: 'Positive amounts add money (refunds, paychecks). Negative amounts take it away.',
      fields: [
        { name: 'amount', label: 'Amount ($)', type: 'number', required: true },
        { name: 'reason', label: 'Reason', wide: true, max: 160, placeholder: 'Refund of dismissed citation' },
      ],
      onSubmit: (v) => act('adjustBalance', { civId: p.id, amount: Number(v.amount), reason: v.reason }, `Balance adjusted by ${money(Number(v.amount))}.`),
    }));
  }

  function lawConsole() {
    const ws = shell({
      workspaceClass: 'law',
      menus: [
        fileMenu(),
        ['Records', [{ label: 'Lookup…', key: 'F7', icon: 'lookup', run: () => C.openLookup() }, { label: 'Records Management…', icon: 'records', run: C.recordsDialog }]],
        toolsMenu(),
        helpMenu(),
      ],
      tools: [
        tool('Lookup', 'lookup', () => C.openLookup(), { title: 'Lookup (F7)' }),
        tool('License Requests', 'license', () => { tab = 'requests'; refreshNow(); }),
        tool('Warrants', 'warrant', () => { tab = 'warrants'; refreshNow(); }),
        tool('Records', 'records', () => { tab = 'records'; refreshNow(); }),
        sep(),
        tool('Penal Codes', 'penal', C.penalDialog),
        tool('Notepad', 'notepad', C.notepadDialog),
        h('span', { class: 'tool-spacer' }),
        tool('Sign Off', 'signoff', C.signOff),
      ],
      hint: 'LU <name> · PL <plate> · SN <serial>',
      statusItems: (d) => [h('span', null, `License requests: ${(d.licenseRequests || []).length}`), h('span', null, `Active warrants: ${(d.warrants || []).length}`)],
    });
    const left = child('Lookup - Court Records', { ic: 'lookup', bodyClass: 'face' });
    const panel = C.lookupPanel();
    panel.inline = true;
    app.lookup = panel;
    left.body.append(panel.el);
    const right = child('Court Clerk', { ic: 'gavel', bodyClass: 'face' });
    bind(right.body, (d) => [d.licenseRequests, d.warrants, d.records, tab], () => {
      const reqs = app.data.licenseRequests || [];
      const tabs = [['requests', `License Requests (${reqs.length})`], ['warrants', `Active Warrants (${(app.data.warrants || []).length})`], ['records', 'Recent Records']];
      const page = tab === 'requests'
        ? h('div', { class: 'mini-grid tall' }, grid([
          { label: 'Requested', render: (r) => stamp(r.at) },
          { label: 'Applicant', render: (r) => up(r.civName) },
          { label: 'License', render: (r) => up(LICENSE_NAMES[r.kind]) },
          { label: '', render: (r) => C.actionsCell(
            btn('Approve', () => act('setLicense', { civId: r.civId, kind: r.kind, status: 'valid', reason: 'Approved by the courts' }, `${LICENSE_NAMES[r.kind]} license approved.`), 'btn-default'),
            btn('Deny', () => act('setLicense', { civId: r.civId, kind: r.kind, status: 'none', reason: 'Denied by the courts' }, 'Application denied.'), 'btn-danger'),
            btn('Look Up', () => C.openLookup('name', r.civName))) },
        ], reqs, { key: (r) => r.civId + r.kind, empty: 'No license applications waiting.' }))
        : tab === 'warrants' ? C.warrantsGrid(app.data.warrants || [], true) : C.recordsGrid(app.data.records || [], true);
      return [
        tabStrip(tabs, tab, (k) => { tab = k; refreshNow(); }),
        h('div', { class: 'tab-page' }, page),
        h('p', { class: 'muted', style: 'padding:0 6px' }, 'Look up a person to issue a warrant, change a license or reinstate a registration.'),
      ];
    });
    ws.append(left.el, right.el);
    panel.focus();
  }

  C.consoles.law = lawConsole;
  Object.assign(C, { warrantDialog, adjustBalanceBtn });
})();
