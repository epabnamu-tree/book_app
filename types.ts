export interface Book {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  description: string;
  publishDate: string;
  publisher: string;
  chapters: BookChapter[];
  tags: string[];
  purchaseLinks?: {
    kyobo?: string;
    aladin?: string;
    yes24?: string;
    other?: string;
  };
  format?: string[]; 
  authorNote?: string;
  reviewsText?: string;
  tableOfContents?: string;
  category?: string; 
  isPinned?: boolean; 
}

export interface BookChapter {
  id: number;
  title: string;
  description: string;
}

export interface Review {
  id: number;
  bookId?: string; 
  author: string;
  role: string;
  content: string;
  rating: number;
}

export interface Post {
  id: number;
  bookId?: string;
  title: string;
  author: string;
  email?: string;
  password?: string;
  date: string;
  content: string;
  tags: string[];
  comments: Comment[];
  isHidden?: boolean;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  password?: string; 
  isHidden?: boolean;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string; 
  tags: string[];
  isHidden?: boolean;
  comments: ArticleComment[];
}

export interface ArticleComment {
  id: number;
  author: string;
  content: string;
  date: string;
  password?: string; 
  isHidden?: boolean; 
}

export interface Resource {
  id: number;
  bookId?: string;
  title: string;
  type: 'PDF' | 'ZIP' | 'LINK';
  size?: string;
  description: string; // 한줄 설명
  detailedDescription?: string; // 상세 설명
  url: string;
  category?: 'PUBLIC' | 'BOOK'; 
  downloadCode?: string; 
}

export interface FaqItem {
  id: string | number; 
  question: string;
  answer: string;
}