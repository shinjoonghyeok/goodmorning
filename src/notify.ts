import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

/** 매일 아침 알림 (기본 오전 7:30) */
export async function enableMorningAlarm(hour = 7, minute = 30): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const p = await LocalNotifications.requestPermissions();
    if (p.display !== 'granted') return false;
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
    await LocalNotifications.schedule({ notifications: [{
      id: 1, title: '☀️ 좋은 아침입니다', body: '오늘의 운세와 굿모닝 카드가 도착했어요. 확인해 보세요!',
      schedule: { on: { hour, minute }, allowWhileIdle: true },
    }] });
    return true;
  } catch { return false; }
}
export async function disableMorningAlarm() {
  try { await LocalNotifications.cancel({ notifications: [{ id: 1 }] }); } catch { /* noop */ }
}
