import { useEffect, useMemo, useRef, useState } from 'react';
import { ZODIAC, zodiacOf, makeFortune, dailyBlessing, type Person } from './fortune';
import { loadProfile, saveProfile, loadFamily, saveFamily, todayStr, touchStreak, isUnlocked, setUnlocked, flag, setFlag } from './storage';
import { initAds, watchReward, rewardReady, rewardBlocked } from './ads';
import { enableMorningAlarm, disableMorningAlarm } from './notify';
import { THEMES, drawCard, shareCard } from './card';

type Tab = 'today' | 'morning' | 'family' | 'more';
const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);
const years = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 25 - i);

function useAdGate(key: string) {
  const [open, setOpen] = useState(isUnlocked(key));
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setInterval(() => setReady(rewardReady() || rewardBlocked()), 500); return () => clearInterval(t); }, []);
  const unlock = async () => {
    const ok = rewardBlocked() ? true : await watchReward();
    if (ok) { setUnlocked(key); setOpen(true); }
  };
  return { open, ready, unlock };
}

function ProfileForm({ initial, onSave, title, cta }: { initial?: Person; onSave: (p: Person) => void; title: string; cta: string }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [y, setY] = useState(initial?.y ?? 1970);
  const [m, setM] = useState(initial?.m ?? 1);
  const [d, setD] = useState(initial?.d ?? 1);
  return (
    <div className="card fade">
      <h2>{title}</h2>
      <div className="sub" style={{ marginBottom: 10 }}>생년월일은 이 휴대폰에만 저장돼요.</div>
      <input placeholder="이름 또는 별명 (선택)" value={name} onChange={(e) => setName(e.target.value.slice(0, 8))} />
      <div className="grid3" style={{ marginTop: 10 }}>
        <select value={y} onChange={(e) => setY(+e.target.value)}>{years.map((v) => <option key={v} value={v}>{v}년</option>)}</select>
        <select value={m} onChange={(e) => setM(+e.target.value)}>{Array.from({ length: 12 }, (_, i) => i + 1).map((v) => <option key={v} value={v}>{v}월</option>)}</select>
        <select value={d} onChange={(e) => setD(+e.target.value)}>{Array.from({ length: 31 }, (_, i) => i + 1).map((v) => <option key={v} value={v}>{v}일</option>)}</select>
      </div>
      <button className="btn" onClick={() => onSave({ name: name.trim(), y, m, d })}>{cta}</button>
    </div>
  );
}

