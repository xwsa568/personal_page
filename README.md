# My Space

Liquid Glass에서 영감을 받은 개인 홈페이지. HTML, CSS, JavaScript만 사용하며 빌드와 패키지 설치 없이 GitHub Pages에서 동작합니다. Apple 공식 컴포넌트가 아닌 웹 기반 재해석입니다.

## 내 정보로 바꾸기

`public/profile.js`에서 이름, 소개, 관심사, 이메일, GitHub 주소와 프로젝트를 수정하세요. 실제 정보로 바꾼 후 `isTemplate: false`로 설정하면 예시 안내가 사라집니다. 빈 연락처는 화면에 표시하지 않습니다. 프로젝트 주소는 `https://`로 시작하는 완전한 주소를 사용하세요. 모든 프로필 정보는 공개됩니다.

`publications` 배열에 논문 제목(`title`), 저자(`authors`), 학회/저널(`venue`), 연도(`year`), 자료 링크(`links`)를 넣으면 Publications 탭에 표시됩니다. 배열이 비어 있으면 준비 중 안내가 표시됩니다. 실제 논문을 임의로 생성하지 않습니다.

상단은 Home / Publications / Projects / About 탭입니다. 클릭하거나 누른 채 옆으로 드래그하면 유리 캡슐이 이동합니다. 놓은 위치에서 가장 가까운 탭이 선택됩니다. 방향키, Home/End 키, 터치 드래그를 지원하며 URL의 `#publications` 같은 주소로 해당 탭을 바로 열 수 있습니다.

- `public/index.html`: 화면 구성과 메인 문구
- `public/style.css`: 색상, 유리 효과, 반응형 레이아웃
- `public/app.js`: 프로필 표시, 드래그 탭 전환, 프로젝트 설명
- `public/theme-switch.js`: 유리 스위치, 클릭·드래그·키보드 테마 전환
- `public/theme-init.js`: 첫 화면 표시 전 저장된 테마 복원
- `public/liquid-tabs.js`: 굴절 엔진 연결, 스프링 애니메이션, 마우스/터치/키보드 탭 제어
- `public/vendor/`: 실제 SVG 굴절 엔진 및 MIT 라이선스, 원본 버전 기록
- `public/favicon.svg`: 브라우저 아이콘

## 로컬 미리보기

프로젝트 폴더에서 실행:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory public
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다.

## GitHub Pages에 공개하기

1. GitHub에 공개 저장소를 생성하고 이 폴더를 `main` 브랜치로 올립니다.
2. 저장소의 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
3. **Actions → Publish personal website → Run workflow**를 실행합니다. 이후 `main`에 변경 사항을 올릴 때마다 자동으로 배포됩니다.
4. 완료된 작업의 `github-pages` 환경 링크에서 사이트를 확인합니다.

일반 저장소는 `https://USERNAME.github.io/REPOSITORY/`, `USERNAME.github.io`라는 이름의 저장소는 `https://USERNAME.github.io/`로 공개됩니다. 모든 내부 파일 주소는 상대 경로라 양쪽 모두 지원합니다. 워크플로는 `public` 폴더만 공개합니다.

공식 문서: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 도메인은 나중에

도메인을 구매한 뒤 저장소 **Settings → Pages → Custom domain**에서 연결할 수 있습니다. 도메인 업체에 GitHub가 안내하는 DNS 레코드를 설정하고 HTTPS를 활성화하세요. 현재는 도메인 관련 설정이 필요하지 않습니다. 연결 시 `public/CNAME` 파일에 실제 도메인 한 줄을 넣으면 배포 파일에도 포함됩니다.

공식 문서: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## 디자인 및 접근성

- 기본은 흰색 배경과 시스템 서체. 배경 장식이나 자동 시스템 테마 전환 없음
- 상단 유리 스위치로 다크 모드 전환. 클릭, 드래그, Space/Enter 및 방향키 지원. 선택은 이 브라우저에 저장되며 새로고침 후 복원
- 스위치도 탭과 동일한 SVG 굴절 엔진을 사용하며 Aave의 유리 손잡이 인터랙션을 참고
- 탭 글자 13px, 버튼 높이 32px, 바 높이 38px. 평소에는 30px 높이의 회색 선택 표시, 누르는 동안에는 50px 높이의 투명 유리 캡슐로 확대. 드래그 후 놓으면 선택한 탭에서 다시 축소
- Aave의 유리 탭 동작을 참고하고 `liquid-glass-web-react`의 프레임워크 독립 엔진을 사용. 캡슐 아래 실제 탭 픽셀에 SVG 변위 및 색 분리 효과 적용
- 휴대폰/태블릿/데스크톱 반응형 구성
- 키보드 포커스, 본문 바로가기, 네이티브 프로젝트 대화상자 및 Escape 닫기
- 움직임 최소화 설정 지원. 배경 흐림 미지원 브라우저에서도 테두리와 그림자 유지
- 외부 폰트 요청 없이 운영체제 기본 서체 사용

굴절은 전체 페이지가 아닌 작은 탭 영역에만 적용합니다. 브라우저의 렌더링 기능에 따라 외관 차이가 있을 수 있습니다. 코드와 라이선스 출처는 `public/vendor/README.md`에 기록되어 있습니다.

처음 제공되는 이름과 소개는 예시이며 두 번째 프로젝트는 비어 있는 다음 작업 자리입니다. 실제 이력이나 외부 프로젝트를 임의로 넣지 않았습니다.

### Home profile and news

`public/profile.js`에서 `photo`(이미지 경로), `photoAlt`, `intro`, `advisor`, `research`를 수정하면 홈에 반영됩니다. 기본 이미지는 `public/profile-placeholder.svg`입니다.

`news`에는 최신 항목부터 `{ date: "2026-09", text: "Your update.", url: "" }` 형식으로 추가하세요. 날짜는 `YYYY-MM` 또는 `YYYY-MM-DD`를 사용할 수 있고 링크는 생략 가능합니다. 처음 5개가 표시되며 6개부터 **Show older news**로 펼치고 **Show less**로 접을 수 있습니다. 실제 소식은 아직 입력하지 않았습니다.
