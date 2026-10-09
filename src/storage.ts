import type { Person } from './fortune';

const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* noop */ } };

export const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const dayNum = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86400000); };

export const loadProfile = (): Person | null => { try { return JSON.parse(get('profile') ?? 'null'); } catch { return null; } };
export const saveProfile = (p: Person) => set('profile', JSON.stringify(p));
export const loadFamily = (): Person[] => { try { return JSON.parse(get('family') ?? '[]'); } catch { return []; } };
export const saveFamily = (f: Person[]) => set('family', JSON.stringify(f));
export const isUnlocked = (k: string) => get('unlock_' + k) === todayStr();
export const setUnlocked = (k: string) => set('unlock_' + k, todayStr());
export const flag = (k: string) => get('flag_' + k) === '1';
export const setFlag = (k: string) => set('flag_' + k, '1');

/** 연속 방문 일수를 갱신해서 돌려줘요 */
export function touchStreak(): number {
  const today = todayStr(); const last = get('lastVisit'); const cnt = Number(get('streak') ?? 0);
  if (last === today) return Math.max(cnt, 1);
  const next = last && dayNum(today) - dayNum(last) === 1 ? cnt + 1 : 1;
  set('streak', String(next)); set('lastVisit', today); return next;
}
