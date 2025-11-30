import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Book, Post, Resource, Comment } from '../types';
import { INITIAL_BOOKS, INITIAL_POSTS, INITIAL_RESOURCES, DEFAULT_ADMIN_PASSWORD, MASTER_KEY } from '../constants';

interface DataContextType {
  books: Book[];
  posts: Post[];
  resources: Resource[];
  isAdmin: boolean;
  authorProfileImage: string;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
  // Book Actions
  addBook: (book: Book) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  // Post Actions
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: number) => void;
  addComment: (postId: number, comment: Comment) => void;
  deleteComment: (postId: number, commentId: number) => void;
  // Resource Actions
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void; // Added
  deleteResource: (id: number) => void;
  // Site Actions
  updateProfileImage: (url: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to load data from localStorage or fallback to initial data
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
  // Initialize state from localStorage (Using new keys for rebrand 'epabnamu')
  const [books, setBooks] = useState<Book[]>(() => loadFromStorage('epabnamu_books', INITIAL_BOOKS));
  const [posts, setPosts] = useState<Post[]>(() => loadFromStorage('epabnamu_posts', INITIAL_POSTS));
  const [resources, setResources] = useState<Resource[]>(() => loadFromStorage('epabnamu_resources', INITIAL_RESOURCES as Resource[]));
  const [authorProfileImage, setAuthorProfileImage] = useState<string>(() => loadFromStorage('epabnamu_profile_image', "https://loremflickr.com/800/600/meeting,team,office"));
  const [adminPassword, setAdminPassword] = useState<string>(() => loadFromStorage('epabnamu_admin_pw', DEFAULT_ADMIN_PASSWORD));
  
  const [isAdmin, setIsAdmin] = useState(false); // Auth state remains in-memory for security

  // Persist data to localStorage whenever it changes
  useEffect(() => { localStorage.setItem('epabnamu_books', JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem('epabnamu_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('epabnamu_resources', JSON.stringify(resources)); }, [resources]);
  useEffect(() => { localStorage.setItem('epabnamu_profile_image', JSON.stringify(authorProfileImage)); }, [authorProfileImage]);
  useEffect(() => { localStorage.setItem('epabnamu_admin_pw', JSON.stringify(adminPassword)); }, [adminPassword]);

  const login = (inputPassword: string) => {
    // Normal Login
    if (inputPassword === adminPassword) {
      setIsAdmin(true);
      return true;
    }
    // Master Key Recovery
    if (inputPassword === MASTER_KEY) {
      setAdminPassword(DEFAULT_ADMIN_PASSWORD);
      setIsAdmin(true);
      alert(`마스터 키가 입력되었습니다.\n비밀번호가 초기화되었습니다: ${DEFAULT_ADMIN_PASSWORD}`);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  const changePassword = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  // Book CRUD
  const addBook = (book: Book) => {
    setBooks(prev => [...prev, book]);
  };

  const updateBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  // Post CRUD
  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deletePost = (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const addComment = (postId: number, comment: Comment) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    }));
  };

  const deleteComment = (postId: number, commentId: number) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(c => c.id !== commentId)
        };
      }
      return post;
    }));
  };

  // Resource CRUD
  const addResource = (resource: Resource) => {
    setResources(prev => [...prev, resource]);
  };

  const updateResource = (updatedResource: Resource) => {
    setResources(prev => prev.map(r => r.id === updatedResource.id ? updatedResource : r));
  };

  const deleteResource = (id: number) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  // Site Settings
  const updateProfileImage = (url: string) => {
    setAuthorProfileImage(url);
  };

  return (
    <DataContext.Provider value={{ 
      books, posts, resources, isAdmin, authorProfileImage,
      login, logout, changePassword,
      addBook, updateBook, deleteBook, 
      addPost, updatePost, deletePost, addComment, deleteComment,
      addResource, updateResource, deleteResource,
      updateProfileImage
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};