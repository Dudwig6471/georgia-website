// GSRP CAD civilian console: characters with a bank balance, licenses, the
// DMV, records, and Web 911 / 311 with text back from dispatch.
(() => {
  'use strict';

  const C = window.CAD;
  const {
    app, LICENSE_NAMES, LICENSE_KINDS, h, icon, act, toast, bind, tool, sep, shell, fileMenu, toolsMenu, helpMenu, formDialog, confirmDialog, refreshNow,
    grid, tabStrip, group, clock, date, stamp, money, up, flag, cap, licClass, txClass, SOURCE, child,
  } = C;

  const btn = (...a) => C.btn(...a);
  const DAY = 864e5;
  let tab = 'records';
  let sub = 'licenses';

  const civs = () => app.data.civilians || [];
  const activeId = () => app.data.profile?.activeCiv || null;
  function current() {
    const list = civs();
    return list.find((c) => c.id === app.selectedCiv) || list.find((c) => c.id === activeId()) || list[0] || null;
  }
  const fullName = (c) => `${c.firstName} ${c.lastName}`;
  const daysLeft = (ts) => (ts ? Math.ceil((ts - Date.now()) / DAY) : null);
  const vehName = (v) => [v.year, v.color, v.make, v.model].filter(Boolean).join(' ') || 'Vehicle';

  // ---------- Character dialogs ----------

  function civDialog(civ) {
    const c = civ || {};
    return formDialog({
      title: civ ? `Edit Character - ${fullName(c)}` : 'Create Character',
      submitLabel: civ ? 'Save' : 'Create Character',
      icon: civ ? 'edit' : 'useradd',
      width: 600,
      intro: civ ? null : 'New characters get a valid Class C driver license and a starting bank balance. Tickets are paid from this balance.',
      fields: [
        { name: 'firstName', label: 'First name', value: c.firstName, required: true, max: 40 },
        { name: 'lastName', label: 'Last name', value: c.lastName, required: true, max: 40 },
        { name: 'dob', label: 'Date of birth', type: 'date', value: c.dob },
        { name: 'gender', label: 'Sex', type: 'select', value: c.gender, options: ['', 'Male', 'Female', 'Other'].map((x) => [x, x || '--']) },
        { name: 'height', label: 'Height', value: c.height, max: 20, placeholder: `5'11"` },
        { name: 'weight', label: 'Weight', value: c.weight, max: 20, placeholder: '180 lb' },
        { name: 'hair', label: 'Hair', type: 'select', value: c.hair, options: ['', 'Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White', 'Bald', 'Other'].map((x) => [x, x || '--']) },
        { name: 'eyes', label: 'Eyes', type: 'select', value: c.eyes, options: ['', 'Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Other'].map((x) => [x, x || '--']) },
        { name: 'phone', label: 'Phone', value: c.phone, max: 20, placeholder: '(404) 555-0123' },
        { name: 'occupation', label: 'Occupation', value: c.occupation, max: 60 },
        { name: 'address', label: 'Address', value: c.address, wide: true, max: 120, placeholder: '1200 Peachtree Rd' },
        { name: 'mugshot', label: 'Photo URL', value: c.mugshot, wide: true, max: 300, placeholder: 'https://… (optional, a picture of your character)' },
        { name: 'armed', label: 'Known to carry a weapon', type: 'checkbox', value: c.armed },
        { name: 'medicalAlert', label: 'Medical alert', type: 'checkbox', value: c.medicalAlert },
        { name: 'medical', label: 'Medical notes', type: 'textarea', value: c.medical, rows: 2, max: 300 },
      ],
      onSubmit: async (v) => {
        const res = await act(civ ? 'updateCivilian' : 'createCivilian', { ...v, id: c.id }, civ ? 'Character saved.' : `${v.firstName} ${v.lastName} created.`);
        if (res?.id) app.selectedCiv = res.id;
        return res;
      },
    });
  }

  function deleteCiv(c) {
    return confirmDialog('Delete Character', `Delete ${fullName(c)} and all of their vehicles, firearms, records and bank history? This cannot be undone.`, 'Delete', async () => {
      const ok = await act('deleteCivilian', { id: c.id }, 'Character deleted.');
      if (ok) app.selectedCiv = null;
      return ok;
    });
  }

  function vehicleDialog(civ, v) {
    const x = v || {};
    return formDialog({
      title: v ? `Edit Vehicle - ${x.plate}` : `Register a Vehicle - ${fullName(civ)}`,
      submitLabel: v ? 'Save' : 'Register Vehicle',
      icon: 'car',
      intro: v ? null : `Registration is free and lasts ${app.data.settings?.regDays || 14} days. Vehicles you spawn in game while on the Civilian team register to your active character by themselves.`,
      fields: [
        { name: 'plate', label: 'Plate', value: x.plate, required: true, max: 10, placeholder: 'ABC1234' },
        { name: 'year', label: 'Year', value: x.year, max: 4, placeholder: '2020' },
        { name: 'make', label: 'Make', value: x.make, max: 30, placeholder: 'Falcon' },
        { name: 'model', label: 'Model', value: x.model, max: 60, placeholder: 'Stallion' },
        { name: 'color', label: 'Color', value: x.color, max: 30 },
        { name: 'insurance', label: 'Insurance', type: 'select', value: x.insurance || 'valid', options: [['valid', 'Insured'], ['expired', 'Expired'], ['none', 'No insurance']] },
      ],
      onSubmit: (val) => act('saveVehicle', { ...val, civId: civ.id, id: x.id }, v ? 'Vehicle saved.' : `${val.plate.toUpperCase()} registered.`),
    });
  }

  function firearmDialog(civ, f) {
    const x = f || {};
    return formDialog({
      title: f ? `Edit Firearm - ${x.serial}` : `Register a Firearm - ${fullName(civ)}`,
      submitLabel: f ? 'Save' : 'Register Firearm',
      icon: 'gun',
      fields: [
        { name: 'type', label: 'Firearm', type: 'select', value: x.type, options: ['Glock 17', 'Beretta M9', 'Colt M1911', 'Desert Eagle', 'Remington 870', 'AR-15', 'Hunting rifle', 'Revolver'].map((t) => [t, t]) },
        { name: 'serial', label: 'Serial', value: x.serial, max: 30, placeholder: 'Blank for a random serial' },
        { name: 'registered', label: 'Registered', type: 'checkbox', value: f ? x.registered : true },
      ],
      onSubmit: (val) => act('saveFirearm', { ...val, civId: civ.id, id: x.id }, f ? 'Firearm saved.' : 'Firearm registered.'),
    });
  }

  function licenseRequestDialog(civ) {
    const open = LICENSE_KINDS.filter((k) => k !== 'driver' && !['valid', 'pending', 'suspended', 'revoked'].includes(civ.licenses?.[k]?.status));
    if (!open.length) return toast('You already have or requested every license.', 'error');
    return formDialog({
      title: `Apply for a License - ${fullName(civ)}`,
      submitLabel: 'Submit Application',
      icon: 'license',
      intro: 'The courts review license applications. You see the result on My Records.',
      fields: [{ name: 'kind', label: 'License', type: 'select', wide: true, options: open.map((k) => [k, `${LICENSE_NAMES[k]} license`]) }],
      onSubmit: (v) => act('requestLicense', { civId: civ.id, kind: v.kind }, `${LICENSE_NAMES[v.kind]} license requested.`),
    });
  }

  // ---------- 911 and 311 ----------

  const NATURE_911 = {
    police: ['Shots fired', 'Robbery in progress', 'Fight / assault', 'Break-in', 'Reckless driver', 'Suspicious person', 'Stolen vehicle', 'Domestic disturbance', 'Other emergency'],
    fire: ['Structure fire', 'Vehicle fire', 'Medical emergency', 'Person not breathing', 'Car crash with injuries', 'Gas leak', 'Other emergency'],
    dot: ['Car crash, no injuries', 'Vehicle blocking the road', 'Debris in the road', 'Downed tree or lines'],
  };
  const NATURE_311 = ['Noise complaint', 'Abandoned vehicle', 'Illegally parked car', 'Pothole / road damage', 'Streetlight or signal out', 'Lost property', 'Found property', 'Theft report (past)', 'Vandalism (past)', 'General question'];

  function callDialog(line) {
    const g = app.data.ingame || {};
    const civ = current();
    const is911 = line === '911';
    let inputs;
    const svc = h('div', { class: 'svc-pick' });
    let service = 'police';
    const drawSvc = () => svc.replaceChildren(...[['police', 'Police', 'units'], ['fire', 'Fire / EMS', 'fire'], ['dot', 'Tow / Roads', 'cone']].map(([k, l, ic]) => h('button', {
      type: 'button', class: `svc ${service === k ? 'on' : ''}`, onclick: () => { service = k; drawSvc(); if (inputs) inputs.nature.replaceChildren(...NATURE_911[k].map((n) => h('option', { value: n }, n))); },
    }, icon(ic, 22), l)));
    drawSvc();
    inputs = formDialog({
      title: is911 ? 'Web 911 - Emergency' : '311 - Non-Emergency',
      submitLabel: is911 ? 'Call 911' : 'Send to 311',
      danger: is911,
      icon: is911 ? 'phone911' : 'phone311',
      width: 540,
      intro: is911
        ? `${g.detected ? `Your in-game location (${g.player.postal ? `postal ${g.player.postal}` : 'detected'}) is sent with the call.` : 'You are not in the ER:LC server, so type where you are.'} Dispatch can text you back on the 911 Calls tab.`
        : 'For things that are not an emergency. 311 reports are low priority and dispatch may text you back.',
      fields: [
        is911 ? { type: 'html', el: svc } : null,
        { name: 'civId', label: 'Calling as', type: 'select', value: civ?.id || '', options: [['', `Yourself (${app.me.user.name})`], ...civs().map((c) => [c.id, fullName(c)])] },
        { name: 'nature', label: is911 ? 'Emergency' : 'Report', type: 'select', options: (is911 ? NATURE_911.police : NATURE_311).map((n) => [n, n]) },
        { name: 'location', label: 'Location', value: g.player?.street || '', max: 120, placeholder: 'Street or landmark' },
        { name: 'postal', label: 'Postal', value: g.player?.postal || '', max: 10 },
        { name: 'details', label: is911 ? 'What is happening?' : 'Details', type: 'textarea', required: true, rows: 4, max: 1000, placeholder: is911 ? 'Two men fighting outside the gas station, one has a knife.' : 'A car has been parked on my street for three days.' },
      ],
      onSubmit: async (v) => {
        const res = await act('call911', { line, service: is911 ? service : 'police', ...v });
        if (!res) return false;
        toast(`${is911 ? '911' : '311'} call #${res.num} sent. Watch the 911 Calls tab for replies.`, 'ok');
        tab = 'calls';
        refreshNow();
        return true;
      },
    });
    return inputs;
  }

  // ---------- Pieces ----------

  function licenseCard(c) {
    const dl = c.licenses?.driver || {};
    return h('div', { class: `dl-card ${dl.status === 'valid' ? '' : 'bad'}` },
      h('div', { class: 'dl-head' }, h('b', null, 'GEORGIA'), h('span', null, 'DRIVER LICENSE'), h('span', { class: 'dl-class' }, `CLASS ${dl.class || 'C'}`)),
      h('div', { class: 'dl-body' },
        c.mugshot ? h('img', { class: 'mug', src: c.mugshot, alt: '', referrerpolicy: 'no-referrer', onerror: (e) => e.target.replaceWith(h('div', { class: 'mug blank' }, icon('user', 48))) }) : h('div', { class: 'mug blank' }, icon('user', 48)),
        h('div', { class: 'dl-fields' },
          h('div', { class: 'dl-num' }, dl.number || 'NO LICENSE'),
          h('div', { class: 'dl-name' }, up(c.lastName), h('br'), up(c.firstName)),
          h('div', { class: 'dl-grid' },
            [['DOB', c.dob], ['SEX', c.gender?.[0]], ['HGT', c.height], ['WGT', c.weight], ['HAIR', c.hair], ['EYES', c.eyes], ['ISS', date(dl.issued)], ['EXP', date(dl.expires)]]
              .map(([k, v]) => h('div', null, h('small', null, k), h('b', null, up(v) || '--')))),
          h('div', { class: 'dl-addr' }, up(c.address || 'NO ADDRESS ON FILE')))),
      h('div', { class: 'dl-foot' }, flag(`DL ${up(dl.status || 'none')}`, licClass(dl.status)), c.medicalAlert ? flag('MEDICAL', 'amber') : null, h('span', { class: 'grow' }), h('span', { class: 'bal' }, icon('bank', 16), money(c.balance))));
  }

  function recordGrid(list, empty) {
    return h('div', { class: 'mini-grid tall' }, grid([
      { label: 'Date', render: (r) => stamp(r.at) },
      { label: 'Type', render: (r) => (C.recordKind(r) === 'vehicle' ? 'VEH CITE' : up(r.type)), cls: (r) => `cell ${r.type === 'arrest' ? 'st-onscene' : r.type === 'citation' ? 'st-pending' : 'st-unavailable'}` },
      { label: 'Charges', render: (r) => up(r.charges.join(', ')) },
      { label: 'Plate', render: (r) => r.plate || '' },
      { label: 'Fine', render: (r) => (r.fine ? money(r.fine) : '') },
      { label: 'Jail', render: (r) => (r.jail ? `${r.jail} MO` : '') },
      { label: 'Location', render: (r) => up(r.location) },
      { label: 'Officer', render: (r) => up(r.officer) },
    ], list, { empty }));
  }

  function regGrid(c) {
    return h('div', { class: 'mini-grid tall' }, grid([
      { label: 'Plate', render: (v) => v.plate },
      { label: 'Vehicle', render: (v) => up(vehName(v)) },
      { label: 'VIN', render: (v) => v.vin || '' },
      { label: 'Registration', render: (v) => up(v.registration?.status), cls: (v) => `cell ${v.registration?.status === 'valid' ? 'st-available' : v.registration?.status === 'suspended' ? 'st-onscene' : 'st-pending'}` },
      { label: 'Expires', render: (v) => `${date(v.registration?.expires)}${v.registration?.status === 'valid' ? ` (${daysLeft(v.registration.expires)}d)` : ''}` },
      { label: 'Insurance', render: (v) => up(v.insurance), cls: (v) => (v.insurance === 'valid' ? 'tx-available' : 'tx-busy') },
      { label: 'Flags', render: (v) => [v.stolen ? 'STOLEN' : '', v.impounded ? 'IMPOUNDED' : '', v.source === 'ingame' ? 'AUTO' : ''].filter(Boolean).join(' ') || '--', cls: (v) => (v.stolen ? 'tx-panic' : v.impounded ? 'tx-busy' : '') },
      { label: 'Citations', render: (v) => String((c.records || []).filter((r) => r.plate && r.plate === v.plate).length || '') },
      { label: '', render: (v) => C.actionsCell(
        btn('Edit', () => vehicleDialog(c, v)),
        btn(v.stolen ? 'Recovered' : 'Report Stolen', () => act('reportStolen', { id: v.id, stolen: !v.stolen }, v.stolen ? 'Marked recovered.' : 'Reported stolen. Police lookups now show a hit.'), v.stolen ? '' : 'btn-danger'),
        btn('Delete', () => confirmDialog('Delete Vehicle', `Remove ${v.plate} from ${fullName(c)}?`, 'Delete', () => act('deleteVehicle', { id: v.id }, 'Vehicle removed.')))) },
    ], c.vehicles || [], { empty: 'No vehicles. Register one on New Records, or spawn one in game.' }));
  }

  function licensesTable(c) {
    return h('div', { class: 'mini-grid tall' }, grid([
      { label: 'License', render: (k) => up(LICENSE_NAMES[k]) },
      { label: 'Status', render: (k) => up(c.licenses?.[k]?.status || 'none'), cls: (k) => txClass(c.licenses?.[k]?.status) },
      { label: 'Number', render: (k) => c.licenses?.[k]?.number || '' },
      { label: 'Issued', render: (k) => date(c.licenses?.[k]?.issued) },
      { label: 'Expires', render: (k) => date(c.licenses?.[k]?.expires) },
      { label: 'Note', render: (k) => up(c.licenses?.[k]?.reason || (c.licenses?.[k]?.status === 'pending' ? 'Waiting on the courts' : '')) },
    ], LICENSE_KINDS, { key: (k) => k }));
  }

  // ---------- Tabs ----------

  function recordsTab(c) {
    const recs = c.records || [];
    const general = recs.filter((r) => r.type === 'citation' && !r.plate);
    const vehicle = recs.filter((r) => r.type === 'citation' && r.plate);
    const other = recs.filter((r) => r.type !== 'citation');
    const subs = [
      ['licenses', 'Licenses'],
      ['general', `General Citations (${general.length})`],
      ['vehicle', `Vehicle Citations (${vehicle.length})`],
      ['arrests', `Arrests & Warnings (${other.length})`],
      ['vehicles', `Vehicle Registration (${(c.vehicles || []).length})`],
      ['firearms', `Firearms (${(c.firearms || []).length})`],
      (c.warrants || []).length ? ['warrants', `Warrants (${c.warrants.length})`] : null,
    ];
    if (!subs.some((s) => s && s[0] === sub)) sub = 'licenses';
    const page = {
      licenses: () => licensesTable(c),
      general: () => recordGrid(general, 'No general citations. Keep it up.'),
      vehicle: () => recordGrid(vehicle, 'No vehicle citations.'),
      arrests: () => recordGrid(other, 'No arrests or warnings.'),
      vehicles: () => regGrid(c),
      firearms: () => C.firearmGrid(c.firearms || [], (f) => C.actionsCell(btn('Edit', () => firearmDialog(c, f)), btn('Delete', () => confirmDialog('Delete Firearm', `Remove ${f.serial}?`, 'Delete', () => act('deleteFirearm', { id: f.id }, 'Firearm removed.'))))),
      warrants: () => C.warrantsGrid(c.warrants || []),
    }[sub];
    const fines = recs.reduce((s, r) => s + (r.fine || 0), 0);
    return [
      h('div', { class: 'stat-row' },
        stat('license', 'Driver License', up(c.licenses?.driver?.status || 'none'), licClass(c.licenses?.driver?.status)),
        stat('citation', 'Citations', String(general.length + vehicle.length)),
        stat('arrest', 'Arrests', String(recs.filter((r) => r.type === 'arrest').length)),
        stat('car', 'Vehicles', String((c.vehicles || []).length)),
        stat('bank', 'Fines Paid', money(fines))),
      tabStrip(subs, sub, (k) => { sub = k; refreshNow(); }, 'sub'),
      h('div', { class: 'tab-page flush' }, page()),
    ];
  }
  const stat = (ic, label, value, cls = '') => h('div', { class: `stat ${cls}` }, icon(ic, 22), h('div', null, h('small', null, label), h('b', null, value)));

  function newRecordsTab(c) {
    const card = (ic, title, text, label, run) => h('div', { class: 'action-card' }, icon(ic, 36), h('div', null, h('b', null, title), h('p', null, text)), h('button', { class: 'btn btn-default', onclick: run }, label));
    return [
      h('div', { class: 'action-cards' },
        card('car', 'Register a Vehicle', `Add a plate to ${fullName(c)}. Free registration for ${app.data.settings?.regDays || 14} days, renewable at the DMV.`, 'Register Vehicle…', () => vehicleDialog(c)),
        card('gun', 'Register a Firearm', 'Record a firearm serial so it comes back to you on a police check.', 'Register Firearm…', () => firearmDialog(c)),
        card('license', 'Apply for a License', 'Firearm, hunting, pilot, boat or commercial. The courts approve applications.', 'Apply…', () => licenseRequestDialog(c))),
      h('div', { class: 'info-line' }, icon('info', 16), app.data.ingame?.detected
        ? `You are in game as ${app.data.ingame.player.name}. Vehicles you spawn on the Civilian team register to your active character automatically.`
        : 'Join the ER:LC server on the Civilian team and vehicles you spawn register to your active character automatically.'),
    ];
  }

  function dmvTab(c) {
    const dl = c.licenses?.driver || {};
    const dlLeft = daysLeft(dl.expires);
    const vehicles = c.vehicles || [];
    const due = vehicles.filter((v) => v.registration?.status === 'expired' || (v.registration?.status === 'valid' && daysLeft(v.registration.expires) <= 3));
    return [
      h('div', { class: 'dmv-banner' }, icon('dmv', 34), h('div', null, h('b', null, 'Georgia DMV Online'), h('p', null, `Registrations expire every ${app.data.settings?.regDays || 14} days. Renewals are free for now.`)),
        due.length ? h('button', { class: 'btn btn-default', onclick: async () => { for (const v of due) if (v.registration.status !== 'suspended') await act('renewRegistration', { id: v.id }); toast(`${due.length} registration${due.length > 1 ? 's' : ''} renewed.`, 'ok'); } }, icon('renew', 16), `Renew All Due (${due.length})`) : null),
      group('Driver License',
        h('div', { class: 'dmv-row' },
          icon('license', 28),
          h('div', { class: 'grow' }, h('b', null, dl.number || 'No license'), h('br'), `Class ${dl.class || 'C'} · ${up(dl.status || 'none')}${dl.expires ? ` · expires ${date(dl.expires)}${dl.status === 'valid' ? ` (${dlLeft} day${dlLeft === 1 ? '' : 's'})` : ''}` : ''}`),
          ['suspended', 'revoked'].includes(dl.status)
            ? h('span', { class: 'tx-panic' }, `${up(dl.status)}${dl.reason ? `: ${dl.reason}` : ''}. Contact the courts.`)
            : h('button', { class: 'btn', onclick: () => act('renewLicense', { civId: c.id }, 'Driver license renewed.') }, icon('renew', 16), dl.status === 'valid' ? 'Renew Early (Free)' : 'Renew (Free)'))),
      group(`Vehicle Registrations (${vehicles.length})`,
        vehicles.length ? vehicles.map((v) => {
          const r = v.registration || {};
          const left = daysLeft(r.expires);
          const state = r.status === 'valid' ? (left <= 3 ? 'due' : 'ok') : r.status;
          return h('div', { class: `dmv-row reg-${state}` },
            icon('car', 28),
            h('div', { class: 'grow' }, h('b', null, `${v.plate} · ${vehName(v)}`), h('br'), `VIN ${v.vin || '--'} · ${up(r.status)}${r.expires ? ` · ${r.status === 'valid' ? `expires ${date(r.expires)} (${left} day${left === 1 ? '' : 's'})` : `expired ${date(r.expires)}`}` : ''}`),
            r.status === 'suspended'
              ? h('span', { class: 'tx-panic' }, 'Suspended. Contact the courts.')
              : h('button', { class: `btn ${state === 'ok' ? '' : 'btn-default'}`, onclick: () => act('renewRegistration', { id: v.id }, `${v.plate} renewed for ${app.data.settings?.regDays || 14} days.`) }, icon('renew', 16), 'Renew (Free)'));
        }) : h('div', { class: 'empty' }, 'No vehicles registered.')),
    ];
  }

  function bankTab(c) {
    const tx = c.transactions || [];
    const spent = tx.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);
    return [
      h('div', { class: 'bank-head' },
        icon('bank', 40),
        h('div', null, h('small', null, 'Peach State Bank · Checking'), h('b', { class: c.balance < 0 ? 'neg' : '' }, money(c.balance))),
        h('div', { class: 'grow' }),
        h('div', null, h('small', null, 'Fines and fees'), h('b', { class: 'small' }, money(spent)))),
      c.balance < 0 ? C.hitBanner('Your balance is negative. Unpaid fines stay on record.', 'amber') : null,
      h('div', { class: 'mini-grid tall' }, grid([
        { label: 'Date', render: (t) => stamp(t.at) },
        { label: 'Description', render: (t) => t.reason },
        { label: 'By', render: (t) => t.by || '' },
        { label: 'Amount', render: (t) => money(t.amount), cls: (t) => (t.amount < 0 ? 'tx-panic' : 'tx-available') },
      ], tx, { empty: 'No transactions yet. Fines from tickets show here.' })),
    ];
  }

  function callsTab() {
    const calls = app.data.myCalls || [];
    return [
      h('div', { class: 'btnrow left', style: 'padding:0 0 6px' },
        h('button', { class: 'btn phone911', onclick: () => callDialog('911') }, icon('phone911', 16), 'Call 911'),
        h('button', { class: 'btn phone311', onclick: () => callDialog('311') }, icon('phone311', 16), 'Call 311')),
      calls.length ? calls.map((c) => {
        const input = h('input', { placeholder: 'Text dispatch (Enter)', maxlength: 500, style: 'flex:1' });
        return h('div', { class: `my-call ${c.status}` },
          h('div', { class: 'mc-head' },
            icon(c.source === '311' ? 'phone311' : 'phone911', 20),
            h('b', null, `#${c.num} ${c.nature}`),
            flag(up(c.status === 'pending' ? 'waiting for units' : c.status), c.status === 'closed' ? 'gray' : c.status === 'active' ? 'green' : 'amber'),
            h('span', { class: 'grow' }),
            h('small', null, `${SOURCE[c.source] || ''} · ${stamp(c.at)}`)),
          h('div', { class: 'mc-sub' }, `${c.postal ? `Postal ${c.postal} · ` : ''}${c.location || 'Location unknown'}${c.units.length ? ` · Units responding: ${c.units.join(', ')}` : ''}`),
          h('div', { class: 'sms' }, c.notes.length ? c.notes.map((n) => h('div', { class: `bubble ${/\(caller\)$/.test(n.by) ? 'me' : 'them'}` }, h('small', null, `${n.by} · ${clock(n.at)}`), n.text)) : h('div', { class: 'empty' }, 'No messages.')),
          c.status !== 'closed' ? h('form', { class: 'inline-form', onsubmit: (e) => { e.preventDefault(); if (input.value.trim()) act('callerText', { id: c.id, text: input.value }, 'Sent.'); } }, input, h('button', { class: 'btn', type: 'submit' }, 'Send')) : null);
      }) : h('div', { class: 'empty big' }, icon('phone911', 40), 'You have not called 911 or 311 yet.'),
    ];
  }

  // ---------- Console ----------

  function civilianConsole() {
    const need = (fn) => () => { const c = current(); if (!c) return toast('Create a character first.', 'error'); return fn(c); };
    const topRight = h('span', { class: 'civ-right' },
      h('button', { class: 'big-call red', onclick: () => callDialog('911'), title: 'Emergency: send a text 911 call' }, icon('phone911', 22), h('span', null, h('b', null, '911'), h('small', null, 'Emergency'))),
      h('button', { class: 'big-call blue', onclick: () => callDialog('311'), title: 'Non-emergency report' }, icon('phone311', 22), h('span', null, h('b', null, '311'), h('small', null, 'Non-emergency'))));
    const tools = [
      tool('New Character', 'useradd', () => civDialog()),
      tool('Edit', 'edit', need(civDialog)),
      tool('Set Active', 'check', need((c) => act('setActiveCiv', { id: c.id }, `${fullName(c)} is now your active character.`)), { title: 'Your active character gets in-game vehicles and is used for 911 calls' }),
      tool('Delete', 'trash', need(deleteCiv)),
      sep(),
      tool('My Records', 'records', () => { tab = 'records'; refreshNow(); }),
      tool('New Records', 'plus', () => { tab = 'new'; refreshNow(); }),
      tool('DMV', 'dmv', () => { tab = 'dmv'; refreshNow(); }),
      tool('Bank', 'bank', () => { tab = 'bank'; refreshNow(); }),
      sep(),
      tool('Link Roblox', 'link', C.robloxDialog),
      h('span', { class: 'tool-spacer' }),
      topRight,
      tool('Sign Off', 'signoff', C.signOff),
    ];
    const ws = shell({
      workspaceClass: 'civ',
      commands: false,
      menus: [
        fileMenu([{ label: 'New Character…', icon: 'useradd', run: () => civDialog() }, '-']),
        ['Character', [
          { label: 'Edit Character…', icon: 'edit', run: need(civDialog) },
          { label: 'Set as Active', icon: 'check', run: need((c) => act('setActiveCiv', { id: c.id }, 'Active character set.')) },
          { label: 'Delete Character…', icon: 'trash', run: need(deleteCiv) },
          '-',
          { label: 'Register Vehicle…', icon: 'car', run: need((c) => vehicleDialog(c)) },
          { label: 'Register Firearm…', icon: 'gun', run: need((c) => firearmDialog(c)) },
          { label: 'Apply for License…', icon: 'license', run: need(licenseRequestDialog) },
        ]],
        ['Phone', [{ label: 'Call 911…', icon: 'phone911', run: () => callDialog('911') }, { label: 'Call 311…', icon: 'phone311', run: () => callDialog('311') }, { label: 'My 911 Calls', run: () => { tab = 'calls'; refreshNow(); } }]],
        toolsMenu(),
        helpMenu(),
      ],
      tools,
      statusItems: (d) => {
        const c = (d.civilians || []).find((x) => x.id === d.profile?.activeCiv);
        return [h('span', null, `Characters: ${(d.civilians || []).length}`), h('span', null, c ? `Active: ${fullName(c)} · ${money(c.balance)}` : 'No active character')];
      },
    });

    const list = child('My Characters', { ic: 'user', bodyClass: 'white', cls: 'w-civlist', tools: [btn('New', () => civDialog()), btn('Edit', need(civDialog)), btn('Delete', need(deleteCiv))] });
    bind(list.body, (d) => [(d.civilians || []).map((c) => [c.id, c.firstName, c.lastName, c.balance, c.licenses?.driver?.status, c.mugshot]), current()?.id, activeId()], () => {
      const all = civs();
      list.setTitle(`My Characters - ${all.length}`);
      if (!all.length) return h('div', { class: 'empty big' }, icon('useradd', 40), 'No characters yet.', h('button', { class: 'btn btn-default', onclick: () => civDialog() }, 'Create Character'));
      const cur = current();
      return all.map((c) => h('button', { class: `civ-row ${cur?.id === c.id ? 'sel' : ''}`, onclick: () => { app.selectedCiv = c.id; refreshNow(); }, ondblclick: () => civDialog(c) },
        c.mugshot ? h('img', { src: c.mugshot, alt: '', referrerpolicy: 'no-referrer', onerror: (e) => e.target.replaceWith(icon('user', 30)) }) : icon('user', 30),
        h('span', { class: 'cr-text' }, h('b', null, fullName(c)), h('small', null, `${c.dob || 'DOB not set'} · DL ${up(c.licenses?.driver?.status || 'none')}`)),
        h('span', { class: 'cr-right' }, c.id === activeId() ? h('span', { class: 'active-pill' }, 'ACTIVE') : null, h('small', { class: c.balance < 0 ? 'neg' : '' }, money(c.balance)))));
    });

    const right = child('Character', { ic: 'license', bodyClass: 'face', cls: 'w-civ' });
    bind(right.body, (d) => [current(), tab, sub, tab === 'calls' ? d.myCalls : null, d.settings, d.ingame?.detected, activeId()], () => {
      const c = current();
      const tabs = [['records', 'My Records'], ['new', 'New Records'], ['dmv', 'DMV'], ['bank', 'Bank'], ['calls', `911 Calls${(app.data.myCalls || []).some((x) => x.status !== 'closed') ? ' (open)' : ''}`]];
      if (!c && tab !== 'calls') {
        right.setTitle('Character');
        return h('div', { class: 'empty big' }, icon('useradd', 48), h('b', null, 'Create your first character'), 'Add their name, details and photo. You get a driver license and a starting bank balance.', h('button', { class: 'btn btn-default', onclick: () => civDialog() }, 'Create Character'));
      }
      right.setTitle(c ? `${fullName(c)}${c.id === activeId() ? ' (Active)' : ''}` : '911 Calls');
      const page = tab === 'records' ? recordsTab(c) : tab === 'new' ? newRecordsTab(c) : tab === 'dmv' ? dmvTab(c) : tab === 'bank' ? bankTab(c) : callsTab();
      return [
        c ? h('div', { class: 'civ-top' },
          licenseCard(c),
          h('div', { class: 'civ-side' },
            c.id !== activeId() ? h('div', { class: 'info-line warn' }, icon('warning', 16), 'Not your active character.', btn('Make Active', () => act('setActiveCiv', { id: c.id }, `${fullName(c)} is now active.`))) : h('div', { class: 'info-line ok' }, icon('check', 16), 'Active character: in-game vehicles and 911 calls use this one.'),
            (c.warrants || []).some((w) => w.status === 'active') ? C.hitBanner('You have an active warrant.', 'red') : null,
            h('div', { class: 'kv one' }, [['Phone', c.phone], ['Occupation', c.occupation], ['Address', c.address], ['Medical', c.medical]].filter(([, v]) => v).map(([k, v]) => h('div', null, h('b', null, `${k}:`), v))),
            h('div', { class: 'btnrow left' }, btn('Edit Character', () => civDialog(c)), btn('Register Vehicle', () => vehicleDialog(c)), btn('DMV', () => { tab = 'dmv'; refreshNow(); })))) : null,
        tabStrip(tabs, tab, (k) => { tab = k; refreshNow(); }),
        h('div', { class: 'tab-page' }, page),
      ];
    });
    ws.append(list.el, right.el);
  }

  C.consoles.civilian = civilianConsole;
  Object.assign(C, { civDialog, vehicleDialog, firearmDialog, callDialog });
})();
