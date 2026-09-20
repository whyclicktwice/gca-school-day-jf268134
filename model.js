import { WEEK, DUE } from './data.js';

export const STORAGE_KEY = 'gca-school-day-checks-v5';
export const LEGACY_KEY = 'gca-jeffrey-dashboard-v4';
export const DAYS = Object.keys(WEEK).sort();
export const ALIASES = {
  'due-ss-fair': 't-ss-fair',
  'due-alg-test': 't-alg-test',
  'due-alg-sg': 't-alg-sg',
};
export const canonicalId = id => Object.hasOwn(ALIASES, id) ? ALIASES[id] : id;

export function schoolDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}


export function deadlineStatus(item, checks, now = new Date()) {
  if (checks[canonicalId(item.id)]) return 'Checked off';
  if (now >= new Date(item.dueAt)) return 'Date passed';
  if (schoolDate(now) === item.dueDate) return 'Today';
  return '';
}

// Pure planner factory also lets regression tests use a fixed snapshot while live data changes.
export function createPlanner(week, due) {
  const days = Object.keys(week).sort();
  function parseChecks(raw) {
    const value = JSON.parse(raw || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('Invalid saved checks');
    }
    const checks = {};
    for (const [id, checked] of Object.entries(value)) {
      if (!/^[a-zA-Z0-9][a-zA-Z0-9:_-]{0,159}$/.test(id) || ['__proto__', 'constructor', 'prototype'].includes(id)) continue;
      const canonical = canonicalId(id);
      // Preserve IDs absent from this snapshot: another tab may already have newer school data.
      if (checked === true) checks[canonical] = true;
    }
    return checks;
  }
  
  function defaultDay(today = schoolDate()) {
    return days.find(day => day >= today) || days.at(-1);
  }
  
  function weekStatus(today = schoolDate()) {
    if (today < days[0]) return 'upcoming';
    if (today > days.at(-1)) return 'archive';
    return 'current';
  }
  
  function dayProgress(day, checks) {
    const items = week[day].items;
    return { done: items.filter(item => checks[canonicalId(item.id)]).length, total: items.length };
  }
  
  function nextTask(day, checks) {
    return week[day].items.find(item => !checks[canonicalId(item.id)]) || null;
  }
  
  function clearDay(day, checks) {
    const result = { ...checks };
    week[day].items.forEach(item => delete result[canonicalId(item.id)]);
    return result;
  }
  return { parseChecks, defaultDay, weekStatus, dayProgress, nextTask, clearDay };
}
export const { parseChecks, defaultDay, weekStatus, dayProgress, nextTask, clearDay } = createPlanner(WEEK, DUE);
