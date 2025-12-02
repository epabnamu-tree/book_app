
// constants.ts 파일의 내용을 아래 코드로 교체하세요.
export const APP_NAME = "이팝나무의 서재";
export const DEFAULT_ADMIN_PASSWORD = "slit0800@@";
export const MASTER_KEY = "ipannamoo2024!";
export const INITIAL_PROFILE_IMAGE = "https://i.imgur.com/AEoNPVC.jpeg";
export const INITIAL_BOOKS = [
  {
    "id": "insight",
    "title": "Insight: 미래를 읽는 통찰",
    "subtitle": "AI, 기본소득, 그리고 사회적 경제",
    "coverUrl": "https://i.imgur.com/FTNPDdy.png",
    "description": "AI 시대의 새로운 해법, 기본소득과 사회적 경제를 말하다. 기술의 발전 속에서 인간의 가치를 지키는 방법을 제시합니다.",
    "publishDate": "2024. 10. 01",
    "publisher": "미래지향",
    "tags": [
      "Economics",
      "AI",
      "Future"
    ],
    "purchaseLinks": {
      "kyobo": "https://www.kyobobook.co.kr/",
      "aladin": "https://www.aladin.co.kr/",
      "yes24": "https://www.yes24.com/"
    },
    "format": [
      "종이책",
      "전자책"
    ],
    "authorNote": "이 책은 저희 연구그룹이 지난 5년간 AI 연구소와 사회적 기업 현장에서 치열하게 고민했던 기록입니다.",
    "reviewsText": "\"AI 시대의 필독서.\"",
    "tableOfContents": "1부. 기술의 역설\n2부. 새로운 안전망",
    "chapters": [],
    "category": "함께 배우는 인공지능",
    "isPinned": false
  },
  {
    "id": "coop-economy",
    "title": "모두를 위한 경제",
    "subtitle": "협동조합으로 만드는 지속가능한 삶",
    "coverUrl": "https://i.imgur.com/Rchcbsa.png",
    "description": "무한 경쟁의 시대는 끝났다. 함께 잘 사는 방법을 고민하는 협동조합의 역사와 실제 사례를 통해 대안 경제를 모색합니다.",
    "publishDate": "2023. 05. 15",
    "publisher": "열린세상",
    "tags": [
      "Economy",
      "Social",
      "History"
    ],
    "purchaseLinks": {
      "kyobo": "https://www.kyobobook.co.kr/"
    },
    "format": [
      "종이책"
    ],
    "authorNote": "경쟁만이 살 길이라고 외치는 세상에서 '협동'의 가치를 말하고 싶었습니다.",
    "reviewsText": "\"협동조합이 구시대의 유물이 아니라 미래의 대안임을 명쾌하게 증명한다.\"",
    "tableOfContents": "제1장: 호모 이코노미쿠스의 오해",
    "chapters": [],
    "category": "함께 배우는 인공지능",
    "isPinned": true
  },
  {
    "id": "ai-ethics",
    "title": "테스트 도서001",
    "subtitle": "시골풍경",
    "coverUrl": "https://i.imgur.com/tGC7ut4.jpeg",
    "description": "강이 흐르는 마을",
    "publishDate": "2024. 01. 20",
    "publisher": "테크북스",
    "tags": [
      "AI",
      "Ethics",
      "Tech"
    ],
    "purchaseLinks": {},
    "format": [
      "전자책"
    ],
    "category": "함께 배우는 인공지능",
    "isPinned": true,
    "chapters": []
  },
  {
    "id": "future-work",
    "title": "일의 미래",
    "subtitle": "로봇과 함께 일하는 법",
    "coverUrl": "https://i.imgur.com/NLrOAp9.jpeg",
    "description": "자동화 시대, 인간의 노동은 어떻게 변화할 것인가?",
    "publishDate": "2023. 11. 10",
    "publisher": "미래지향",
    "tags": [
      "Work",
      "Future"
    ],
    "purchaseLinks": {},
    "format": [
      "종이책"
    ],
    "category": "사회과학",
    "isPinned": false,
    "chapters": []
  }
];
export const INITIAL_RESOURCES = [
  {
    "id": 1,
    "bookId": "insight",
    "title": "참고 문헌 리스트 (Full Bibliography)",
    "type": "PDF",
    "size": "1.2MB",
    "description": "본문에 인용된 모든 논문과 서적의 목록입니다.",
    "url": "#",
    "category": "PUBLIC"
  },
  {
    "id": 2,
    "bookId": "insight",
    "title": "챕터별 토론 가이드북",
    "type": "PDF",
    "size": "3.5MB",
    "description": "독서 모임을 위한 질문지와 가이드라인입니다.",
    "url": "#",
    "category": "BOOK",
    "downloadCode": "biepa@1234"
  }
];
export const INITIAL_POSTS = [
  {
    "id": 1,
    "bookId": "insight",
    "title": "기본소득이 정말 근로 의욕을 떨어뜨릴까요?",
    "author": "토론왕",
    "email": "user1@example.com",
    "password": "123",
    "date": "2023-10-25",
    "content": "책의 2장을 읽고 궁금증이 생겼습니다. 여러분의 생각은 어떠신가요?",
    "tags": [
      "기본소득",
      "질문"
    ],
    "comments": [
      {
        "id": 101,
        "author": "현실주의자",
        "content": "실험 결과에 따르면 꼭 그렇지만은 않다고 합니다.",
        "date": "2023-10-26",
        "password": "123"
      }
    ]
  }
];
export const INITIAL_ARTICLES = [
  {
    "id": 1764652483081,
    "title": "컬럼 66",
    "content": "컬럼 66",
    "author": "이팝나무",
    "date": "2025-12-02",
    "tags": [
      "칼럼"
    ],
    "comments": []
  },
  {
    "id": 1764652472969,
    "title": "컬럼 55",
    "content": "컬럼 55",
    "author": "이팝나무",
    "date": "2025-12-02",
    "tags": [
      "칼럼"
    ],
    "comments": []
  },
  {
    "id": 1764647910269,
    "title": "컬럼44",
    "content": "컬럼44 테스트",
    "author": "이팝나무",
    "date": "2025-12-02",
    "tags": [
      "칼럼"
    ],
    "comments": []
  }
];
export const FAQS = [
  {
    "id": 1,
    "question": "강연 요청은 어떻게 하나요?",
    "answer": "문의하기 페이지의 폼을 작성해주시거나 이메일로 연락 주시면 일정 확인 후 회신 드립니다."
  },
  {
    "id": 1764647834184,
    "question": "구독은 어떻게 하나요?",
    "answer": "구독 버튼을 누르세요"
  },
  {
    "id": 1764647929721,
    "question": "구독은",
    "answer": "버튼 누르세요"
  }
];
export const CHAPTERS = [ { id: 1, title: "1장", description: "내용" } ];
    