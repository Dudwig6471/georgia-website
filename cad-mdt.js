// GSRP CAD dispatcher console: log on to a console position, then work 911
// lines, calls, units and the live map. Units are assigned by dragging them
// onto a call, from the suggested (closest) units, or with DP on the command line.
(() => {
  'use strict';

  const C = window.CAD;
  const { app, STATUS, STATUS_COLOR, h, icon, act, toast, bind, tool, sep, d100, shell, fileMenu, toolsMenu, helpMenu, formDialog, refreshNow, closeAllDialogs, fullScreen, selectedCallObj, signOff, isOpen } = C;

  const DISPATCH_STATUS = [['available', 'Available', '#00c000'], ['busy', 'Busy', '#ff9900'], ['break', 'On Break', '#808080']];

  function dispatchLogOnDialog() {
    const last = app.data.profile?.dispatchCallsign || '';
    return formDialog({
      id: 'dlogon',
      title: 'Dispatch Log On - Select Your Unit',
      submitLabel: 'Log On (10-41)',
      cancelLabel: 'Later',
      icon: 'dispatch',
      width: 440,
      intro: 'Pick your dispatcher callsign and console position. Units see who is working dispatch, and your time goes on your timecard.',
      fields: [
        { name: 'callsign', label: 'Callsign', value: last || 'DISP-1', required: true, max: 12, placeholder: 'DISP-1' },
        { name: 'console', label: 'Console', type: 'select', value: '1', options: [['1', 'Console 1 - Primary'], ['2', 'Console 2 - Police'], ['3', 'Console 3 - Fire / EMS'], ['4', 'Console 4 - Overflow']] },
      ],
      onSubmit: (v) => act('dispatchLogOn', v, `Logged on as ${v.callsign.toUpperCase()}.`),
    });
  }

  function lineLamps() {
    const lamps = h('span', { class: 'lines' });
    bind(lamps, (d) => C.emergencyLines(d).map((c) => [c.id, c.source, Boolean(c.answeredAt), Boolean(c.hold)]), (lines) => [
      h('span', null, '911'),
      [0, 1, 2, 3].map((i) => {
        const l = lines[i];
        const cls = !l ? 'idle' : l[3] ? 'hold' : l[2] ? 'answered' : l[1] === '311' ? 'ring311' : 'ringing';
        return h('button', { class: `line-lamp ${cls}`, title: !l ? 'Idle' : l[3] ? 'On hold' : l[2] ? 'Answered' : 'Ringing, click to answer', onclick: () => { const c = C.emergencyLines(app.data)[i]; if (c) C.answerCall(c); } }, `L${i + 1}`);
      }),
    ]);
    return lamps;
  }

  // Top right: who is logged on to this console and their status.
  function statusBox() {
    const box = h('div', { class: 'status-box' });
    bind(box, (d) => d.myDispatch, (dsp) => {
      if (!dsp) {
        return [h('span', { class: 'sb-label' }, 'NOT LOGGED ON'), h('button', { class: 'btn btn-small btn-default', onclick: dispatchLogOnDialog }, 'Log On')];
      }
      const color = DISPATCH_STATUS.find(([k]) => k === dsp.status)?.[2] || '#00c000';
      return [
        h('span', { class: 'sb-unit' }, icon('dispatch', 18), h('b', null, dsp.callsign), h('small', null, `Console ${dsp.console}`)),
        h('span', { class: 'sb-dot', style: `background:${color}` }),
        h('select', { title: 'Your status', onchange: (e) => act('dispatchStatus', { status: e.target.value }, `Status: ${e.target.selectedOptions[0].textContent}.`) },
          DISPATCH_STATUS.map(([k, l]) => h('option', { value: k, selected: dsp.status === k }, l))),
      ];
    });
    return box;
  }

  function s100Tool() {
    return d100()
      ? act('toggleSignal100', { on: false }, 'Signal 100 cleared.')
      : formDialog({ title: 'Signal 100', submitLabel: 'Set Signal 100', danger: true, width: 380, icon: 'signal', fields: [{ name: 'reason', label: 'Reason', wide: true, placeholder: 'Pursuit, shots fired…' }], onSubmit: (v) => act('toggleSignal100', { on: true, reason: v.reason }, 'Signal 100 set.') });
  }

  function dispatchConsole() {
    const layout = C.prefs().dispatchLayout;
    const liveMap = () => (layout === 'nomap' ? C.mapDialog() : app.map?.fit());
    const need = C.need;
    const tools = [
      tool('New Call', 'newcall', () => C.newCallDialog(), { title: 'New call (F2)' }),
      tool('Call Viewer', 'viewer', () => (selectedCallObj() ? document.querySelector('.w-viewer')?.scrollIntoView({ block: 'nearest' }) : toast('Select a call first.', 'error'))),
      tool('Get Call', 'getcall', () => C.getCallDialog(), { title: 'Find a call by number (F4)' }),
      tool('Assign', 'dispatch', need(C.assignDialog), { title: 'Assign a unit to the selected call (F5)' }),
      sep(),
      tool('Lookup', 'lookup', () => C.openLookup(), { title: 'Name, plate and serial lookup (F7)' }),
      tool('Records', 'records', C.recordsDialog),
      tool('New Record', 'bolo', () => C.boloDialog(), { title: 'New record: BOLO' }),
      tool('Call History', 'history', C.callHistoryDialog),
      sep(),
      tool('Live Map', 'map', liveMap, { title: 'Live ER:LC map (F9)' }),
      tool('Messages', 'messages', C.messagesDialog),
      tool('Tone Board', 'tones', C.toneBoard),
      tool('Command', 'command', () => document.getElementById('cmd')?.focus()),
      sep(),
      tool('Signal 100', 'signal', s100Tool, { cls: 'red' }),
      tool('Panic Ack', 'siren', () => act('ackPanic', {}, 'Panic acknowledged.'), { cls: 'red', title: 'Acknowledge panic (F12)' }),
      h('span', { class: 'tool-spacer' }),
      lineLamps(),
      statusBox(),
      tool('Sign Off', 'signoff', signOff),
    ];
    const setLayout = (v) => C.setPrefs({ dispatchLayout: v }).then(() => C.renderConsole());
    const ws = shell({
      workspaceClass: `dispatch layout-${layout}`,
      menus: [
        fileMenu([{ label: 'Log On to Console…', icon: 'dispatch', run: dispatchLogOnDialog }, { label: 'Log Off Console', run: () => act('dispatchLogOff', {}, 'Logged off.') }, '-']),
        ['Edit', [{ label: 'Edit Selected Call…', icon: 'edit', run: need((c) => C.newCallDialog(c)) }, { label: 'Copy Call Number', run: need((c) => navigator.clipboard?.writeText(String(c.num))) }]],
        ['View', [
          { label: 'All Open Calls', checked: app.callFilter === 'open', run: () => { app.callFilter = 'open'; refreshNow(); } },
          { label: 'Pending Calls', checked: app.callFilter === 'pending', run: () => { app.callFilter = 'pending'; refreshNow(); } },
          { label: 'Call History', icon: 'history', run: C.callHistoryDialog },
          '-',
          { label: 'Layout: Standard', checked: layout === 'standard', run: () => setLayout('standard') },
          { label: 'Layout: Large Map', checked: layout === 'map', run: () => setLayout('map') },
          { label: 'Layout: No Map', checked: layout === 'nomap', run: () => setLayout('nomap') },
        ]],
        ['Calls', [
          { label: 'New Call…', key: 'F2', icon: 'newcall', run: () => C.newCallDialog() },
          { label: 'Answer 911', key: 'F3', icon: 'phone911', run: C.answerFirstLine },
          { label: 'Get Call…', key: 'F4', icon: 'getcall', run: () => C.getCallDialog() },
          { label: 'Assign Unit…', key: 'F5', icon: 'dispatch', run: need(C.assignDialog) },
          { label: 'Add Note…', run: need(C.noteDialog) },
          { label: 'Close Call…', run: need(C.closeCallDialog) },
        ]],
        ['Units', [
          ...['available', 'enroute', 'onscene', 'busy', 'transport', 'unavailable'].map((s) => ({ label: `Selected Unit ${STATUS[s].code} ${STATUS[s].label}`, run: () => C.setSelectedUnit(s) })),
          '-',
          { label: 'Acknowledge Panic', key: 'F12', icon: 'siren', run: () => act('ackPanic', {}, 'Panic acknowledged.') },
          { label: d100() ? 'Clear Signal 100' : 'Signal 100…', icon: 'signal', run: s100Tool },
        ]],
        ['Records', [{ label: 'Lookup…', key: 'F7', icon: 'lookup', run: () => C.openLookup() }, { label: 'Records Management…', icon: 'records', run: C.recordsDialog }, { label: 'New BOLO…', icon: 'bolo', run: () => C.boloDialog() }, { label: 'BOLOs…', key: 'F8', run: C.bolosDialog }, { label: 'Report Road Hazard…', icon: 'hazard', run: () => C.hazardDialog() }, { label: 'Request Tow…', icon: 'tow', run: () => C.towRequestDialog() }]],
        ['Map', [{ label: 'Whole Map', key: 'F9', icon: 'map', run: liveMap }, { label: 'Zoom In', run: () => app.map?.zoom(1.4) }, { label: 'Zoom Out', run: () => app.map?.zoom(1 / 1.4) }, { label: 'Map in a Window', run: C.mapDialog }]],
        toolsMenu([{ label: 'Tone Board', icon: 'tones', run: C.toneBoard }, { label: 'Messages', icon: 'messages', run: C.messagesDialog }]),
        ['Window', [{ label: 'Close All Dialogs', run: closeAllDialogs }, { label: 'Full Screen', run: fullScreen }]],
        helpMenu(),
      ],
      tools,
      hint: h('span', null, h('b', null, 'F2'), ' New Call · ', h('b', null, 'F3'), ' Answer · ', h('b', null, 'F4'), ' Get Call · ', h('b', null, 'F5'), ' Assign · ', h('b', null, 'F7'), ' Lookup · ', h('b', null, 'F9'), ' Map · Drag a unit onto a call to assign it'),
      statusItems: (d) => {
        const units = d.units || [];
        return [
          h('span', null, `Dispatchers: ${(d.dispatch || []).length}`),
          h('span', null, `Pending: ${(d.calls || []).filter((c) => c.status === 'pending').length}`),
          h('span', null, `Active: ${(d.calls || []).filter((c) => c.status === 'active').length}`),
          h('span', null, `Avail: ${units.filter((u) => u.status === 'available').length}/${units.length}`),
        ];
      },
    });
    ws.append(C.callsWindow('w-calls'), C.unitsWindow('w-units'), C.emergencyWindow('w-911'), C.viewerWindow('w-viewer'));
    if (layout !== 'nomap') ws.append(C.mapWindow('w-map'));
    if (!app.data.myDispatch) setTimeout(dispatchLogOnDialog, 50);
  }

  C.consoles.dispatcher = dispatchConsole;
  Object.assign(C, { dispatchLogOnDialog, s100Tool });
})();
