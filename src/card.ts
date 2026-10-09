import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export const THEMES = [
  { name: '봄꽃', c: ['#FFD6E0', '#FFF1C9'], e: ['🌸', '🌷', '🌼'] },
  { name: '맑은 하늘', c: ['#BFE3FF', '#E8F7FF'], e: ['☀️', '🕊️', '🌻'] },
  { name: '단풍', c: ['#FFD1A8', '#FFF0D6'], e: ['🍁', '🍂', '🌰'] },
  { name: '들꽃', c: ['#D4F5D0', '#FFF9D6'], e: ['🌿', '🌼', '🦋'] },
  { name: '노을', c: ['#FFC6A5', '#FFE9A8'], e: ['🌅', '🌺', '✨'] },
];

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = []; let cur = '';
  for (const ch of text) { if (ctx.measureText(cur + ch).width > maxW) { lines.push(cur); cur = ch; } else cur += ch; }
  if (cur) lines.push(cur); return lines;
}

export function drawCard(canvas: HTMLCanvasElement, o: { theme: number; name: string; message: string; date: string }) {
  const S = 1080; canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext('2d')!; const t = THEMES[o.theme % THEMES.length];
  const g = ctx.createLinearGradient(0, 0, S, S); g.addColorStop(0, t.c[0]); g.addColorStop(1, t.c[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  // 장식 (고정 배치)
  const pos = [[90, 110, 120], [930, 130, 110], [140, 930, 110], [900, 920, 130], [520, 70, 90], [60, 520, 90], [1000, 520, 90], [560, 1000, 90]];
  pos.forEach(([x, y, s], i) => { ctx.font = `${s}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t.e[i % t.e.length], x, y); });
  // 패널
  ctx.fillStyle = 'rgba(255,255,255,0.82)'; ctx.beginPath(); (ctx as any).roundRect(110, 200, 860, 680, 48); ctx.fill();
  ctx.fillStyle = '#B93A0B'; ctx.font = '800 76px "Noto Sans KR", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('좋은 아침입니다', S / 2, 330);
  if (o.name) { ctx.fillStyle = '#2b2b2b'; ctx.font = '700 48px "Noto Sans KR", sans-serif'; ctx.fillText(`${o.name}님`, S / 2, 410); }
  ctx.fillStyle = '#2b2b2b'; ctx.font = '600 52px "Noto Sans KR", sans-serif';
  const lines = wrap(ctx, o.message, 740); const y0 = o.name ? 510 : 470;
  lines.slice(0, 4).forEach((l, i) => ctx.fillText(l, S / 2, y0 + i * 78));
  ctx.fillStyle = '#8a6d56'; ctx.font = '500 34px "Noto Sans KR", sans-serif'; ctx.fillText(o.date, S / 2, 840);
}

export async function shareCard(canvas: HTMLCanvasElement) {
  const dataUrl = canvas.toDataURL('image/png');
  if (Capacitor.isNativePlatform()) {
    const data = dataUrl.split(',')[1];
    const f = await Filesystem.writeFile({ path: `goodmorning_${Date.now()}.png`, data, directory: Directory.Cache });
    await Share.share({ title: '굿모닝 카드', files: [f.uri], dialogTitle: '굿모닝 카드 보내기' });
  } else {
    const a = document.createElement('a'); a.href = dataUrl; a.download = 'goodmorning.png'; a.click();
  }
}
