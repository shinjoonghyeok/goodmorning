import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdSize, BannerAdPosition, RewardAdPluginEvents } from '@capacitor-community/admob';

// ★ 출시 전: IS_TESTING을 false로 바꾸면 실제 광고 ID가 사용돼요.
// 개발·테스트 중에는 true로 두세요 (내 광고를 직접 누르면 계정이 정지될 수 있어요).
const IS_TESTING = true;
const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
const TEST_REWARDED_ID = 'ca-app-pub-3940256099942544/5224354917';
const REAL_BANNER_ID = 'ca-app-pub-7397305822305788/5598085188';
// 보상형 광고 단위 ID (AdMob에서 발급)
const REAL_REWARDED_ID = 'ca-app-pub-7397305822305788/4580516982';
const BANNER_ID = IS_TESTING ? TEST_BANNER_ID : REAL_BANNER_ID;
const REWARDED_ID = IS_TESTING || !REAL_REWARDED_ID ? TEST_REWARDED_ID : REAL_REWARDED_ID;

const native = Capacitor.isNativePlatform();
let inited = false; let prepared = false; let fails = 0;
export const adsAvailable = () => native && fails < 3;

export async function initAds() {
  if (!native || inited) return;
  try {
    await AdMob.initialize({ initializeForTesting: IS_TESTING });
    inited = true;
    await AdMob.showBanner({ adId: BANNER_ID, adSize: BannerAdSize.ADAPTIVE_BANNER, position: BannerAdPosition.BOTTOM_CENTER, margin: 0, isTesting: IS_TESTING });
    await prepareReward();
  } catch { fails = 3; }
}

async function prepareReward() {
  if (!native) return;
  try { await AdMob.prepareRewardVideoAd({ adId: REWARDED_ID, isTesting: IS_TESTING }); prepared = true; fails = 0; }
  catch { prepared = false; fails++; if (fails < 3) setTimeout(prepareReward, 3000); }
}

/** 보상형 광고를 보여줘요. 끝까지 시청해 보상을 받았을 때만 true */
export async function watchReward(): Promise<boolean> {
  if (!native || !prepared) return false;
  prepared = false;
  return new Promise<boolean>((resolve) => {
    let earned = false;
    AdMob.addListener(RewardAdPluginEvents.Rewarded, () => { earned = true; });
    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => { resolve(earned); prepareReward(); });
    AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => { resolve(false); prepareReward(); });
    AdMob.showRewardVideoAd().catch(() => { resolve(false); prepareReward(); });
  });
}
export const rewardReady = () => prepared;
/** 광고를 불러올 수 없는 환경(웹/오류)이면 막지 않고 열어줘요 */
export const rewardBlocked = () => !native || (!prepared && fails >= 3);
