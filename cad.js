/* GSRP CAD: classic desktop dispatch console look. */
:root {
  --face: #d4d0c8;
  --face-2: #e4e1db;
  --hi: #ffffff;
  --lo: #808080;
  --dk: #404040;
  --title-a: #0a246a;
  --title-b: #3f78c8;
  --title-in-a: #6f7d92;
  --title-in-b: #aab6c6;
  --grid-bg: #000000;
  --grid-text: #e6e6e6;
  --sel: #0a246a;
  --blue: #0072fb;
  --c-avail: #00c000;
  --c-enrt: #00c8d8;
  --c-onsc: #e00000;
  --c-busy: #ff9900;
  --c-unav: #808080;
  --c-pend: #ffff00;
  --c-act: #33cc33;
  --bg: #0e0f12;
  --muted: #9aa3b2;
  --blue-2: #3d95ff;
  --mono: "Lucida Console", Consolas, "Courier New", monospace;
  color-scheme: light;
}

* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body {
  background: #3a6ea5;
  color: #000;
  font: 12px Tahoma, "Segoe UI", Verdana, Geneva, sans-serif;
  overflow: hidden;
}
[hidden] { display: none !important; }
button, input, select, textarea { font: inherit; color: inherit; }
a { color: #0033cc; }

/* ---------- Loader ---------- */
.loader {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 22px;
  background: radial-gradient(circle at 50% 42%, #0a2a57 0%, var(--bg) 62%);
  transition: opacity 0.5s ease, visibility 0.5s;
}
.loader.done { opacity: 0; visibility: hidden; }
.loader-logo {
  position: relative;
  width: 180px;
  height: 180px;
  animation: logo-in 0.9s cubic-bezier(0.2, 0.9, 0.3, 1.2) both, logo-float 2.6s ease-in-out 0.9s infinite;
  filter: drop-shadow(0 0 0 rgba(0, 114, 251, 0));
}
.loader-logo-base {
  width: 100%;
  height: 100%;
  animation: logo-draw 1.1s ease-out 0.1s both, logo-glow 2.6s ease-in-out 1s infinite;
}
/* A blue light sweeps across the logo, clipped to its shape. */
.loader-logo-shine {
  position: absolute;
  inset: 0;
  -webkit-mask: url(assets/gs-logo.png) center / contain no-repeat;
  mask: url(assets/gs-logo.png) center / contain no-repeat;
  background: linear-gradient(105deg, transparent 30%, rgba(61, 149, 255, 0.95) 46%, #fff 50%, rgba(61, 149, 255, 0.95) 54%, transparent 70%);
  background-size: 300% 100%;
  animation: logo-shine 1.8s ease-in-out 0.6s infinite;
}
.loader-bar {
  width: 200px;
  height: 4px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.loader-bar span {
  display: block;
  width: 40%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--blue), var(--blue-2));
  animation: bar 1.1s ease-in-out infinite;
}
.loader-text { margin: 0; color: var(--muted); font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase; }

@keyframes logo-in { from { opacity: 0; transform: scale(0.6) rotate(-6deg); } to { opacity: 1; transform: none; } }
@keyframes logo-draw { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes logo-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes logo-glow {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(0, 114, 251, 0.35)); }
  50% { filter: drop-shadow(0 0 22px rgba(61, 149, 255, 0.85)); }
}
@keyframes logo-shine { from { background-position: 100% 0; } to { background-position: 0 0; } }
@keyframes bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }

@media (prefers-reduced-motion: reduce) {
  .loader-logo, .loader-logo-base, .loader-logo-shine, .loader-bar span { animation-duration: 0.01s; animation-iteration-count: 1; }
}

