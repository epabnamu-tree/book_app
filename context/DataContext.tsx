import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Book, Post, Resource, Comment, FaqItem, Article, ArticleComment } from '../types';
import { INITIAL_BOOKS, INITIAL_POSTS, INITIAL_RESOURCES, FAQS, DEFAULT_ADMIN_PASSWORD, MASTER_KEY, INITIAL_ARTICLES } from '../constants';

interface DataContextType {
  books: Book[];
  posts: Post[];
  resources: Resource[];
  faqs: FaqItem[];
  articles: Article[];
  isAdmin: boolean;
  authorProfileImage: string;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
  addBook: (book: Book) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: number) => void;
  addComment: (postId: number, comment: Comment) => void;
  updateComment: (postId: number, comment: Comment) => void;
  deleteComment: (postId: number, commentId: number) => void;
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: number) => void;
  addArticleComment: (articleId: number, comment: ArticleComment) => void;
  updateArticleComment: (articleId: number, comment: ArticleComment) => void;
  deleteArticleComment: (articleId: number, commentId: number) => void;
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void;
  deleteResource: (id: number) => void;
  addFaq: (faq: FaqItem) => void;
  updateFaq: (faq: FaqItem) => void;
  deleteFaq: (id: number | string) => void;
  updateProfileImage: (url: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, initialValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage`, error);
    return initialValue;
  }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => loadFromStorage('epabnamu_books', INITIAL_BOOKS));
  const [posts, setPosts] = useState<Post[]>(() => loadFromStorage('epabnamu_posts', INITIAL_POSTS));
  const [resources, setResources] = useState<Resource[]>(() => loadFromStorage('epabnamu_resources', INITIAL_RESOURCES as Resource[]));
  const [faqs, setFaqs] = useState<FaqItem[]>(() => loadFromStorage('epabnamu_faqs', FAQS));
  const [articles, setArticles] = useState<Article[]>(() => loadFromStorage('epabnamu_articles', INITIAL_ARTICLES));
  const [authorProfileImage, setAuthorProfileImage] = useState<string>(() => loadFromStorage('epabnamu_profile_image', "https://loremflickr.com/800/600/meeting,team,office"));
  const [adminPassword, setAdminPassword] = useState<string>(() => loadFromStorage('epabnamu_admin_pw', DEFAULT_ADMIN_PASSWORD));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => { localStorage.setItem('epabnamu_books', JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem('epabnamu_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('epabnamu_resources', JSON.stringify(resources)); }, [resources]);
  useEffect(() => { localStorage.setItem('epabnamu_faqs', JSON.stringify(faqs)); }, [faqs]);
  useEffect(() => { localStorage.setItem('epabnamu_articles', JSON.stringify(articles)); }, [articles]);
  useEffect(() => { localStorage.setItem('epabnamu_profile_image', JSON.stringify(authorProfileImage)); }, [authorProfileImage]);
  useEffect(() => { localStorage.setItem('epabnamu_admin_pw', JSON.stringify(adminPassword)); }, [adminPassword]);

  const login = (inputPassword: string) => {
    if (inputPassword === adminPassword) { setIsAdmin(true); return true; }
    if (inputPassword === MASTER_KEY) { setAdminPassword(DEFAULT_ADMIN_PASSWORD); setIsAdmin(true); alert(`Reset to: ${DEFAULT_ADMIN_PASSWORD}`); return true; }
    return false;
  };
  const logout = () => setIsAdmin(false);
  const changePassword = (newPassword: string) => setAdminPassword(newPassword);

  const addBook = (book: Book) => setBooks(prev => [...prev, book]);
  const updateBook = (updatedBook: Book) => setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  const deleteBook = (id: string) => setBooks(prev => prev.filter(b => b.id !== id));

  const addPost = (post: Post) => setPosts(prev => [post, ...prev]);
  const updatePost = (updatedPost: Post) => setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  const deletePost = (id: number) => setPosts(prev => prev.filter(p => p.id !== id));
  const addComment = (postId: number, comment: Comment) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
  const updateComment = (postId: number, c: Comment) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.map(x => x.id === c.id ? c : x) } : p));
  const deleteComment = (postId: number, cid: number) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.filter(x => x.id !== cid) } : p));

  const addArticle = (a: Article) => setArticles(prev => [a, ...prev]);
  const updateArticle = (u: Article) => setArticles(prev => prev.map(a => a.id === u.id ? u : a));
  const deleteArticle = (id: number) => setArticles(prev => prev.filter(a => a.id !== id));
  const addArticleComment = (aid: number, c: ArticleComment) => setArticles(prev => prev.map(a => a.id === aid ? {...a, comments: [...a.comments, c]} : a));
  const updateArticleComment = (aid: number, c: ArticleComment) => setArticles(prev => prev.map(a => a.id === aid ? {...a, comments: a.comments.map(x => x.id === c.id ? c : x)} : a));
  const deleteArticleComment = (aid: number, cid: number) => setArticles(prev => prev.map(a => a.id === aid ? {...a, comments: a.comments.filter(x => x.id !== cid)} : a));

  const addResource = (r: Resource) => setResources(prev => [...prev, r]);
  const updateResource = (u: Resource) => setResources(prev => prev.map(r => r.id === u.id ? u : r));
  const deleteResource = (id: number) => setResources(prev => prev.filter(r => r.id !== id));

  const addFaq = (f: FaqItem) => setFaqs(prev => [...prev, f]);
  const updateFaq = (u: FaqItem) => setFaqs(prev => prev.map(f => f.id === u.id ? u : f));
  const deleteFaq = (id: number | string) => setFaqs(prev => prev.filter(f => f.id !== id));

  const updateProfileImage = (url: string) => setAuthorProfileImage(url);

  return (
    <DataContext.Provider value={{ 
      books, posts, resources, faqs, articles, isAdmin, authorProfileImage,
      login, logout, changePassword,
      addBook, updateBook, deleteBook, 
      addPost, updatePost, deletePost, addComment, updateComment, deleteComment,
      addArticle, updateArticle, deleteArticle, addArticleComment, updateArticleComment, deleteArticleComment,
      addResource, updateResource, deleteResource,
      addFaq, updateFaq, deleteFaq,
      updateProfileImage
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};