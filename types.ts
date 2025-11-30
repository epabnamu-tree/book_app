export interface Book {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  description: string;
  publishDate: string;
  publisher: string;
  chapters: BookChapter[]; // Kept for type compatibility
  tags: string[];
  purchaseUrl?: string;
  authorNote?: string;
  reviewsText?: string;
  tableOfContents?: string;
  category?: string; // New: Series or Category name
  isPinned?: boolean; // New: If true, fixed on Home page
}

export interface BookChapter {
  id: number;
  title: string;
  description: string;
}

export interface Review {
  id: number;
  bookId?: string; // Optional linkage to specific book
  author: string;
  role: string;
  content: string;
  rating: number;
}

export interface Post {
  id: number;
  bookId?: string; // Which book is this about?
  title: string;
  author: string;
  email?: string;     // Added for user identification
  password?: string;  // Added for editing/deleting
  date: string;
  content: string;
  tags: string[];
  comments: Comment[];
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  password?: string; // Added for editing/deleting
}

export interface Resource {
  id: number;
  bookId?: string; // Linked to a book
  title: string;
  type: 'PDF' | 'ZIP' | 'LINK';
  size?: string;
  description: string;
  url: string;
}

export interface FaqItem {
  id: string | number; // Added for management
  question: string;
  answer: string;
}