import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // 한 번 출시하면 패키지 이름은 바꿀 수 없어요. 본인 이름/도메인으로 정한 뒤 add android 하세요.
  appId: 'com.shinjoong.goodmorningluck',
  appName: '굿모닝 운세',
  webDir: 'dist',
  android: { backgroundColor: '#FFF8EE' },
};
export default config;