function FortuneView({ p, detail }: { p: Person; detail: boolean }) {
  const f = useMemo(() => makeFortune(p, todayStr()), [p]);
  return (
    <>
      <div className="card fade">
        <div className="stars">{stars(f.stars)}</div>
        <div className="score">{f.score}점</div>
        <h2 style={{ textAlign: 'center', marginTop: 6 }}>{f.headline}</h2>
        <div style={{ textAlign: 'center' }}>{f.summary}</div>
      </div>
      <div className="card">
        <h2>분야별 운세</h2>
        {f.cats.map((c) => (
          <div key={c.key} style={{ marginBottom: 12 }}>
            <div className="row"><b>{c.emoji} {c.label}</b><b style={{ color: 'var(--main)' }}>{c.score}점</b></div>
            <div className="bar"><i style={{ width: `${c.score}%` }} /></div>
            {detail && <div className="sub fade">{c.text}</div>}
          </div>
        ))}
      </div>
      {detail && (
        <div className="card fade">
          <h2>오늘의 사자성어</h2>
          <div className="idiom">{f.idiom[0]}</div>
          <div style={{ textAlign: 'center' }} className="sub">{f.idiom[1]}</div>
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '16px 0' }} />
          <div>🎨 행운의 색 · <b>{f.color}</b></div>
          <div>⏰ 좋은 시간 · <b>{f.time}</b></div>
          <div>🧭 좋은 방향 · <b>{f.dir}</b></div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [profile, setProfile] = useState<Person | null>(loadProfile());
  const [family, setFamily] = useState<Person[]>(loadFamily());
  const [tab, setTab] = useState<Tab>('today');
  const [streak] = useState(touchStreak());
  const [adding, setAdding] = useState(false);
  const [theme, setTheme] = useState(0);
  const [alarmOn, setAlarmOn] = useState(flag('alarm'));
  const canvas = useRef<HTMLCanvasElement>(null);
  const todayGate = useAdGate('today');
  const famGate = useAdGate('family');

  useEffect(() => { initAds(); }, []);
  const date = todayStr();
  const blessing = useMemo(() => dailyBlessing(date), [date]);
  useEffect(() => {
    if (tab === 'morning' && canvas.current && profile) drawCard(canvas.current, { theme, name: profile.name, message: blessing, date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) });
  }, [tab, theme, profile, blessing]);

  if (!profile) return <div className="app"><h1>☀️ 굿모닝 운세</h1><div className="sub">매일 아침 운세와 인사 카드를 받아보세요</div><ProfileForm title="처음 오셨네요! 생년월일을 알려주세요" cta="시작하기" onSave={(p) => { saveProfile(p); setProfile(p); }} /></div>;

  const toggleAlarm = async () => {
    if (alarmOn) { await disableMorningAlarm(); setAlarmOn(false); localStorage.removeItem('flag_alarm'); }
    else if (await enableMorningAlarm()) { setAlarmOn(true); setFlag('alarm'); }
  };
  const hello = `${profile.name ? profile.name + '님, ' : ''}좋은 아침입니다`;

  return (
    <div className="app">
      <div className="sub">{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })} · 🔥 {streak}일째 방문</div>
      <h1>{hello} ☀️</h1>
      <div className="tabs">
        {([['today', '오늘운세'], ['morning', '굿모닝카드'], ['family', '가족운세'], ['more', '설정']] as [Tab, string][]).map(([k, l]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'today' && (
        <>
          <div className="sub" style={{ marginTop: 10 }}>{ZODIAC[zodiacOf(profile.y)]}띠 · {profile.y}년 {profile.m}월 {profile.d}일생</div>
          <FortuneView p={profile} detail={todayGate.open} />
          {!todayGate.open && (
            <button className="btn" disabled={!todayGate.ready} onClick={todayGate.unlock}>
              {todayGate.ready ? '🎬 짧은 영상 보고 자세한 풀이 보기' : '잠시만 기다려 주세요…'}
            </button>
          )}
          {!alarmOn && <div className="card" style={{ background: 'var(--soft)' }}><b>⏰ 매일 아침 알려드릴까요?</b><div className="sub">아침 7시 30분에 오늘의 운세가 도착해요.</div><button className="btn" onClick={toggleAlarm}>아침 알림 받기</button></div>}
        </>
      )}

      {tab === 'morning' && (
        <>
          <div className="card fade">
            <canvas ref={canvas} />
            <div className="grid3" style={{ marginTop: 12, gridTemplateColumns: 'repeat(5,1fr)' }}>
              {THEMES.map((t, i) => <button key={t.name} className={'chip' + (i === theme ? ' on' : '')} style={{ fontSize: 15 }} onClick={() => setTheme(i)}>{t.name}</button>)}
            </div>
            <button className="btn" onClick={() => canvas.current && shareCard(canvas.current)}>💌 카톡·문자로 보내기</button>
            <div className="sub" style={{ textAlign: 'center', marginTop: 8 }}>누르면 카카오톡, 문자, 밴드 등을 고를 수 있어요. 갤러리 저장도 여기서 해요.</div>
          </div>
        </>
      )}

      {tab === 'family' && (
        <>
          <div className="sub" style={{ marginTop: 10 }}>가족·친구의 오늘 운세를 확인해요 (최대 4명)</div>
          {family.map((m, i) => {
            const f = makeFortune(m, date);
            return (
              <div className="card fade" key={i}>
                <div className="row"><b>{m.name || '이름 없음'} ({ZODIAC[zodiacOf(m.y)]}띠)</b>
                  <button className="chip" onClick={() => { const n = family.filter((_, j) => j !== i); setFamily(n); saveFamily(n); }}>삭제</button></div>
                <div className="stars">{stars(f.stars)}</div>
                <div style={{ textAlign: 'center' }}><b>{f.score}점</b> · {f.headline}</div>
                {famGate.open && <div className="sub" style={{ marginTop: 8 }}>{f.summary}<br />🏡 {f.cats[0].text}</div>}
              </div>
            );
          })}
          {family.length > 0 && !famGate.open && (
            <button className="btn" disabled={!famGate.ready} onClick={famGate.unlock}>{famGate.ready ? '🎬 영상 보고 가족 풀이 모두 보기' : '잠시만 기다려 주세요…'}</button>
          )}
          {adding ? <ProfileForm title="가족·친구 추가" cta="추가하기" onSave={(p) => { const n = [...family, p].slice(0, 4); setFamily(n); saveFamily(n); setAdding(false); }} />
            : family.length < 4 && <button className="btn ghost" onClick={() => setAdding(true)}>＋ 가족·친구 추가하기</button>}
        </>
      )}

      {tab === 'more' && (
        <>
          <ProfileForm title="내 정보 수정" cta="저장하기" initial={profile} onSave={(p) => { saveProfile(p); setProfile(p); }} />
          <div className="card">
            <div className="row"><b>⏰ 아침 알림 (7:30)</b><button className="chip" style={{ width: 90 }} onClick={toggleAlarm}>{alarmOn ? '끄기' : '켜기'}</button></div>
          </div>
          <div className="note">이 앱의 운세는 재미로 보는 오락 콘텐츠이며, 결과를 보장하지 않아요. 중요한 결정은 신중히 판단하세요.<br />v1.0.0</div>
        </>
      )}
      <div className="note">※ 오락 목적의 운세 콘텐츠입니다</div>
    </div>
  );
}
