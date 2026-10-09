// 서버·AI 없이 (생년월일 + 날짜)로 항상 같은 결과를 만드는 결정형 운세예요.
// 오락 목적 콘텐츠이며, 투자·로또·의료·건강 판단을 다루지 않아요.
export type Person = { name: string; y: number; m: number; d: number };
export const ZODIAC = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
export const zodiacOf = (y: number) => (((y - 4) % 12) + 12) % 12;

function hash(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed: number) { let s = seed || 1; return () => { s = (Math.imul(s ^ (s >>> 15), 2246822507) + 0x9e3779b9) >>> 0; s ^= s >>> 13; s = Math.imul(s, 3266489909) >>> 0; return (s >>> 0) / 4294967296; }; }
const pick = <T,>(r: () => number, a: readonly T[]) => a[Math.floor(r() * a.length)];
const tier = (n: number) => (n < 70 ? 0 : n < 85 ? 1 : 2);

const HEAD = [
  ['서두르지 않아도 되는 하루예요', '마음 편히 쉬어가는 하루예요', '차분함이 힘이 되는 날이에요'],
  ['작은 기쁨이 찾아오는 하루예요', '일이 순조롭게 풀리는 날이에요', '주변 도움이 큰 힘이 돼요'],
  ['좋은 소식이 들려오는 날이에요', '귀인을 만날 수 있는 하루예요', '하시는 일마다 술술 풀려요'],
];
const SUMMARY = [
  ['오늘은 무리하지 마시고 가까운 사람과 따뜻한 차 한 잔 나눠 보세요.', '급한 결정은 내일로 미루셔도 괜찮아요. 마음을 다독이는 하루가 좋겠어요.'],
  ['그동안 해오신 노력이 조금씩 빛을 보기 시작해요. 감사한 마음을 전해 보세요.', '작은 선택 하나가 좋은 방향으로 이어져요. 웃는 얼굴이 행운을 불러요.'],
  ['오래 기다리셨던 일에 반가운 소식이 있을 수 있어요. 자신 있게 나서 보세요.', '주변 사람들이 먼저 손을 내밀어 줘요. 고마운 마음을 표현해 보세요.'],
];
type CK = 'home' | 'money' | 'people' | 'work';
const CATS: { key: CK; label: string; emoji: string }[] = [
  { key: 'home', label: '가정운', emoji: '🏡' }, { key: 'money', label: '재물운', emoji: '💰' },
  { key: 'people', label: '대인운', emoji: '🤝' }, { key: 'work', label: '일운', emoji: '🛠️' },
];
const TEXT: Record<CK, string[][]> = {
  home: [
    ['가족에게 서운한 말이 나올 수 있으니 한 번 더 생각하고 말씀하세요.', '집안일은 미루고 편히 쉬는 것도 좋아요.', '식구들과 조용히 식사하며 하루를 마무리해 보세요.'],
    ['가족과 나누는 대화에서 따뜻함을 느껴요.', '집 안 분위기가 훈훈해지는 날이에요.', '자녀나 손주에게 안부 전화를 해 보세요. 기뻐할 거예요.'],
    ['집안에 웃음꽃이 피는 날이에요.', '가족 모임이나 식사 자리가 즐거워요.', '오래 연락 못 한 가족에게서 반가운 연락이 와요.'],
  ],
  money: [
    ['불필요한 지출은 잠시 멈추고 꼭 필요한 것만 챙기세요.', '충동구매는 하루만 미뤄 보세요.', '아껴 쓰는 습관이 마음을 든든하게 해줘요.'],
    ['계획한 만큼만 쓰면 만족스러운 하루예요.', '작은 절약이 기분 좋게 돌아와요.', '가계부를 한 번 정리해 보기 좋은 날이에요.'],
    ['뜻밖의 작은 이득이 생길 수 있어요.', '필요한 물건을 알맞은 값에 만나요.', '정성껏 모아온 것들이 든든하게 느껴지는 날이에요.'],
  ],
  people: [
    ['말보다 들어주는 것이 더 큰 위로가 돼요.', '오해가 생기기 쉬우니 메시지는 한 번 더 읽어 보세요.', '오늘은 혼자만의 시간도 괜찮아요.'],
    ['지인에게 먼저 안부를 건네면 반가워해요.', '진심 어린 칭찬 한마디가 관계를 따뜻하게 해요.', '친구와의 대화에서 힘을 얻어요.'],
    ['좋은 인연이 닿는 날이에요.', '모임에서 환영받고 이야기꽃이 펴요.', '도움을 청하면 흔쾌히 응해 줘요.'],
  ],
  work: [
    ['큰일은 서두르지 말고 점검 위주로 하세요.', '해야 할 일을 세 가지로 줄이면 마음이 편해져요.', '정리하고 마무리하기 좋은 날이에요.'],
    ['오전 시간에 중요한 일을 먼저 처리해 보세요.', '꾸준함이 인정받는 날이에요.', '맡은 일이 매끄럽게 마무리돼요.'],
    ['경험이 빛을 발해 주위의 인정을 받아요.', '새로운 일을 시작하기 좋은 흐름이에요.', '하시는 일에 좋은 결과가 따라요.'],
  ],
};
const IDIOMS: [string, string][] = [
  ['일석이조', '한 가지 일로 두 가지 이득을 얻는다'], ['고진감래', '고생 끝에 즐거움이 온다'], ['우공이산', '꾸준히 하면 큰 산도 옮긴다'],
  ['새옹지마', '좋은 일과 나쁜 일은 돌고 돈다'], ['금상첨화', '좋은 일에 좋은 일이 더해진다'], ['적선지가', '착한 일을 쌓은 집에는 복이 온다'],
  ['개과천선', '허물을 고치고 새사람이 된다'], ['호연지기', '넓고 큰 마음의 기운'], ['온고지신', '옛것을 익혀 새것을 안다'],
  ['화기애애', '화목하고 즐거운 분위기'], ['대기만성', '큰 그릇은 늦게 이루어진다'], ['유비무환', '준비가 있으면 근심이 없다'],
  ['풍년가절', '풍성한 좋은 시절'], ['동고동락', '괴로움과 즐거움을 함께한다'], ['오곡백과', '온갖 곡식과 과일처럼 풍성함'],
  ['만사형통', '모든 일이 뜻대로 잘 이루어진다'], ['안분지족', '분수를 알고 만족할 줄 안다'], ['청출어람', '제자가 스승보다 더 나아진다'],
  ['사필귀정', '모든 일은 결국 바른 길로 돌아온다'], ['복덕겸비', '복과 덕을 모두 갖춘다'],
];
const BLESS = [
  '오늘도 웃음 가득한 하루 되세요.', '건강하고 행복한 하루 보내세요.', '좋은 일만 가득하시길 바랍니다.', '가족 모두 평안한 하루 되세요.',
  '오늘 하루도 감사한 마음으로 시작해요.', '마음 넉넉한 하루 되세요.', '따뜻한 차 한 잔의 여유를 누리세요.', '하시는 일마다 술술 풀리시길 바랍니다.',
  '오늘도 곁에 좋은 사람들이 함께하길 바랍니다.', '소중한 하루, 소중한 당신을 응원합니다.', '작은 행복을 많이 만나는 하루 되세요.', '웃는 얼굴이 가장 큰 복이에요. 활짝 웃어요.',
  '오늘도 수고 많으셨어요. 편안한 하루 되세요.', '마음에 꽃이 피는 하루 되세요.', '행복은 가까운 곳에 있어요. 오늘도 힘내세요.',
];
const COLORS = ['노란색', '연두색', '분홍색', '하늘색', '주황색', '보라색', '흰색'];
const TIMES = ['오전 9시쯤', '점심 식사 후', '오후 3시쯤', '해 질 무렵', '저녁 식사 후'];
const DIRS = ['동쪽', '서쪽', '남쪽', '북쪽', '동남쪽', '서남쪽'];

