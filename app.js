import { COURSES, GRADES, DUE, WEEK, SNAPSHOT } from './data.js';
import { STORAGE_KEY, LEGACY_KEY, DAYS, canonicalId, parseChecks, schoolDate, defaultDay, weekStatus, dayProgress, nextTask, clearDay, deadlineStatus } from './model.js';

const $ = id => document.getElementById(id);
const externalIcon = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M10 4H4v16h16v-6"/></svg>';
const SUBJECTS = {
  ss: { name: 'Social Studies', color: '#e7c49b', icon: 'SS' },
  algebra: { name: 'Algebra', color: '#accaff', icon: 'x' },
  ela: { name: 'Language Arts', color: '#c7baf0', icon: 'Aa' },
  science: { name: 'Science', color: '#a9d6bb', icon: 'Sc' },
  pe: { name: 'PE', color: '#ebafba', icon: 'PE' },
  all: { name: 'All classes', color: '#c3cedf', icon: '+' },
};
let temporary = false;
let checks = readChecks();
let today = schoolDate();
let activeDay = defaultDay(today);
let undoState = null;

// Per-task keys keep independent tab updates from overwriting each other. False values
// are tombstones that override earlier v4/v5 aggregate records after an uncheck/reset.
function readStoredChecks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const legacy = stored === null ? localStorage.getItem(LEGACY_KEY) : null;
  const result = parseChecks(stored ?? legacy);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(STORAGE_KEY + ':')) continue;
    const id = key.slice(STORAGE_KEY.length + 1);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9:_-]{0,159}$/.test(id) || ['constructor','prototype'].includes(id)) continue;
    const value = localStorage.getItem(key);
    if (value === 'true') result[canonicalId(id)] = true;
    else if (value === 'false') delete result[canonicalId(id)];
  }
  return result;
}
function readChecks() {
  try { return readStoredChecks(); }
  catch { temporary = true; return {}; }
}
function persist(changedIds) {
  try {
    // A malformed aggregate is preserved, but a valid empty base lets future reloads
    // use the task-level keys. This only repairs this dashboard's own storage.
    try { parseChecks(localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY)); }
    catch { localStorage.setItem(STORAGE_KEY, '{}'); }
    for (const id of changedIds) localStorage.setItem(STORAGE_KEY + ':' + id, String(Boolean(checks[id])));
    checks = readStoredChecks();
    temporary = false;
  } catch { temporary = true; }
  updateSaveStatus();
}
function updateSaveStatus() {
  $('save-status').textContent = temporary
    ? 'Checks are temporary in this tab; browser storage is unavailable or unreadable. They don’t submit work to Canvas.'
    : 'Checks stay in this browser. They don’t submit work to Canvas.';
}
function element(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
function link(text, url, className) {
  const a = element('a', className, text);
  // Daily data updates may contain only school links; do not execute URL schemes.
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'georgiacyber.instructure.com') throw new Error('Unexpected course URL');
    a.href = parsed.href;
  } catch {
    a.href = 'https://georgiacyber.instructure.com/';
    a.title = 'Open Canvas to find this item';
  }
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
}
function subjectLabel(key) {
  const subject = SUBJECTS[key] || SUBJECTS.all;
  const span = element('span', 'subject', subject.name);
  span.style.setProperty('--subject', subject.color);
  return span;
}
function formatDate(date, options) {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', ...options }).format(new Date(date + 'T12:00:00-04:00'));
}
function weekday(day) { return formatDate(day, { weekday: 'long' }); }
function heading() {
  $('day-heading').textContent = `${weekday(activeDay)}, ${formatDate(activeDay, { month: 'long', day: 'numeric' })}`;
  const current = activeDay === today;
  const status = weekStatus(today);
  $('day-context').textContent = `${current ? 'Today' : status === 'upcoming' ? `Previewing ${weekday(activeDay)}` : status === 'archive' ? 'Saved week' : 'Viewing ' + weekday(activeDay)} · School times in Eastern Time`;
  $('checklist-heading').textContent = `${weekday(activeDay)}’s checklist`;
  $('week-notice').hidden = status !== 'archive';
  $('week-notice').textContent = 'This saved week has ended. Open Canvas for your current work.';
  const first = formatDate(DAYS[0], { month: 'long', day: 'numeric' });
  const last = formatDate(DAYS.at(-1), { month: 'short', day: 'numeric', year: 'numeric' });
  document.querySelector('.week-label').textContent = `${first} – ${last}`;
}
function renderDays() {
  for (const day of DAYS) {
    let btn = [...$('day-nav').children].find(el => el.dataset.day === day);
    const isNew = !btn;
    if (isNew) btn = element('button', 'day-button');
    btn.type = 'button';
    btn.dataset.day = day;
    btn.setAttribute('aria-pressed', String(day === activeDay));
    if (day === today) btn.setAttribute('aria-current', 'date');
    else btn.removeAttribute('aria-current');
    const date = element('span');
    date.append(element('span', 'day-name', formatDate(day, {weekday:'short'})), element('span', 'day-number', formatDate(day, {day:'numeric'})));
    const {done,total} = dayProgress(day, checks);
    btn.replaceChildren(date, element('span', 'day-count' + (done === total ? ' complete' : ''), `${done}/${total}`));
    btn.setAttribute('aria-label', `${weekday(day)}, ${formatDate(day,{month:'long',day:'numeric'})}, ${done} of ${total} checked`);
    if (isNew) btn.addEventListener('click', () => {
      activeDay = day;
      renderAll();
      document.querySelector(`[data-day="${day}"]`).focus({preventScroll:true});
    });
    if (isNew) $('day-nav').append(btn);
  }
}
function renderNext() {
  const actionFocus = $('next-actions').contains(document.activeElement) ? document.activeElement.id : null;
  const task = nextTask(activeDay, checks);
  const archived = weekStatus(today) === 'archive';
  $('next-label').textContent = task ? (archived ? 'Next unchecked item' : 'Up next') : 'Checklist complete';
  $('next-title').textContent = task ? task.title : 'You’re done with this list.';
  $('next-detail').textContent = task ? (task.detail || 'Open the module in Canvas for the instructions.') : 'Check Canvas for any new work or submissions still to finish.';
  const subject = task ? subjectLabel(task.subject) : element('span', 'subject', `${dayProgress(activeDay, checks).total} checked off`);
  subject.id = 'next-subject';
  $('next-subject').replaceWith(subject);
  const actions = $('next-actions');
  actions.replaceChildren();
  if (task) {
    const open = link('Open in Canvas', task.url, 'primary');
    open.id = 'next-open';
    open.insertAdjacentHTML('beforeend', externalIcon);
    const done = element('button', 'secondary', 'Mark done');
    done.type = 'button';
    done.id = 'mark-next-done';
    done.setAttribute('aria-label', `Mark ${task.title} done`);
    done.addEventListener('click', () => {
      toggleTask(task.id, true);
      const checkbox = document.querySelector(`[data-task-id="${task.id}"] input`);
      checkbox?.focus({preventScroll:true});
    });
    actions.append(open, done);
  } else {
    const open = link('Check Canvas', 'https://georgiacyber.instructure.com/', 'primary');
    open.id = 'next-open';
    actions.append(open);
  }
  if (actionFocus) ($(actionFocus) || $('next-open')).focus({preventScroll:true});
}
function toggleTask(id, done) {
  if (done) checks[canonicalId(id)] = true;
  else delete checks[canonicalId(id)];
  persist([canonicalId(id)]);
  updateTaskRows();
  renderNext();
  renderDays();
  updateDeadlineStatuses();
  updateProgress();
  const {done: count, total} = dayProgress(activeDay, checks);
  $('announcement').textContent = `${count} of ${total} checked off. ${nextTask(activeDay,checks) ? 'Next: ' + nextTask(activeDay,checks).title : 'Checklist complete.'}`;
}
function renderTasks() {
  $('task-list').replaceChildren();
  for (const task of WEEK[activeDay].items) {
    const li = element('li', 'task-row');
    li.dataset.taskId = task.id;
    const label = element('label', 'check-control');
    const input = element('input');
    input.type = 'checkbox';
    input.setAttribute('aria-label', `Done: ${task.title}`);
    input.addEventListener('change', () => toggleTask(task.id, input.checked));
    label.append(input);
    const content = element('div', 'task-content');
    const meta = element('div', 'task-meta');
    meta.append(subjectLabel(task.subject));
    if(task.detail) meta.append(element('span', 'task-detail', task.detail));
    content.append(link(task.title, task.url, 'task-title'), meta);
    const open = link('', task.url, 'task-open');
    open.setAttribute('aria-label', `Open ${task.title} in Canvas (new tab)`);
    open.innerHTML = externalIcon;
    li.append(label, content, open);
    $('task-list').append(li);
  }
  updateTaskRows();
}
function updateTaskRows() {
  for (const row of $('task-list').children) {
    const done = Boolean(checks[canonicalId(row.dataset.taskId)]);
    row.classList.toggle('done', done);
    row.querySelector('input').checked = done;
  }
}
function updateProgress() {
  const {done,total} = dayProgress(activeDay,checks);
  $('progress-text').textContent = `${done} of ${total} done`;
  $('day-progress').max = total || 1;
  $('day-progress').value = done;
  $('reset-day').disabled = done === 0;
  $('checklist-hint').textContent = done === total ? 'Everything on this list is checked off.' : 'Check off work after you finish it.';
}
function renderDue() {
  $('due-list').replaceChildren();
  $('later-list').replaceChildren();
  const sorted = [...DUE].sort((a,b) => new Date(a.dueAt) - new Date(b.dueAt));
  sorted.forEach((item,index) => {
    const done = Boolean(checks[canonicalId(item.id)]);
    const li = element('li', 'due-item' + (done ? ' done' : ''));
    li.dataset.deadlineId = item.id;
    const stamp = element('div', 'date-stamp');
    stamp.setAttribute('aria-hidden','true');
    stamp.append(element('span', '', formatDate(item.dueDate,{month:'short'})),element('strong','',formatDate(item.dueDate,{day:'numeric'})));
    const content = element('div');
    const title = link(item.title,item.url,'due-title');
    const time = element('div','due-time',item.when);
    const status = element('div','due-status',deadlineStatus(item,checks));
    if(item.pts) time.append(document.createTextNode(` · ${item.pts}`));
    content.append(title,time,status);
    li.append(stamp,content);
    (index < 3 ? $('due-list') : $('later-list')).append(li);
  });
  $('later-count').textContent = String(Math.max(0,DUE.length-3));
  document.querySelector('.later-dates').hidden = DUE.length <= 3;
}
function updateDeadlineStatuses() {
  for (const item of DUE) {
    const li = [...document.querySelectorAll('[data-deadline-id]')].find(el => el.dataset.deadlineId === item.id);
    if (!li) continue;
    li.classList.toggle('done', Boolean(checks[canonicalId(item.id)]));
    const status = deadlineStatus(item, checks);
    if (li.querySelector('.due-status').textContent !== status) li.querySelector('.due-status').textContent = status;
  }
}
function renderCourses() {
  $('course-list').replaceChildren();
  for(const key of ['algebra','ela','science','ss','pe']) {
    const subject = SUBJECTS[key];
    const a = link('',COURSES[key],'course-link');
    a.style.setProperty('--subject',subject.color);
    const symbol = element('span','course-icon',subject.icon);
    symbol.setAttribute('aria-hidden','true');
    a.append(symbol,element('span','course-name',subject.name));
    a.insertAdjacentHTML('beforeend',externalIcon);
    $('course-list').append(a);
  }
  $('grade-list').replaceChildren();
  GRADES.forEach(grade => {
    const row = element('div','grade-row');
    row.append(element('dt','',grade.name),element('dd','',grade.pct == null ? 'Not recorded' : `${grade.pct}%`));
    $('grade-list').append(row);
  });
  const updated = formatDate(SNAPSHOT.updatedDate,{month:'long',day:'numeric',year:'numeric'});
  const gradesUpdated = formatDate(SNAPSHOT.gradesUpdatedDate,{month:'long',day:'numeric',year:'numeric'});
  const shortUpdated = formatDate(SNAPSHOT.gradesUpdatedDate,{month:'short',day:'numeric'});
  document.querySelector('.grades-details summary span').textContent = shortUpdated;
  document.querySelector('.grades-details p').textContent = `Recorded ${gradesUpdated}. Check Canvas for current grades.`;
  const footer = document.querySelector('footer p:nth-child(2)');
  footer.replaceChildren(document.createTextNode(`School information updated ${updated}. `),link('Check Canvas for changes.','https://georgiacyber.instructure.com/'));
}
function renderAll() {
  heading(); renderDays(); renderTasks(); renderNext(); updateDeadlineStatuses(); updateProgress(); updateSaveStatus();
}
$('focus-toggle').addEventListener('click', () => {
  const enabled = document.body.classList.toggle('focus-mode');
  $('focus-toggle').setAttribute('aria-pressed', String(enabled));
});
$('reset-day').addEventListener('click', () => {
  undoState = {day:activeDay, entries:WEEK[activeDay].items.filter(item => checks[canonicalId(item.id)]).map(item => canonicalId(item.id))};
  checks = clearDay(activeDay,checks);
  persist(undoState.entries); renderAll();
  $('toast-message').textContent = `${weekday(activeDay)}’s checks cleared.`;
  $('toast').hidden = false;
  $('undo').focus({preventScroll:true});
});
$('undo').addEventListener('click', () => {
  if(!undoState) return;
  undoState.entries.forEach(id => { checks[id] = true; });
  persist(undoState.entries); renderAll();
  const restoredDay = undoState.day;
  $('toast').hidden = true;
  undoState = null;
  $('announcement').textContent = `${weekday(restoredDay)}’s checks restored.`;
  document.querySelector(`[data-day="${restoredDay}"]`).focus({preventScroll:true});
});
$('dismiss-toast').addEventListener('click', () => {
  $('toast').hidden = true;
  undoState = null;
  $('focus-toggle').focus({preventScroll:true});
});
$('refresh-data').addEventListener('click', () => location.reload());
window.addEventListener('storage', event => {
  if(event.key === STORAGE_KEY || event.key?.startsWith(STORAGE_KEY + ':') || event.key === null) {
    checks = readChecks();
    updateTaskRows(); renderNext(); renderDays(); updateDeadlineStatuses(); updateProgress(); updateSaveStatus();
  }
});
// Recheck the school date after a laptop sleeps or the tab stays open overnight.
function refreshDate() {
  const newToday = schoolDate();
  if(today !== newToday) {
    today = newToday;
    activeDay = defaultDay(today);
    renderAll();
  } else { updateDeadlineStatuses(); }
}
document.addEventListener('visibilitychange', () => { if(!document.hidden) refreshDate(); });
setInterval(refreshDate, 60_000);
renderDue();
renderAll();
renderCourses();
