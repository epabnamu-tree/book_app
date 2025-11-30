import { Book, Review, Post, Resource, FaqItem } from './types';

export const APP_NAME = "이팝나무의 서재";

export const DEFAULT_ADMIN_PASSWORD = "admin123";
export const MASTER_KEY = "epabnamu2025!";

export const INITIAL_BOOKS: Book[] = [
  {
    id: "insight",
    title: "Insight: 미래를 읽는 통찰",
    subtitle: "AI, 기본소득, 그리고 사회적 경제",
    coverUrl: "https://loremflickr.com/600/900/book,cover,blue",
    description: "AI 시대의 새로운 해법, 기본소득과 사회적 경제를 말하다. 기술의 발전 속에서 인간의 가치를 지키는 방법을 제시합니다.",
    publishDate: "2024. 10. 01",
    publisher: "미래지향",
    tags: ["Economics", "AI", "Future"],
    purchaseUrl: "https://www.kyobobook.co.kr/",
    authorNote: "이 책은 저희 연구그룹이 지난 5년간 AI 연구소와 사회적 기업 현장에서 치열하게 고민했던 기록입니다.\n\n기술은 차갑지만, 그 기술이 닿는 곳은 사람이어야 합니다. 우리는 지금 중요한 갈림길에 서 있습니다. 기술이 소수의 전유물이 될 것인가, 아니면 모두를 위한 도구가 될 것인가.\n\n이 책이 독자 여러분께 작은 나침반이 되기를 바랍니다.",
    reviewsText: "\"AI 시대의 필독서. 경제학적 통찰과 인문학적 깊이가 어우러진 수작이다.\" - 김철수 (경제학 교수)\n\n\"기술 만능주의에 대한 따끔한 일침이자, 따뜻한 대안을 제시하는 책.\" - 이영희 (AI 스타트업 CEO)\n\n\"미래를 준비하는 모든 이들에게 권하고 싶다.\" - 박민수 (미래학자)",
    tableOfContents: "프롤로그: 변화의 파도 앞에서\n\n1부. 기술의 역설\n제1장 AI의 도래와 노동의 종말\n제2장 풍요 속의 빈곤, 무엇이 문제인가\n\n2부. 새로운 안전망\n제3장 기본소득, 필연적 선택인가?\n제4장 실험 사례로 보는 기본소득의 효과\n\n3부. 공존을 위한 경제\n제5장 사회적 경제와 공동체의 회복\n제6장 협동조합, 경쟁을 넘어 협력으로\n\n에필로그: 우리는 어떤 미래를 선택할 것인가",
    chapters: [] // Deprecated in favor of tableOfContents string
  },
  {
    id: "coop-economy",
    title: "모두를 위한 경제",
    subtitle: "협동조합으로 만드는 지속가능한 삶",
    coverUrl: "https://loremflickr.com/600/900/book,cover,green",
    description: "무한 경쟁의 시대는 끝났다. 함께 잘 사는 방법을 고민하는 협동조합의 역사와 실제 사례를 통해 대안 경제를 모색합니다.",
    publishDate: "2023. 05. 15",
    publisher: "열린세상",
    tags: ["Economy", "Social", "History"],
    purchaseUrl: "https://www.kyobobook.co.kr/",
    authorNote: "경쟁만이 살 길이라고 외치는 세상에서 '협동'의 가치를 말하고 싶었습니다.\n혼자 가면 빨리 가지만, 함께 가면 멀리 간다는 옛말이 경제 시스템에서도 유효함을 증명하고 싶었습니다.",
    reviewsText: "\"협동조합이 구시대의 유물이 아니라 미래의 대안임을 명쾌하게 증명한다.\"\n\n\"이론과 실제가 균형 잡힌 최고의 경제 교양서.\"",
    tableOfContents: "제1장: 호모 이코노미쿠스의 오해\n제2장: 협동조합의 탄생과 역사\n제3장: 세계의 성공적인 협동조합 모델\n제4장: 플랫폼 자본주의와 플랫폼 협동조합\n제5장: 지속 가능한 삶을 위하여",
    chapters: []
  }
];

export const CHAPTERS = INITIAL_BOOKS[0].chapters;

export const REVIEWS: Review[] = [
  { id: 1, bookId: "insight", author: "김철수", role: "경제학 교수", content: "AI 시대의 불확실성을 꿰뚫어보는 날카로운 통찰이 돋보이는 책입니다.", rating: 5 },
  { id: 2, bookId: "insight", author: "이영희", role: "AI 스타트업 CEO", content: "기술자로서 놓치고 있었던 사회적 책임에 대해 깊이 고민하게 되었습니다.", rating: 5 },
  { id: 3, bookId: "coop-economy", author: "박민수", role: "협동조합 활동가", content: "현장에서 필요한 실질적인 조언이 가득합니다.", rating: 4 },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    bookId: "insight",
    title: "기본소득이 정말 근로 의욕을 떨어뜨릴까요?",
    author: "토론왕",
    email: "user1@example.com",
    password: "123",
    date: "2023-10-25",
    content: "책의 2장을 읽고 궁금증이 생겼습니다. 여러분의 생각은 어떠신가요?",
    tags: ["기본소득", "질문"],
    comments: [
      { id: 101, author: "현실주의자", content: "실험 결과에 따르면 꼭 그렇지만은 않다고 합니다.", date: "2023-10-26" }
    ]
  },
  {
    id: 2,
    bookId: "insight",
    title: "AI 창작물의 저작권 문제에 대해",
    author: "크리에이터",
    email: "user2@example.com",
    password: "123",
    date: "2023-10-28",
    content: "4장에서 다룬 법적 문제들이 흥미롭네요. AI가 만든 그림은 누구의 것일까요?",
    tags: ["AI", "윤리"],
    comments: []
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  { id: 1, bookId: "insight", title: "참고 문헌 리스트 (Full Bibliography)", type: "PDF", size: "1.2MB", description: "본문에 인용된 모든 논문과 서적의 목록입니다.", url: "#" },
  { id: 2, bookId: "insight", title: "챕터별 토론 가이드북", type: "PDF", size: "3.5MB", description: "독서 모임을 위한 질문지와 가이드라인입니다.", url: "#" },
  { id: 3, bookId: "coop-economy", title: "협동조합 설립 메뉴얼", type: "ZIP", size: "15MB", description: "실무자를 위한 표준 정관 및 설립 신고서 양식 모음.", url: "#" },
];

export const FAQS: FaqItem[] = [
  { question: "강연 요청은 어떻게 하나요?", answer: "문의 페이지의 폼을 통해 '강연 요청' 카테고리를 선택하여 보내주시면 담당자가 연락드립니다." },
  { question: "대량 구매 할인이 가능한가요?", answer: "네, 20권 이상 구매 시 출판사를 통해 할인 혜택을 받으실 수 있습니다." },
  { question: "차기작 출간 예정일은 언제인가요?", answer: "현재 '디지털 휴머니즘'을 주제로 연구 및 집필 중이며, 내년 상반기 출간 예정입니다." },
];