/* ---------- Bevels and controls ---------- */
.raised {
  background: var(--face);
  border: 1px solid;
  border-color: var(--hi) var(--dk) var(--dk) var(--hi);
  box-shadow: inset -1px -1px var(--lo), inset 1px 1px #f1efe9;
}
.sunken {
  border: 1px solid;
  border-color: var(--lo) var(--hi) var(--hi) var(--lo);
  box-shadow: inset 1px 1px var(--dk);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 72px;
  height: 23px;
  padding: 0 10px;
  background: var(--face);
  border: 1px solid;
  border-color: var(--hi) var(--dk) var(--dk) var(--hi);
  box-shadow: inset -1px -1px var(--lo), inset 1px 1px #f1efe9;
  color: #000;
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
}
.btn:active:not(:disabled), .btn.pressed {
  border-color: var(--dk) var(--hi) var(--hi) var(--dk);
  box-shadow: inset 1px 1px var(--lo);
  padding-top: 1px;
}
.btn:focus-visible { outline: 1px dotted #000; outline-offset: -4px; }
.btn:disabled { color: var(--lo); text-shadow: 1px 1px var(--hi); cursor: default; }
.btn-small { min-width: 0; height: 20px; padding: 0 6px; font-size: 11px; }
.btn-default { outline: 1px solid #000; }
.btn-danger { color: #a00000; font-weight: bold; }

input, select, textarea {
  height: 21px;
  padding: 1px 4px;
  background: #fff;
  color: #000;
  border: 1px solid;
  border-color: var(--lo) var(--hi) var(--hi) var(--lo);
  box-shadow: inset 1px 1px var(--dk);
  border-radius: 0;
  outline: none;
  min-width: 0;
}
select { padding: 0 2px; }
textarea { height: auto; min-height: 60px; resize: vertical; padding: 3px 4px; }
input:focus, select:focus, textarea:focus { background: #fffff0; }
input[readonly] { background: var(--face-2); }
input[type=checkbox] { height: auto; box-shadow: none; }
.mono { font-family: var(--mono); }

/* ---------- Windows ---------- */
.titlebar {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 3px 0 6px;
  background: linear-gradient(90deg, var(--title-a), var(--title-b));
  color: #fff;
  font-weight: bold;
  user-select: none;
  flex: none;
}
.titlebar.inactive { background: linear-gradient(90deg, var(--title-in-a), var(--title-in-b)); }
.titlebar .t-icon { width: 16px; height: 16px; display: grid; place-items: center; font-size: 12px; }
.titlebar .t-icon img { width: 16px; height: 16px; }
.titlebar .t-text { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.tb-btn {
  width: 16px;
  height: 14px;
  padding: 0;
  display: grid;
  place-items: center;
  font: bold 9px/1 Tahoma, sans-serif;
  background: var(--face);
  color: #000;
  border: 1px solid;
  border-color: var(--hi) var(--dk) var(--dk) var(--hi);
  box-shadow: inset -1px -1px var(--lo);
  cursor: pointer;
}

.mainwin {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--face);
}

.menubar { display: flex; gap: 0; padding: 1px 2px; background: var(--face); flex: none; position: relative; z-index: 30; }
.menu { position: relative; }
.menu > button { padding: 2px 7px; background: none; border: 1px solid transparent; cursor: pointer; }
.menu > button:hover, .menu.open > button { border-color: var(--hi) var(--lo) var(--lo) var(--hi); }
.menu.open > button { border-color: var(--lo) var(--hi) var(--hi) var(--lo); }
.menu-list {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 190px;
  padding: 2px;
  display: none;
  z-index: 40;
}
.menu.open .menu-list { display: block; }
.menu-list button {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  padding: 3px 18px;
  background: none;
  border: 0;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
}
.menu-list button:hover:not(:disabled) { background: var(--sel); color: #fff; }
.menu-list button:disabled { color: var(--lo); cursor: default; }
.menu-list hr { border: 0; border-top: 1px solid var(--lo); border-bottom: 1px solid var(--hi); margin: 3px 1px; }

.toolbar {
  display: flex;
  align-items: stretch;
  gap: 1px;
  padding: 2px 4px;
  border-top: 1px solid var(--hi);
  border-bottom: 1px solid var(--lo);
  flex: none;
  overflow-x: auto;
}
.tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  min-width: 58px;
  height: 46px;
  padding: 2px 5px;
  background: none;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  font-size: 11px;
}
.tool .ic { font-size: 19px; line-height: 22px; height: 22px; }
.tool .ic svg { width: 22px; height: 22px; display: block; }
.tool:hover:not(:disabled) { border-color: var(--hi) var(--lo) var(--lo) var(--hi); }
.tool:active:not(:disabled), .tool.pressed { border-color: var(--lo) var(--hi) var(--hi) var(--lo); background: var(--face-2); }
.tool:disabled { opacity: 0.45; cursor: default; }
.tool.red { color: #c00000; font-weight: bold; }
.tool-sep { width: 2px; margin: 4px 3px; border-left: 1px solid var(--lo); border-right: 1px solid var(--hi); flex: none; }
.tool-spacer { flex: 1; min-width: 8px; }
.lines { display: flex; align-items: center; gap: 4px; padding: 0 6px; font-size: 11px; }
.line-lamp { width: 30px; height: 22px; display: grid; place-items: center; color: #fff; font-weight: bold; font-size: 10px; border: 1px solid #000; box-shadow: inset 1px 1px rgba(255, 255, 255, 0.35); }

.cmdrow { display: flex; align-items: center; gap: 6px; padding: 3px 6px; border-bottom: 1px solid var(--lo); flex: none; flex-wrap: wrap; }
.cmdrow label { font-weight: bold; }
.cmdrow input { width: min(500px, 60vw); font-family: var(--mono); }
.cmdrow .hint { color: #333; font-size: 11px; }
.cmdrow .hint b { font-weight: bold; }

.banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 6px;
  color: #fff;
  font-weight: bold;
  flex: none;
  flex-wrap: wrap;
}
.banner.panic { background: #7a0000; }
.banner.panic.unacked { animation: panic-flash 0.8s steps(2) infinite; }
.banner.s100 { background: #b36b00; }
.banner .code { padding: 0 6px; border: 1px solid #fff; background: #c00000; font-family: var(--mono); }
.banner .msg { flex: 1; min-width: 200px; }
@keyframes panic-flash { 50% { background: #c00000; } }

.workspace {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 50fr 50fr;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 4px;
  padding: 4px;
}
.workspace.dispatch { grid-template-columns: 27fr 25fr 22fr 26fr; }
.workspace.dispatch > .w-calls { grid-column: 1 / 3; }
.workspace.dispatch > .w-units { grid-column: 3 / 5; }
.workspace.dispatch > .w-911 { grid-column: 1 / 2; }
.workspace.dispatch > .w-viewer { grid-column: 2 / 4; }
.workspace.dispatch > .w-map { grid-column: 4 / 5; }
.workspace.mdt { grid-template-columns: 52fr 48fr; grid-template-rows: minmax(0, 1fr); }
.workspace.civ { grid-template-columns: 30fr 70fr; grid-template-rows: minmax(0, 1fr); }
.workspace.law { grid-template-columns: 58fr 42fr; grid-template-rows: minmax(0, 1fr); }
.workspace .col-stack { display: grid; gap: 4px; grid-template-rows: minmax(0, 1fr) minmax(0, 1fr); min-height: 0; }

.child { display: flex; flex-direction: column; min-height: 0; min-width: 0; }
.child-tools { display: flex; align-items: center; gap: 3px; padding: 3px; flex-wrap: wrap; flex: none; }
.child-tools .sep { width: 6px; }
.child-tools label { display: inline-flex; align-items: center; gap: 4px; }
.child-tools select { height: 20px; }
.child-body { flex: 1; min-height: 0; overflow: auto; margin: 0 3px 3px; }
.child-body.black { background: var(--grid-bg); color: var(--grid-text); }
.child-body.white { background: #fff; }
.child-body.face { background: var(--face); padding: 6px; }
.counters { display: inline-flex; gap: 2px; margin-left: auto; font: bold 11px var(--mono); }
.counters span { padding: 1px 4px; color: #000; border: 1px solid #000; }

.statusbar { display: flex; gap: 2px; padding: 2px; border-top: 1px solid var(--hi); flex: none; overflow: hidden; }
.statusbar > span { padding: 1px 6px; white-space: nowrap; border: 1px solid; border-color: var(--lo) var(--hi) var(--hi) var(--lo); }
.statusbar > .grow { flex: 1; }
.statusbar .on { color: #fff; background: #c00000; font-weight: bold; }
.statusbar .train { color: #c00000; font-weight: bold; }

/* ---------- Grids ---------- */
table.grid { width: 100%; border-collapse: collapse; font: 12px var(--mono); color: var(--grid-text); table-layout: auto; }
table.grid th {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 2px 5px;
  background: var(--face);
  color: #000;
  font: 12px Tahoma, sans-serif;
  text-align: left;
  white-space: nowrap;
  border: 1px solid;
  border-color: var(--hi) var(--dk) var(--dk) var(--hi);
}
table.grid td { padding: 1px 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; border-bottom: 1px solid #141414; }
table.grid tbody tr { cursor: default; }
table.grid tbody tr:hover td { background-color: #161616; }
table.grid tbody tr.sel td { background-color: var(--sel); color: #fff; }
table.grid tbody tr.sel { outline: 1px dotted #fff; outline-offset: -1px; }
table.grid tr.group td { background: #1c1c1c; color: #fff; font-weight: bold; font-family: Tahoma, sans-serif; padding: 3px 5px; }
table.grid tr.p1 td.pri { color: #fff; font-weight: bold; }
table.grid tr.pending td { color: #ffff66; }
table.grid tr.closed td { color: #777; }
table.grid tr.mine td:first-child { box-shadow: inset 3px 0 #3f78c8; }
table.grid tbody tr td.cell { text-align: center; font-weight: bold; color: #000; }
table.grid tr.sel td.cell { color: #000; }
.grid-empty { padding: 8px; color: #999; font: 12px var(--mono); }

.st-active { background: var(--c-act) !important; }
.st-pending { background: var(--c-pend) !important; }
.st-closed { background: #555 !important; color: #ddd !important; }
.st-available { background: var(--c-avail) !important; }
.st-enroute { background: var(--c-enrt) !important; }
.st-onscene { background: var(--c-onsc) !important; color: #fff !important; }
.st-busy { background: var(--c-busy) !important; }
.st-unavailable { background: var(--c-unav) !important; color: #000 !important; }
.st-panic { background: #ff0000 !important; color: #fff !important; animation: panic-cell 0.8s steps(2) infinite; }
@keyframes panic-cell { 50% { background: #800000 !important; } }
.tx-available { color: #33ff33; }
.tx-enroute { color: #33e6ff; }
.tx-onscene { color: #ff4040; }
.tx-busy { color: #ffad33; }
.tx-unavailable { color: #9a9a9a; }
.tx-panic { color: #ff3030; font-weight: bold; }

/* ---------- Forms, tabs and group boxes ---------- */
.tabs { display: flex; gap: 0; padding: 4px 4px 0; flex: none; }
.tab {
  padding: 2px 10px;
  margin-right: -1px;
  background: var(--face);
  border: 1px solid;
  border-bottom: 0;
  border-color: var(--hi) var(--dk) transparent var(--hi);
  cursor: pointer;
  position: relative;
  top: 2px;
}
.tab.active { top: 0; padding-bottom: 4px; font-weight: bold; z-index: 1; background: var(--face); }
.tab-page { flex: 1; min-height: 0; overflow: auto; margin: 0 4px 4px; padding: 8px; border: 1px solid; border-color: var(--hi) var(--dk) var(--dk) var(--hi); }

fieldset.group { margin: 0 0 8px; padding: 4px 8px 8px; border: 1px solid var(--lo); box-shadow: 1px 1px var(--hi), inset 1px 1px var(--hi); min-width: 0; }
fieldset.group legend { padding: 0 3px; color: #0a246a; }
.groups { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 8px; }
.groups > .full { grid-column: 1 / -1; }
.frow { display: grid; grid-template-columns: 70px minmax(0, 1fr); align-items: center; gap: 4px; margin-top: 3px; }
.frow > label { text-align: right; white-space: nowrap; }
.frow.wide { grid-template-columns: 1fr; }
.frow.wide > label { text-align: left; }
.btnrow { display: flex; justify-content: flex-end; gap: 6px; padding-top: 6px; flex-wrap: wrap; }
.btnrow.left { justify-content: flex-start; }
.mini-grid { background: #000; max-height: 140px; overflow: auto; }
.side-btns { display: grid; gap: 4px; align-content: start; }
.unit-box { display: grid; grid-template-columns: minmax(0, 1fr) 90px; gap: 6px; }
.kv { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 2px 10px; }
.kv div { display: flex; gap: 4px; }
.kv b { white-space: nowrap; }
.flag { display: inline-block; padding: 0 4px; margin: 0 2px; font: bold 11px var(--mono); border: 1px solid #000; color: #000; }
.flag.red { background: #ff4040; color: #fff; }
.flag.amber { background: #ffcc00; }
.flag.green { background: #33cc33; }
.flag.gray { background: #c0c0c0; }
.flag.blue { background: #66b3ff; }
.flag.purple { background: #b38cff; }
.result { margin-bottom: 8px; padding: 6px; background: #fff; border: 1px solid; border-color: var(--lo) var(--hi) var(--hi) var(--lo); }
.result h4 { margin: 0 0 4px; font-size: 13px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.result .sec { margin: 6px 0 2px; font-weight: bold; color: #0a246a; border-bottom: 1px solid #c0c0c0; }
.result table.grid { font-size: 11px; }
.result .mini-grid { max-height: none; }
.empty { color: #555; padding: 6px; }
.notes-list { font: 12px var(--mono); background: #000; color: #e6e6e6; padding: 4px; min-height: 80px; }
.notes-list div { padding: 1px 0; }
.notes-list b { color: #66b3ff; font-weight: normal; }

/* ---------- Live map ---------- */
.map-wrap { position: relative; flex: 1; min-height: 0; margin: 0 3px; background: #0d1a12; overflow: hidden; cursor: grab; }
.map-wrap:active { cursor: grabbing; }
.map-wrap canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.map-empty { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; padding: 16px; color: #8fb39a; font: 12px var(--mono); pointer-events: none; }
.map-foot { display: flex; gap: 2px; padding: 2px 3px 3px; flex: none; }
.map-foot span { padding: 0 5px; border: 1px solid; border-color: var(--lo) var(--hi) var(--hi) var(--lo); white-space: nowrap; }

/* ---------- Dialog windows ---------- */
.dlg-layer { position: fixed; inset: 0; pointer-events: none; z-index: 50; }
.dlg-layer.modal { pointer-events: auto; background: rgba(0, 0, 0, 0.15); }
.dlg {
  position: fixed;
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 8px);
  max-height: calc(100vh - 8px);
  pointer-events: auto;
  padding: 2px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.35), inset -1px -1px var(--lo), inset 1px 1px #f1efe9;
}
.dlg .titlebar { cursor: move; }
.dlg-body { padding: 8px; overflow: auto; min-height: 0; }
.dlg-body p { margin: 0 0 8px; }

/* ---------- Center screens (sign in, console picker) ---------- */
.desktop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 12px;
  background: radial-gradient(circle at 50% 40%, #2c5d99, #10294d 80%);
  overflow: auto;
}
.desk-logo { position: fixed; right: 16px; bottom: 12px; display: flex; align-items: center; gap: 8px; color: rgba(255, 255, 255, 0.75); font-weight: bold; pointer-events: none; }
.desk-logo img { width: 40px; height: 40px; opacity: 0.85; }
.signin { width: min(430px, 100%); padding: 2px; }
.signin-body { display: grid; grid-template-columns: 56px 1fr; gap: 4px 12px; padding: 14px 12px 12px; }
.signin-body img { width: 48px; height: 48px; background: #0a246a; border: 1px solid #000; padding: 3px; }
.signin-body h1 { margin: 0; font-size: 13px; }
.signin-body p { margin: 2px 0 0; }
.signin-body .err { color: #c00000; font-weight: bold; }
.signin-body .btnrow { grid-column: 1 / -1; }
.picker { width: min(680px, 100%); padding: 2px; }
.picker-body { padding: 10px; }
.consoles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; margin: 8px 0; }
/* ---------- Toasts ---------- */
.toasts { position: fixed; right: 8px; bottom: 30px; z-index: 60; display: grid; gap: 4px; max-width: calc(100vw - 16px); }
.toast { padding: 6px 10px; background: #ffffe1; border: 1px solid #000; box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.35); animation: toast-in 0.15s ease-out; }
.toast.error { background: #ffe1e1; color: #800000; font-weight: bold; }
.toast.ok { background: #e6ffe6; }
@keyframes toast-in { from { opacity: 0; transform: translateY(6px); } }

/* ---------- Small screens ---------- */
@media (max-width: 900px) {
  body { overflow: auto; }
  .mainwin { position: static; min-height: 100vh; }
  .workspace, .workspace.dispatch, .workspace.mdt, .workspace.civ, .workspace.law { display: flex; flex-direction: column; }
  .workspace .child { min-height: 320px; }
  .workspace .col-stack { display: flex; flex-direction: column; }
  .groups { grid-template-columns: 1fr; }
  .consoles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cmdrow .hint { display: none; }
  .lines { display: none; }
}

.dlg .frow { grid-template-columns: 105px minmax(0, 1fr); }
.dlg .groups { gap: 0 12px; }
.dlg .check-row { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
.ref-table { max-height: 60vh; overflow: auto; background: #000; }
.tone-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.tone-grid .btn { height: 34px; }
.timer-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.timer-row .t { font: bold 16px var(--mono); min-width: 80px; }
.timer-row .lbl { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* =====================================================================
   Round 3: custom icons, one-color console buttons, MDTs, civilian
   ===================================================================== */

.ic { display: inline-flex; align-items: center; justify-content: center; flex: none; line-height: 0; }
.ic svg { display: block; }
.grow { flex: 1; }
.muted { color: #555; font-size: 11px; margin: 4px 0 0; }
.neg { color: #c00000 !important; }
html[data-font=large] body { font-size: 14px; }
html[data-font=large] table.grid { font-size: 14px; }
html[data-font=large] .tool { font-size: 12px; }

/* ---------- Console picker: one solid color per console ---------- */
.picker-head { display: flex; align-items: center; gap: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--lo); box-shadow: 0 1px var(--hi); }
.picker-head .avatar { width: 40px; height: 40px; border: 1px solid #000; background: #0a246a; }
.picker-head b { display: block; font-size: 13px; }
.picker-head small { color: #444; }
.console-btn {
  --cb: #555;
  position: relative;
  display: grid;
  grid-template-columns: 46px 1fr;
  align-items: center;
  gap: 10px;
  min-height: 74px;
  padding: 10px;
  text-align: left;
  color: #fff;
  background: var(--cb);
  border: 1px solid rgba(0, 0, 0, 0.55);
  box-shadow: inset 1px 1px rgba(255, 255, 255, 0.35), inset -1px -1px rgba(0, 0, 0, 0.35), 0 1px 0 rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: filter 0.12s, transform 0.06s;
}
.console-btn:hover:not(:disabled) { filter: brightness(1.12); }
.console-btn:active:not(:disabled) { transform: translateY(1px); box-shadow: inset 1px 1px rgba(0, 0, 0, 0.4); }
.console-btn:focus-visible { outline: 2px solid #000; outline-offset: 2px; }
.console-btn .cb-icon { width: 46px; height: 46px; display: grid; place-items: center; background: rgba(0, 0, 0, 0.18); border: 1px solid rgba(255, 255, 255, 0.35); }
.console-btn .cb-icon svg { width: 32px; height: 32px; }
.console-btn b { display: block; font-size: 14px; letter-spacing: 0.02em; }
.console-btn small { display: block; margin-top: 2px; color: rgba(255, 255, 255, 0.85); font-size: 11px; }
.console-btn .cb-lock { position: absolute; top: 5px; right: 6px; padding: 0 4px; font: bold 9px var(--mono); color: #fff; background: rgba(0, 0, 0, 0.45); }
.console-btn:disabled { cursor: not-allowed; filter: grayscale(0.85) brightness(0.9); opacity: 0.6; }
.cb-civilian { --cb: #2e8b47; }
.cb-dispatcher { --cb: #6a3db0; }
.cb-police { --cb: #1f58b8; }
.cb-fire { --cb: #c0281f; }
.cb-dot { --cb: #dc7400; }
.cb-law { --cb: #7d6220; }

/* ---------- Chrome extras ---------- */
.menu-list .mi-ic { width: 18px; display: inline-flex; justify-content: center; margin: 0 4px 0 -14px; }
.menu-list button { justify-content: flex-start; }
.menu-list button > span:nth-child(2) { flex: 1; }
.titlebar .t-icon .ic svg { width: 16px; height: 16px; }
.statusbar .click { cursor: pointer; }
.statusbar .click:hover { background: var(--face-2); }
.statusbar .warn { color: #a00000; font-weight: bold; }
.banner.notice { background: #0a5aa8; }
.counters.plain { margin-left: auto; font: 11px Tahoma, sans-serif; color: #000; }
.child-tools .st-btn { color: #000; background: var(--st); font-weight: bold; }
.btn .ic svg { width: 16px; height: 16px; }
.inline-form { display: flex; align-items: center; gap: 4px; margin-top: 6px; }
.inline-check { display: inline-flex; align-items: center; gap: 3px; margin-right: 8px; white-space: nowrap; }
.empty.big { display: grid; justify-items: center; gap: 8px; padding: 28px 16px; text-align: center; color: #444; }
.empty.big .ic svg { width: 40px; height: 40px; }
.acts { display: inline-flex; gap: 2px; }
.notes-list .pub b { color: #ffcc33; }
.notes-list.tall { max-height: 220px; overflow: auto; }
.mini-grid.tall { max-height: none; }
.tab-page.flush { margin: 0; padding: 0; border: 0; }
.tabs.sub { padding: 6px 0 0; flex-wrap: wrap; }
.tabs.sub .tab { font-size: 11px; }
.kv.one { grid-template-columns: 1fr; }
.notepad { width: 100%; min-height: 320px; font-family: var(--mono); background: #fffde8; }

/* ---------- Grids: drag to assign, 911 lines ---------- */
body.dragging-unit table.grid tr.p1, body.dragging-unit table.grid tr.p2, body.dragging-unit table.grid tr.p3, body.dragging-unit table.grid tr.p4 { outline: 1px dashed #3f78c8; outline-offset: -1px; }
table.grid tr[draggable=true] { cursor: grab; }
table.grid tbody tr.drop td { background: #1e4d1e !important; color: #fff; }
.drop-zone { outline: 1px dashed #3f78c8; }
table.grid tr.idle td { color: #555; }
.blink { animation: blink 0.9s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0.25; } }
table.grid tr.p4 td.pri { color: #9a9a9a; }
td.tri-red { background: #e01e1e !important; color: #fff !important; }
td.tri-yellow { background: #ffd400 !important; }
td.tri-green { background: #2fbf4a !important; }
td.tri-black { background: #111 !important; color: #fff !important; border: 1px solid #555; }

/* ---------- Suggested units ---------- */
.suggest { margin: 0 0 8px; padding: 6px; background: #f6f9ff; border: 1px solid #9fb6d8; }
.suggest-head { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.suggest-head small { color: #555; }
.suggest-row { display: grid; grid-template-columns: 20px 70px minmax(0, 1fr) 50px auto; align-items: center; gap: 6px; padding: 2px 0; font-family: var(--mono); border-top: 1px solid #dfe7f3; }
.suggest-row .rank { width: 18px; height: 18px; display: grid; place-items: center; background: #0a246a; color: #fff; font-size: 10px; }
.suggest-row .cs { font-weight: bold; background: #000; padding: 0 4px; }
.suggest-row .nm { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.suggest-row .dist { text-align: right; color: #333; }

/* ---------- Dispatcher top right ---------- */
.lines .line-lamp { cursor: pointer; padding: 0; }
.line-lamp.idle { background: #3a3a3a; color: #888; }
.line-lamp.ringing { background: #e00000; animation: blink 0.7s steps(2) infinite; }
.line-lamp.ring311 { background: #1f6fd6; animation: blink 1.2s steps(2) infinite; }
.line-lamp.answered { background: #00a000; }
.line-lamp.hold { background: #e0a000; color: #000; }
.status-box { display: flex; align-items: center; gap: 6px; margin: 2px 6px; padding: 3px 8px; background: #101820; color: #fff; border: 1px solid #000; box-shadow: inset 1px 1px #000; }
.status-box .sb-unit { display: flex; align-items: center; gap: 5px; }
.status-box .sb-unit b { font: bold 14px var(--mono); }
.status-box .sb-unit small { color: #9fb6d8; }
.status-box .sb-dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 6px currentColor; }
.status-box .sb-label { font: bold 11px var(--mono); color: #ffcc33; }
.status-box select { height: 20px; }

.workspace.dispatch.layout-map { grid-template-columns: 26fr 24fr 50fr; grid-template-rows: minmax(0, 0.9fr) minmax(0, 1fr) minmax(0, 1.1fr); }
.workspace.dispatch.layout-map > .w-calls { grid-column: 1 / 3; grid-row: 1; }
.workspace.dispatch.layout-map > .w-units { grid-column: 1 / 3; grid-row: 2; }
.workspace.dispatch.layout-map > .w-911 { grid-column: 1 / 2; grid-row: 3; }
.workspace.dispatch.layout-map > .w-viewer { grid-column: 2 / 3; grid-row: 3; }
.workspace.dispatch.layout-map > .w-map { grid-column: 3 / 4; grid-row: 1 / 4; }
.workspace.dispatch.layout-nomap { grid-template-columns: 30fr 25fr 45fr; }
.workspace.dispatch.layout-nomap > .w-calls { grid-column: 1 / 3; }
.workspace.dispatch.layout-nomap > .w-units { grid-column: 3 / 4; }
.workspace.dispatch.layout-nomap > .w-911 { grid-column: 1 / 2; }
.workspace.dispatch.layout-nomap > .w-viewer { grid-column: 2 / 4; }

/* ---------- Live map ---------- */
.map-view { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.map-tools { display: flex; align-items: center; gap: 4px; padding: 3px; flex-wrap: wrap; flex: none; }
.map-tools label { display: inline-flex; align-items: center; gap: 3px; }
.map-view.compact .map-tools { gap: 2px; font-size: 11px; }
.map-wrap { background: #1b2a33; }
.map-dialog { height: min(72vh, 760px); display: flex; flex-direction: column; }
.child > .map-view { margin: 0 0 0; }

/* ---------- Lookup returns ---------- */
.lookup-results { margin-top: 6px; }
.term { margin: 0 0 6px; padding: 6px 8px; background: #000; color: #33ff66; font: 12px/1.45 var(--mono); border: 1px solid; border-color: var(--lo) var(--hi) var(--hi) var(--lo); white-space: pre-wrap; }
.term-line.miss { color: #ffcc33; }
.term-line.ok { color: #33ff66; }
.term-line.warn { color: #ffad33; }
.hit { display: flex; align-items: center; gap: 6px; margin: 0 0 4px; padding: 4px 8px; font: bold 12px var(--mono); color: #fff; border: 1px solid #000; }
.hit.red { background: #c00000; animation: hit-flash 1s steps(2) 3; }
.hit.amber { background: #e0a000; color: #000; }
.hit.purple { background: #7a2fc0; }
@keyframes hit-flash { 50% { background: #ff3030; } }
.person-top { display: flex; gap: 10px; align-items: flex-start; }
.mug { width: 84px; height: 100px; object-fit: cover; background: #e3e8ee; border: 1px solid #000; flex: none; }
.mug.blank { display: grid; place-items: center; }
.card-head { font-size: 11px; color: #555; font-weight: bold; margin-bottom: 2px; }

/* ---------- Unit MDT top bar ---------- */
.mdt-top {
  --accent: #1f58b8;
  display: flex;
  align-items: stretch;
  gap: 6px;
  padding: 5px 6px;
  background: linear-gradient(#1a2430, #0e151d);
  color: #fff;
  border-bottom: 2px solid var(--accent);
  flex: none;
  overflow-x: auto;
}
.mdt-top.role-fire { --accent: #c0281f; }
.mdt-top.role-dot { --accent: #dc7400; }
.unit-badge { display: flex; align-items: center; gap: 8px; padding: 2px 10px 2px 6px; background: var(--accent); border: 1px solid #000; min-width: 170px; }
.unit-badge.off { background: #444; }
.unit-badge .ic svg { width: 28px; height: 28px; }
.unit-badge b { display: block; font: bold 18px var(--mono); letter-spacing: 0.04em; }
.unit-badge small { display: block; font-size: 10px; opacity: 0.9; white-space: nowrap; }
.st-display { display: grid; align-content: center; min-width: 108px; padding: 2px 8px; background: #000; border: 1px solid #444; border-left: 6px solid var(--st); }
.st-display b { font: bold 18px var(--mono); color: var(--st); }
.st-display small { font-size: 10px; color: #ccc; }
.st-display .loc { color: #8fb3ff; }
.st-buttons { display: flex; gap: 3px; }
.st-btn { display: grid; place-content: center; min-width: 54px; padding: 2px 6px; cursor: pointer; color: #000; background: var(--st); border: 1px solid #000; box-shadow: inset 1px 1px rgba(255, 255, 255, 0.45), inset -1px -1px rgba(0, 0, 0, 0.35); text-align: center; }
.mdt-top .st-btn { opacity: 0.55; }
.mdt-top .st-btn:hover { opacity: 0.85; }
.mdt-top .st-btn.on { opacity: 1; outline: 2px solid #fff; outline-offset: -3px; }
.st-btn b { font: bold 13px var(--mono); }
.st-btn small { font-size: 9px; font-weight: bold; }
.mdt-actions { display: flex; gap: 3px; }
.mdt-act { display: grid; justify-items: center; align-content: center; gap: 2px; min-width: 76px; padding: 2px 8px; color: #fff; background: #2a3846; border: 1px solid #000; box-shadow: inset 1px 1px rgba(255, 255, 255, 0.18); cursor: pointer; font-size: 11px; white-space: nowrap; }
.mdt-act:hover { background: #364a5e; }
.mdt-act.big { min-width: 110px; background: #1f7a35; font-weight: bold; }
.mdt-call { display: grid; align-content: center; padding: 2px 10px; color: #000; background: #ffd400; border: 1px solid #000; cursor: pointer; text-align: left; }
.mdt-call b { font: bold 15px var(--mono); }
.mdt-call small { font-size: 10px; font-weight: bold; }
.panic-btn { display: flex; align-items: center; gap: 6px; padding: 0 16px; color: #fff; background: #b00000; border: 2px solid #000; box-shadow: inset 1px 1px rgba(255, 255, 255, 0.35), 0 0 0 1px #ff5a5a; cursor: pointer; }
.panic-btn b { font: bold 16px Tahoma, sans-serif; letter-spacing: 0.08em; }
.panic-btn:hover { background: #d40000; }
.panic-btn.on { animation: panic-flash 0.8s steps(2) infinite; }

/* ---------- Tabbed MDT ---------- */
.workspace.mdt-tabbed { grid-template-columns: minmax(0, 1fr) minmax(300px, 34%); grid-template-rows: minmax(0, 1fr); }
.mdt-main { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.mdt-tabs { display: flex; gap: 2px; padding: 4px 4px 0; flex: none; overflow-x: auto; background: #2a3846; }
.mdt-tab { display: flex; align-items: center; gap: 5px; padding: 6px 12px; color: #dbe5f0; background: #1a2430; border: 1px solid #000; border-bottom: 0; cursor: pointer; font-weight: bold; white-space: nowrap; }
.mdt-tab:hover { background: #22303e; }
.mdt-tab.active { color: #000; background: var(--face); }
.mdt-tab .badge { min-width: 16px; padding: 0 4px; font: bold 10px var(--mono); color: #000; background: #ffd400; border: 1px solid #000; }
.mdt-tab .badge.green { background: #33cc33; }
.mdt-page { flex: 1; min-height: 0; overflow: auto; padding: 8px; }
.mdt-page > .tab-split { height: 100%; }
.mdt-side { display: flex; flex-direction: column; gap: 4px; min-height: 0; }
.mdt-side > .child { flex: 1; }
.tab-split { display: grid; grid-template-rows: minmax(160px, 0.9fr) minmax(0, 1.1fr); gap: 4px; min-height: 480px; }
.tab-win { display: flex; height: 100%; min-height: 360px; }
.tab-win > .child { flex: 1; }

.call-head { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 8px 10px; color: #fff; background: #1a2430; border: 1px solid #000; border-left: 8px solid #ffd400; }
.call-head.p1 { border-left-color: #ff2020; }
.call-head.p3, .call-head.p4 { border-left-color: #33cc33; }
.call-head .num { font: bold 24px var(--mono); }
.call-head .ttl b { display: block; font: bold 16px Tahoma, sans-serif; }
.call-head .ttl small, .call-head .where small { color: #b9c7d6; }
.call-head .where { text-align: right; }
.call-head .where b { display: block; font: bold 16px var(--mono); color: #ffd400; }
.steps { display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0; }
.steps .btn.step { border-left: 6px solid var(--st); font-weight: bold; }
.unit-chips { display: flex; flex-wrap: wrap; gap: 4px; padding-top: 2px; }
.chip { display: inline-flex; gap: 4px; padding: 1px 6px; font: 11px var(--mono); background: #000; color: #fff; border-left: 4px solid var(--st); }
.details-text { white-space: pre-wrap; font-family: var(--mono); background: #fff; padding: 4px; min-height: 36px; border: 1px solid; border-color: var(--lo) var(--hi) var(--hi) var(--lo); }

.bolo-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 6px; }
.bolo-card { padding: 6px 8px; background: #fff; border: 1px solid #000; border-top: 6px solid #7a2fc0; }
.bolo-card.vehicle { border-top-color: #1f58b8; }
.bc-head { display: flex; align-items: center; gap: 6px; }
.bc-head small { margin-left: auto; color: #555; }
.bc-subj { margin: 4px 0; font: bold 13px var(--mono); }
.bc-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }

.triage { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; margin: 3px 0; }
.tri { padding: 4px 0; font-weight: bold; border: 1px solid #000; cursor: pointer; opacity: 0.5; }
.tri.on { opacity: 1; outline: 2px solid #000; outline-offset: -4px; }
.tri.red { background: #e01e1e; color: #fff; }
.tri.yellow { background: #ffd400; }
.tri.green { background: #2fbf4a; }
.tri.black { background: #111; color: #fff; }
.check-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 3px 6px; }
.vitals-in input { width: 70px; }
.tow-card h4 .ic svg { width: 20px; height: 20px; }

.backup-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.backup-btn { display: grid; height: 60px; justify-items: center; }
.backup-btn.amber { background: #ffd27a; }
.backup-btn.red { background: #ff8a80; }

.messages { display: flex; flex-direction: column; min-height: 300px; height: 100%; }
.msg-list { flex: 1; min-height: 200px; max-height: 60vh; overflow: auto; padding: 6px; background: #fff; border: 1px solid; border-color: var(--lo) var(--hi) var(--hi) var(--lo); }
.msg { max-width: 80%; margin: 0 0 6px; padding: 4px 8px; background: #eef2f7; border: 1px solid #c3cdd8; }
.msg.out { margin-left: auto; background: #dff0ff; border-color: #9fc5ea; }
.msg.urgent { background: #ffe1e1; border-color: #c00000; font-weight: bold; }
.msg-meta { font-size: 10px; color: #555; }

/* ---------- Civilian ---------- */
.civ-right { display: flex; align-items: center; gap: 4px; margin-right: 6px; }
.big-call { display: flex; align-items: center; gap: 6px; height: 42px; padding: 0 12px; color: #fff; border: 1px solid #000; box-shadow: inset 1px 1px rgba(255, 255, 255, 0.35), inset -1px -1px rgba(0, 0, 0, 0.3); cursor: pointer; text-align: left; }
.big-call b { display: block; font: bold 16px Tahoma, sans-serif; line-height: 1; }
.big-call small { font-size: 10px; }
.big-call .ic svg { filter: brightness(0) invert(1); }
.big-call.red { background: #c0281f; }
.big-call.blue { background: #1f58b8; }
.big-call:hover { filter: brightness(1.12); }
.btn.phone911 { color: #a00000; font-weight: bold; }
.btn.phone311 { color: #0a3a8a; font-weight: bold; }
.workspace.civ { grid-template-columns: minmax(230px, 26fr) 74fr; }
.w-civlist .child-body { padding: 3px; }
.civ-row { display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; align-items: center; gap: 8px; width: 100%; padding: 5px 6px; margin-bottom: 2px; text-align: left; background: #fff; border: 1px solid #c8ced6; cursor: pointer; }
.civ-row:hover { background: #f1f5fb; }
.civ-row.sel { background: var(--sel); color: #fff; border-color: #000; }
.civ-row img { width: 32px; height: 32px; object-fit: cover; border: 1px solid #000; }
.civ-row .cr-text { min-width: 0; }
.civ-row b, .civ-row small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.civ-row small { font-size: 11px; opacity: 0.8; }
.civ-row .cr-right { text-align: right; }
.civ-row .cr-right small { font-family: var(--mono); }
.active-pill { display: inline-block; padding: 0 5px; font: bold 9px var(--mono); color: #000; background: #33cc33; border: 1px solid #000; }
.w-civ .child-body { display: flex; flex-direction: column; }
.civ-top { display: grid; grid-template-columns: minmax(320px, 420px) minmax(0, 1fr); gap: 10px; padding: 6px 4px 8px; }
.civ-side { display: grid; align-content: start; gap: 6px; }
.dl-card { background: linear-gradient(135deg, #f3f7fc 0%, #dfe9f6 55%, #f4ecd6 100%); border: 1px solid #17366c; border-radius: 8px; overflow: hidden; box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25); font-family: Tahoma, sans-serif; }
.dl-card.bad { filter: grayscale(0.5); }
.dl-head { display: flex; align-items: center; gap: 8px; padding: 4px 10px; color: #fff; background: linear-gradient(90deg, #17366c, #2f6fd6); }
.dl-head b { font-size: 15px; letter-spacing: 0.15em; }
.dl-head span { font-size: 10px; letter-spacing: 0.1em; }
.dl-head .dl-class { margin-left: auto; font-weight: bold; }
.dl-body { display: flex; gap: 10px; padding: 8px 10px 4px; }
.dl-body .mug { width: 88px; height: 108px; border-radius: 4px; }
.dl-fields { flex: 1; min-width: 0; }
.dl-num { font: bold 13px var(--mono); color: #b00000; }
.dl-name { margin: 2px 0 4px; font: bold 14px/1.15 Tahoma, sans-serif; }
.dl-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2px 6px; }
.dl-grid small { display: block; font-size: 8px; color: #17366c; font-weight: bold; }
.dl-grid b { display: block; font: 11px var(--mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dl-addr { margin-top: 4px; font: 11px var(--mono); }
.dl-foot { display: flex; align-items: center; gap: 4px; padding: 4px 10px 6px; }
.dl-foot .bal { display: inline-flex; align-items: center; gap: 4px; font: bold 13px var(--mono); }
.info-line { display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: #eef4ff; border: 1px solid #9fb6d8; }
.info-line.ok { background: #eaf8ec; border-color: #8fc79a; }
.info-line.warn { background: #fff6dc; border-color: #d8b860; }
.info-line .btn { margin-left: auto; }
.w-civ .tabs { padding-left: 0; }
.w-civ .tab-page { margin: 0; flex: 1; }
.stat-row { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
.stat { display: flex; align-items: center; gap: 6px; padding: 5px 8px; background: #fff; border: 1px solid #b9c2cc; }
.stat small { display: block; font-size: 10px; color: #555; }
.stat b { font: bold 13px var(--mono); }
.stat.green b { color: #1f7a35; }
.stat.red b { color: #b00000; }
.stat.amber b { color: #a06a00; }
.action-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; margin-bottom: 8px; }
.action-card { display: grid; gap: 6px; justify-items: start; padding: 10px; background: #fff; border: 1px solid #b9c2cc; }
.action-card .ic svg { width: 36px; height: 36px; }
.action-card p { margin: 2px 0 0; color: #444; }
.dmv-banner { display: flex; align-items: center; gap: 10px; padding: 8px 10px; margin-bottom: 8px; color: #fff; background: linear-gradient(90deg, #17366c, #2f6fd6); border: 1px solid #000; }
.dmv-banner p { margin: 2px 0 0; color: #dbe5f5; }
.dmv-banner .btn { margin-left: auto; }
.dmv-row { display: flex; align-items: center; gap: 10px; padding: 6px 8px; margin-top: 4px; background: #fff; border: 1px solid #c8ced6; border-left: 5px solid #2fbf4a; }
.dmv-row.reg-due { border-left-color: #ffb000; }
.dmv-row.reg-expired { border-left-color: #e01e1e; background: #fff5f5; }
.dmv-row.reg-suspended { border-left-color: #000; background: #f3f3f3; }
.bank-head { display: flex; align-items: center; gap: 12px; padding: 10px 12px; margin-bottom: 8px; color: #fff; background: linear-gradient(90deg, #1f5a32, #2e8b47); border: 1px solid #000; }
.bank-head small { display: block; font-size: 11px; opacity: 0.85; }
.bank-head b { font: bold 24px var(--mono); }
.bank-head b.small { font-size: 15px; }
.bank-head b.neg { color: #ffb4b4 !important; }
.my-call { margin-bottom: 8px; padding: 6px 8px; background: #fff; border: 1px solid #b9c2cc; border-left: 5px solid #ffb000; }
.my-call.active { border-left-color: #2fbf4a; }
.my-call.closed { border-left-color: #999; opacity: 0.85; }
.mc-head { display: flex; align-items: center; gap: 6px; }
.mc-sub { margin: 2px 0 4px; color: #444; font-size: 11px; }
.sms { display: flex; flex-direction: column; gap: 4px; max-height: 220px; overflow: auto; padding: 6px; background: #f1f3f6; border: 1px solid #d0d6de; }
.bubble { max-width: 78%; padding: 4px 8px; border-radius: 10px; background: #fff; border: 1px solid #ccd3dc; white-space: pre-wrap; }
.bubble small { display: block; font-size: 9px; color: #666; }
.bubble.me { align-self: flex-end; background: #2f6fd6; color: #fff; border-color: #17366c; }
.bubble.me small { color: #dbe5f5; }
.svc-pick { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 4px; }
.svc { display: grid; justify-items: center; gap: 2px; padding: 6px; background: var(--face); border: 1px solid; border-color: var(--hi) var(--dk) var(--dk) var(--hi); cursor: pointer; }
.svc.on { background: #fff; outline: 2px solid #c0281f; outline-offset: -2px; font-weight: bold; }

@media (max-width: 900px) {
  .workspace.mdt-tabbed { display: flex; flex-direction: column; }
  .mdt-side { min-height: 360px; }
  .civ-top { grid-template-columns: 1fr; }
  .stat-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .consoles { grid-template-columns: 1fr; }
  .call-head { grid-template-columns: 1fr; }
  .call-head .where { text-align: left; }
  .tab-split { display: flex; flex-direction: column; }
  .civ-right .big-call small { display: none; }
}
.tow-card .kv { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
.tb-btn svg { display: block; }

/* Map directions */
.map-tools .route-info { display: inline-flex; align-items: center; gap: 4px; }
.map-tools .route-info:empty { display: none; }
.map-tools .route-label { background: #1d63c9; color: #fff; padding: 1px 6px; font-weight: bold; white-space: nowrap; max-width: 260px; overflow: hidden; text-overflow: ellipsis; }
