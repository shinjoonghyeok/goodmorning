# 굿모닝 운세 – 구글 플레이 출시 가이드

## 준비물
- PC에 Node.js LTS, Android Studio(설치 시 JDK 포함), 구글 플레이 개발자 계정(등록비 $25, 1회)
- AdMob 계정 (admob.google.com)

## 1. 설치와 웹 확인
    npm install --legacy-peer-deps
    npm run dev          # 브라우저에서 화면 확인 (광고·알림은 기기에서만 동작)
    npm run build        # 타입 오류가 나면 메시지를 보내 주세요

## 2. 안드로이드 프로젝트 만들기
    npx cap add android
    npm run android      # 빌드 + 동기화 + Android Studio 열기
패키지 이름(`capacitor.config.ts`의 appId)은 **출시 후 변경 불가**예요. add android 전에 확정하세요.

## 3. AdMob 앱 ID 넣기 (필수)
AdMob에서 앱을 등록하면 `ca-app-pub-XXXX~YYYY` 형식의 앱 ID가 나와요.
`android/app/src/main/AndroidManifest.xml`의 `<application>` 안에 추가:

    <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-XXXX~YYYY"/>

이 앱의 앱 ID는 `ca-app-pub-7397305822305788~2874526952`예요. (이미 `android-manifest-snippet.xml`에 넣어 뒀어요. 그대로 붙여 넣으세요.)
`src/ads.ts`의 BANNER_ID / REWARDED_ID를 광고 단위 ID로 바꾸고 `IS_TESTING = false`로 변경하세요.
테스트 ID 그대로 출시하면 수익이 0원이고, 내 광고를 직접 반복 클릭하면 계정이 정지돼요.

## 4. 알림/파일 권한
`AndroidManifest.xml`에 `<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>`가 없으면 추가하세요(안드로이드 13+ 알림 허용용).

## 5. 아이콘
`store/icon_512.png`를 Android Studio → res 우클릭 → New → Image Asset으로 앱 아이콘에 적용하세요.

## 6. 서명된 AAB 만들기
Android Studio → Build → Generate Signed Bundle → Android App Bundle → 새 키스토어 생성.
**키스토어 파일과 비밀번호는 반드시 백업**하세요. 잃어버리면 업데이트를 못 해요. (Play App Signing 사용 권장)

## 7. 개인정보처리방침 올리기
`legal/privacy.html`의 문의 이메일을 채우고, GitHub Pages나 노션 공개 페이지 등 **공개 URL**로 올려요. 그 주소를 Play Console에 입력해요.

## 8. Play Console 등록 순서
1. 앱 만들기: 앱 이름, 한국어, 앱, 무료
2. 정책 선언: 광고 포함 = 예, 타겟층 = 18세 이상, 데이터 보안(기기 ID/광고 ID를 광고 목적으로 수집 – AdMob), 콘텐츠 등급 설문
3. 스토어 설명: `STORE_LISTING.md` 문구, `store/` 이미지(아이콘 512, 그래픽 1024×500), 휴대폰 스크린샷 최소 2장
4. 개인 계정이면 **비공개 테스트를 12명 이상이 14일 연속 참여**해야 정식 출시 신청이 가능해요(2023년 11월 이후 개인 계정 기준). 지인·카페에서 테스터를 모으세요. 사업자 계정이면 해당 없어요.
5. 프로덕션 출시 신청 → 심사(보통 며칠)

## 9. 중장년 타겟 성장 전략
- **굿모닝 카드 공유가 핵심 바이럴**이에요. 카톡으로 받은 사람이 앱을 궁금해하도록, 카드에 작은 앱 이름을 넣는 것도 방법이에요(필요하면 추가해 드릴게요).
- 네이버 카페/밴드(시니어, 50·60대, 주부 커뮤니티) 규칙을 지켜 소개하세요. 무분별한 홍보는 차단돼요.
- 스토어 리뷰 요청은 3일 이상 사용한 사용자에게만 하세요.
- 알림 시간은 오전 7~8시가 반응이 좋아요.
