import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { WEEK, DUE, COURSES, GRADES, SNAPSHOT } from './fixtures/initial-snapshot.js';
import * as live from '../data.js';
import { canonicalId, schoolDate, deadlineStatus, createPlanner } from '../model.js';
const { parseChecks, defaultDay, weekStatus, dayProgress, nextTask, clearDay } = createPlanner(WEEK,DUE);
const DAYS = Object.keys(WEEK).sort();

test('legacy task and due-list aliases converge on one assignment', () => {
  assert.deepEqual(parseChecks('{"due-ss-fair":true}'), {'t-ss-fair':true});
  assert.deepEqual(parseChecks('{"t-ss-fair":true,"due-ss-fair":true}'), {'t-ss-fair':true});
  assert.equal(canonicalId('due-alg-sg'),'t-alg-sg');
});
test('separate days keep separate module completion despite sharing URLs', () => {
  assert.equal(WEEK['2026-09-21'].items[1].url,WEEK['2026-09-22'].items[0].url);
  const state = parseChecks('{"t-ss-mod":true}');
  assert.equal(dayProgress('2026-09-21',state).done,1);
  assert.equal(dayProgress('2026-09-22',state).done,0);
});
test('malformed values fail safely; safe newer IDs survive an older snapshot', () => {
  for(const bad of ['null','[]','5','{bad']) assert.throws(()=>parseChecks(bad));
  assert.deepEqual(parseChecks('{"future-task":true,"__proto__":true,"constructor":true,"t-ss-fair":"true"}'),{'future-task':true});
});
test('date selection has explicit pre-week and archive states', () => {
  assert.equal(defaultDay('2026-09-20'),'2026-09-21');
  assert.equal(defaultDay('2026-09-23'),'2026-09-23');
  assert.equal(defaultDay('2026-10-02'),'2026-09-25');
  assert.equal(weekStatus('2026-09-20'),'upcoming');
  assert.equal(weekStatus('2026-09-23'),'current');
  assert.equal(weekStatus('2026-09-26'),'archive');
});
test('school dates use Eastern Time across UTC midnight and winter time', () => {
  assert.equal(schoolDate(new Date('2026-09-22T02:00:00Z')),'2026-09-21');
  assert.equal(schoolDate(new Date('2026-09-22T04:00:00Z')),'2026-09-22');
  assert.equal(schoolDate(new Date('2026-12-22T04:30:00Z')),'2026-12-21');
});
test('next task advances, restores on uncheck, and ends with null', () => {
  const items = WEEK[DAYS[0]].items;
  assert.equal(nextTask(DAYS[0],{}).id,items[0].id);
  assert.equal(nextTask(DAYS[0],{[items[0].id]:true}).id,items[1].id);
  const completed = Object.fromEntries(items.map(i=>[i.id,true]));
  assert.equal(nextTask(DAYS[0],completed),null);
  delete completed[items[0].id];
  assert.equal(nextTask(DAYS[0],completed).id,items[0].id);
});
test('clearing one day preserves another day and source object', () => {
  const checks = {'t-ss-fair':true,'t-ss-tue':true};
  assert.deepEqual(clearDay('2026-09-21',checks),{'t-ss-tue':true});
  assert.equal(checks['t-ss-fair'],true);
});
test('deadline status uses due time and does not assert submission', () => {
  const item = DUE.find(i=>i.id==='due-ia1-sci');
  assert.equal(deadlineStatus(item,{},new Date('2026-09-29T11:59:00Z')),'Today');
  assert.equal(deadlineStatus(item,{},new Date('2026-09-29T12:00:00Z')),'Date passed');
  assert.equal(deadlineStatus(DUE[0],{'t-ss-fair':true},new Date('2026-10-02')),'Checked off');
});
test('data contract: valid dates, unique daily IDs, exact school-domain links', () => {
  assert.match(live.SNAPSHOT.updatedDate,/^\d{4}-\d{2}-\d{2}$/);
  assert.match(live.SNAPSHOT.gradesUpdatedDate,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Object.keys(live.WEEK).length > 0, 'A week must contain at least one day');
  const items = Object.values(live.WEEK).flatMap(day=>day.items);
  assert.equal(new Set(items.map(i=>i.id)).size,items.length);
  assert.equal(new Set(live.DUE.map(i=>i.id)).size,live.DUE.length);
  for (const item of items) {
    assert.match(item.id,/^[a-zA-Z0-9][a-zA-Z0-9:_-]{0,159}$/);
    assert.ok(['ss','algebra','ela','science','pe','all'].includes(item.subject));
    assert.ok(item.title && item.url);
  }
  const urls = [...Object.values(live.COURSES),...live.GRADES.map(g=>g.url),...live.DUE.map(d=>d.url),...items.map(i=>i.url)];
  for(const raw of urls) {
    const url = new URL(raw);
    assert.equal(url.protocol,'https:');
    assert.equal(url.hostname,'georgiacyber.instructure.com');
  }
  for(const item of live.DUE) {
    assert.ok(Number.isFinite(Date.parse(item.dueAt)));
    assert.equal(schoolDate(new Date(item.dueAt)),item.dueDate);
  }
});
test('active assets omit parent meeting details and relative deadline copy', () => {
  const assets=['index.html','app.js','styles.css','data.js'].map(path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')).join('\n');
  assert.doesNotMatch(assets,/zoom\.us|IEP amendment|due tonight|don.t wait for Thursday/i);
});