export type Cat = { key: CK; label: string; emoji: string; score: number; text: string };
export type Fortune = {
  score: number; stars: number; headline: string; summary: string; cats: Cat[];
  idiom: [string, string]; blessing: string; color: string; time: string; dir: string;
};

export function makeFortune(p: Person, date: string): Fortune {
  const base = `${p.y}-${p.m}-${p.d}|${date}`;
  const r = rng(hash(base));
  const score = 58 + Math.floor(r() * 42);
  const t = tier(score);
  const cats = CATS.map((c) => {
    const s = Math.max(50, Math.min(99, score + Math.floor(r() * 21) - 10));
    return { ...c, score: s, text: pick(r, TEXT[c.key][tier(s)]) };
  });
  return {
    score, stars: score >= 90 ? 5 : score >= 80 ? 4 : score >= 70 ? 3 : 2,
    headline: pick(r, HEAD[t]), summary: pick(r, SUMMARY[t]), cats,
    idiom: pick(r, IDIOMS), blessing: pick(r, BLESS), color: pick(r, COLORS), time: pick(r, TIMES), dir: pick(r, DIRS),
  };
}

/** 굿모닝 카드용 덕담 (날짜별 고정) */
export function dailyBlessing(date: string, salt = '') {
  const r = rng(hash(date + salt + 'bless'));
  return pick(r, BLESS);
}
