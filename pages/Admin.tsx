import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Trash2, Edit, Save, X, FileText, Download, Link as LinkIcon, Image, Key, Pin, HelpCircle, BookOpen, ShoppingCart, PenTool, Eye, EyeOff, MessageSquare, RotateCcw } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Book, Resource, FaqItem, Article, Post, Comment, ArticleComment } from '../types';

// ... (Utility functions convertGoogleDriveLink, getDirectImageUrl keep same) ...
const convertGoogleDriveLink = (url: string) => {
  if (!url || !url.includes('drive.google.com')) return url;
  const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  return url;
};

const getDirectImageUrl = (url: string) => {
  if (!url) return "";
  const driveLink = convertGoogleDriveLink(url);
  if (driveLink !== url) return driveLink;
  if (url.includes('imgur.com')) {
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) return url;
    if (url.includes('/a/') || url.includes('/gallery/')) return "ERROR_ALBUM";
    const idMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)/);
    if (idMatch && idMatch[1]) return `https://i.imgur.com/${idMatch[1]}.jpg`;
  }
  return url;
};

const Admin: React.FC = () => {
  const { 
    isAdmin, login, logout, changePassword,
    books, addBook, updateBook, deleteBook,
    posts, updatePost, deletePost, updateComment, deleteComment,
    resources, addResource, updateResource, deleteResource,
    faqs, addFaq, updateFaq, deleteFaq,
    articles, addArticle, updateArticle, deleteArticle, updateArticleComment, deleteArticleComment,
    authorProfileImage, updateProfileImage
  } = useData();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'book' | 'resource' | 'community' | 'article' | 'faq' | 'site'>('book');
  const [exportCode, setExportCode] = useState("");

  // --- States ---
  const [isEditingBook, setIsEditingBook] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [bookForm, setBookForm] = useState<Partial<Book>>({ 
    title: "", subtitle: "", description: "", publisher: "", coverUrl: "", 
    purchaseLinks: { kyobo: "", aladin: "", yes24: "", other: "" }, 
    format: [], tags: [], authorNote: "", reviewsText: "", tableOfContents: "", category: "", isPinned: false 
  });
  
  const [isEditingResource, setIsEditingResource] = useState<number | null>(null);
  const [resourceForm, setResourceForm] = useState<Partial<Resource>>({ title: "", type: "PDF", description: "", url: "", size: "", bookId: "", category: "PUBLIC", downloadCode: "" });
  
  const [isEditingFaq, setIsEditingFaq] = useState<number | string | null>(null);
  const [faqForm, setFaqForm] = useState<Partial<FaqItem>>({ question: "", answer: "" });
  
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const [isEditingArticle, setIsEditingArticle] = useState<number | null>(null);
  const [articleForm, setArticleForm] = useState<{title: string, content: string, tags: string}>({ title: "", content: "", tags: "" });

  // Community Management States
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingComment, setEditingComment] = useState<{postId: number, comment: Comment} | null>(null);

  useEffect(() => { setProfileImageUrl(authorProfileImage); setPreviewUrl(authorProfileImage); }, [authorProfileImage]);

  useEffect(() => {
    const code = `
// constants.ts 파일의 내용을 아래 코드로 교체하세요.
export const APP_NAME = "이팝나무의 서재";
export const DEFAULT_ADMIN_PASSWORD = "slit0800@@";
export const MASTER_KEY = "ipannamoo2024!";
export const INITIAL_BOOKS = ${JSON.stringify(books, null, 2)};
export const INITIAL_RESOURCES = ${JSON.stringify(resources, null, 2)};
export const INITIAL_POSTS = ${JSON.stringify(posts, null, 2)};
export const INITIAL_ARTICLES = ${JSON.stringify(articles, null, 2)};
export const FAQS = ${JSON.stringify(faqs, null, 2)};
export const CHAPTERS = [ { id: 1, title: "1장", description: "내용" } ];
    `;
    setExportCode(code);
  }, [books, resources, posts, articles, faqs]);

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); if (login(password)) setError(""); else setError("비밀번호가 올바르지 않습니다."); };
  const handleResetPassword = () => { const key = prompt("마스터 키 입력"); if (key && login(key)) setError(""); else alert("실패"); };
  const handleFactoryReset = () => {
      if (window.confirm("경고: 모든 데이터를 초기화합니다!\n\n현재 웹사이트에 저장된 모든 글, 댓글, 설정이 삭제되고 constants.ts에 정의된 초기 상태(책 4권 등)로 되돌아갑니다.\n\n정말 진행하시겠습니까?")) {
          // 명시적으로 모든 키 삭제
          localStorage.removeItem('epabnamu_books');
          localStorage.removeItem('epabnamu_posts');
          localStorage.removeItem('epabnamu_resources');
          localStorage.removeItem('epabnamu_faqs');
          localStorage.removeItem('epabnamu_articles');
          localStorage.removeItem('epabnamu_profile_image');
          localStorage.removeItem('epabnamu_admin_pw');
          
          // 전체 삭제 (안전장치)
          localStorage.clear();
          
          alert("초기화되었습니다. 페이지를 새로고침합니다.");
          window.location.reload();
      }
  };

  // Book
  const resetBookForm = () => { 
      setBookForm({ title: "", subtitle: "", description: "", publisher: "", coverUrl: "https://loremflickr.com/600/900/book,cover,abstract", purchaseLinks: { kyobo: "", aladin: "", yes24: "", other: "" }, format: [], tags: [], authorNote: "", reviewsText: "", tableOfContents: "", category: "", isPinned: false }); 
      setTagsInput(""); setIsEditingBook(null); 
  };
  const handleEditBook = (book: Book) => { setIsEditingBook(book.id); setBookForm({ ...book, purchaseLinks: book.purchaseLinks || { kyobo: "", aladin: "", yes24: "", other: "" } }); setTagsInput(book.tags.join(', ')); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleSaveBook = (e: React.FormEvent) => { 
     e.preventDefault(); 
     const currentTags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
     const processedCoverUrl = getDirectImageUrl(bookForm.coverUrl || "");
     if (processedCoverUrl === "ERROR_ALBUM") { alert("Imgur Album Error"); return; }
     const bookData: Book = { ...bookForm as Book, coverUrl: processedCoverUrl, id: isEditingBook || bookForm.title?.toLowerCase().replace(/\s+/g, '-') || `book-${Date.now()}`, publishDate: bookForm.publishDate || new Date().toISOString().split('T')[0], tags: currentTags.length > 0 ? currentTags : ["New"], chapters: [] };
     if (isEditingBook) updateBook(bookData); else addBook(bookData); 
     resetBookForm();
  };
  const toggleFormat = (fmt: string) => { const current = bookForm.format || []; if (current.includes(fmt)) setBookForm({...bookForm, format: current.filter(f => f !== fmt)}); else setBookForm({...bookForm, format: [...current, fmt]}); };

  // Article
  const resetArticleForm = () => { setArticleForm({ title: "", content: "", tags: "" }); setIsEditingArticle(null); };
  const handleEditArticle = (art: Article) => { setIsEditingArticle(art.id); setArticleForm({ title: art.title, content: art.content, tags: art.tags.join(', ') }); };
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const tagList = articleForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    const newArticle: Article = {
        id: isEditingArticle || Date.now(),
        title: articleForm.title,
        content: articleForm.content,
        author: "이팝나무",
        date: new Date().toISOString().split('T')[0],
        tags: tagList.length > 0 ? tagList : ["칼럼"],
        comments: isEditingArticle ? articles.find(a => a.id === isEditingArticle)?.comments || [] : []
    };
    if (isEditingArticle) updateArticle(newArticle); else addArticle(newArticle);
    alert("저장되었습니다."); resetArticleForm();
  };
  const toggleArticleCommentBlind = (articleId: number, comment: ArticleComment) => {
      updateArticleComment(articleId, { ...comment, isHidden: !comment.isHidden });
  };

  // Resource
  const resetResourceForm = () => { setResourceForm({ title: "", type: "PDF", description: "", url: "", size: "", bookId: "", category: "PUBLIC", downloadCode: "" }); setIsEditingResource(null); };
  const handleEditResource = (res: Resource) => { setIsEditingResource(res.id); setResourceForm(res); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleSaveResource = (e: React.FormEvent) => { e.preventDefault(); const resData: Resource = { id: isEditingResource || Date.now(), title: resourceForm.title!, type: resourceForm.type as any, description: resourceForm.description || "", url: resourceForm.url || "#", size: resourceForm.size || "", bookId: resourceForm.bookId || "", category: resourceForm.category || "PUBLIC", downloadCode: resourceForm.category === 'BOOK' ? resourceForm.downloadCode : undefined }; if(isEditingResource) updateResource(resData); else addResource(resData); resetResourceForm(); };

  // FAQ
  const resetFaqForm = () => { setFaqForm({ question: "", answer: "" }); setIsEditingFaq(null); };
  const handleEditFaq = (faq: FaqItem) => { setIsEditingFaq(faq.id); setFaqForm(faq); };
  const handleSaveFaq = (e: React.FormEvent) => { e.preventDefault(); const d: FaqItem = { id: isEditingFaq || Date.now(), question: faqForm.question!, answer: faqForm.answer! }; if(isEditingFaq) updateFaq(d); else addFaq(d); resetFaqForm(); };

  // Site
  const handleProfileImageChange = (val: string) => { setProfileImageUrl(val); const d = getDirectImageUrl(val); if(d !== "ERROR_ALBUM") setPreviewUrl(d); };
  const handleSaveSiteSettings = (e: React.FormEvent) => { e.preventDefault(); const d = getDirectImageUrl(profileImageUrl); if(d==="ERROR_ALBUM") { alert("Error"); return; } updateProfileImage(d); setProfileImageUrl(d); setPreviewUrl(d); alert("Saved"); };
  const handleChangePassword = (e: React.FormEvent) => { e.preventDefault(); if(newAdminPassword.length<4) { alert("Too short"); return; } changePassword(newAdminPassword); setNewAdminPassword(""); alert("Changed"); };

  // Community
  const togglePostBlind = (post: Post) => { updatePost({ ...post, isHidden: !post.isHidden }); };
  const toggleCommentBlind = (postId: number, comment: Comment) => { updateComment(postId, { ...comment, isHidden: !comment.isHidden }); };
  const saveEditedPost = () => { if(editingPost) { updatePost(editingPost); setEditingPost(null); } };
  const saveEditedComment = () => { if(editingComment) { updateComment(editingComment.postId, editingComment.comment); setEditingComment(null); } };

  if (!isAdmin) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
            <h1 className="text-2xl font-bold text-center mb-4">관리자 로그인</h1>
            <form onSubmit={handleLogin} className="space-y-4">
               <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 border rounded bg-white text-gray-900" placeholder="비밀번호" />
               {error && <p className="text-red-500 text-center">{error}</p>}
               <button className="w-full py-3 bg-primary text-white rounded font-bold">로그인</button>
               <button type="button" onClick={handleResetPassword} className="block w-full text-center text-sm text-gray-500 mt-2">비밀번호 초기화</button>
            </form>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary">관리자 CMS (Epabnamu)</h1>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"><LogOut size={16}/> 로그아웃</button>
        </div>
        <div className="flex space-x-2 mb-8 border-b border-gray-200 overflow-x-auto">
           {['book', 'article', 'community', 'resource', 'faq', 'site'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-3 font-medium rounded-t-lg transition-colors capitalize ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>
                 {tab === 'book' ? '도서' : tab === 'article' ? '글 나누기' : tab === 'community' ? '수다 떨기' : tab === 'resource' ? '자료실' : tab === 'faq' ? 'FAQ' : '사이트'}
              </button>
           ))}
        </div>
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
           
           {/* --- BOOK TAB --- */}
           {activeTab === 'book' && (
              <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                      <h2 className="text-xl font-bold mb-4">도서 등록/수정</h2>
                      <form onSubmit={handleSaveBook} className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                          <input type="text" placeholder="제목" value={bookForm.title} onChange={e=>setBookForm({...bookForm, title: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" required />
                          <input type="text" placeholder="부제" value={bookForm.subtitle} onChange={e=>setBookForm({...bookForm, subtitle: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="출판사" value={bookForm.publisher} onChange={e=>setBookForm({...bookForm, publisher: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                            <input type="text" placeholder="출판일" value={bookForm.publishDate} onChange={e=>setBookForm({...bookForm, publishDate: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                          </div>
                          <input type="text" placeholder="표지 URL" value={bookForm.coverUrl} onChange={e=>setBookForm({...bookForm, coverUrl: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                          <textarea placeholder="설명" value={bookForm.description} onChange={e=>setBookForm({...bookForm, description: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" required />
                          
                          <div className="p-4 border rounded bg-gray-50">
                             <h4 className="font-bold mb-2 text-xs text-gray-500">구매 링크</h4>
                             <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="교보문고 URL" value={bookForm.purchaseLinks?.kyobo || ""} onChange={e=>setBookForm({...bookForm, purchaseLinks: {...bookForm.purchaseLinks, kyobo: e.target.value}})} className="w-full p-2 border rounded bg-white text-gray-900 text-xs" />
                                <input type="text" placeholder="알라딘 URL" value={bookForm.purchaseLinks?.aladin || ""} onChange={e=>setBookForm({...bookForm, purchaseLinks: {...bookForm.purchaseLinks, aladin: e.target.value}})} className="w-full p-2 border rounded bg-white text-gray-900 text-xs" />
                                <input type="text" placeholder="YES24 URL" value={bookForm.purchaseLinks?.yes24 || ""} onChange={e=>setBookForm({...bookForm, purchaseLinks: {...bookForm.purchaseLinks, yes24: e.target.value}})} className="w-full p-2 border rounded bg-white text-gray-900 text-xs" />
                                <input type="text" placeholder="기타 URL" value={bookForm.purchaseLinks?.other || ""} onChange={e=>setBookForm({...bookForm, purchaseLinks: {...bookForm.purchaseLinks, other: e.target.value}})} className="w-full p-2 border rounded bg-white text-gray-900 text-xs" />
                             </div>
                          </div>
                          
                          <div className="flex gap-4 p-2 border rounded">
                             <label className="flex items-center gap-2"><input type="checkbox" checked={bookForm.format?.includes('종이책')} onChange={()=>toggleFormat('종이책')} /> 종이책</label>
                             <label className="flex items-center gap-2"><input type="checkbox" checked={bookForm.format?.includes('전자책')} onChange={()=>toggleFormat('전자책')} /> 전자책</label>
                             <label className="flex items-center gap-2 ml-auto text-red-500"><input type="checkbox" checked={bookForm.isPinned || false} onChange={e=>setBookForm({...bookForm, isPinned: e.target.checked})} /> 메인 고정</label>
                          </div>

                          <input type="text" placeholder="카테고리" value={bookForm.category} onChange={e=>setBookForm({...bookForm, category: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                          <input type="text" placeholder="태그 (쉼표 구분)" value={tagsInput} onChange={e=>setTagsInput(e.target.value)} className="w-full p-2 border rounded bg-white text-gray-900" />

                          <h4 className="font-bold mt-2 text-xs">상세 내용 (줄글 입력)</h4>
                          <textarea placeholder="저자 노트" value={bookForm.authorNote} onChange={e=>setBookForm({...bookForm, authorNote: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900 h-20" />
                          <textarea placeholder="서평 모음" value={bookForm.reviewsText} onChange={e=>setBookForm({...bookForm, reviewsText: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900 h-20" />
                          <textarea placeholder="목차 (줄바꿈으로 구분)" value={bookForm.tableOfContents} onChange={e=>setBookForm({...bookForm, tableOfContents: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900 h-20" />

                          <button className="w-full py-2 bg-primary text-white rounded">저장</button>
                          {isEditingBook && <button type="button" onClick={resetBookForm} className="w-full py-2 bg-gray-200 rounded">취소</button>}
                      </form>
                  </div>
                  <div className="h-[600px] overflow-y-auto">
                      <h2 className="text-xl font-bold mb-4">목록</h2>
                      {books.map(b => (
                          <div key={b.id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                  <img src={b.coverUrl} className="w-8 h-12 object-cover" alt="" />
                                  <div>
                                      <div className="font-bold">{b.title}</div>
                                      <div className="text-xs text-gray-500">{b.category} {b.isPinned && <span className="text-red-500">[PIN]</span>}</div>
                                  </div>
                              </div>
                              <div className="flex gap-2 text-sm">
                                  <button onClick={() => handleEditBook(b)} className="text-blue-500">수정</button>
                                  <button onClick={() => deleteBook(b.id)} className="text-red-500">삭제</button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
           )}

           {/* --- ARTICLE TAB --- */}
           {activeTab === 'article' && (
              <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary"><PenTool size={20}/> {isEditingArticle ? "글 수정" : "새 글 작성"}</h2>
                      <form onSubmit={handleSaveArticle} className="space-y-4">
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">제목</label><input type="text" value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" required /></div>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">태그 (쉼표 구분)</label><input type="text" value={articleForm.tags} onChange={e => setArticleForm({...articleForm, tags: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" /></div>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">내용</label><textarea rows={10} value={articleForm.content} onChange={e => setArticleForm({...articleForm, content: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" required /></div>
                          <div className="flex gap-2"><button className="flex-1 py-2 bg-primary text-white rounded font-bold">저장</button>{isEditingArticle && <button type="button" onClick={resetArticleForm} className="flex-1 py-2 bg-gray-200 rounded font-bold">취소</button>}</div>
                      </form>
                      {/* Article Comment Management */}
                      {isEditingArticle && (
                          <div className="mt-8 border-t pt-4">
                              <h3 className="font-bold text-lg mb-2">댓글 관리</h3>
                              <div className="space-y-2">
                                  {articles.find(a => a.id === isEditingArticle)?.comments.map(c => (
                                      <div key={c.id} className="p-3 bg-gray-50 rounded border flex justify-between items-center text-sm">
                                          <div>
                                              <span className="font-bold">{c.author}</span>: {c.content}
                                              {c.isHidden && <span className="text-red-500 ml-2">(숨김 처리됨)</span>}
                                          </div>
                                          <div className="flex gap-2">
                                              <button onClick={() => toggleArticleCommentBlind(isEditingArticle!, c)} className="text-orange-500">{c.isHidden ? <Eye size={14}/> : <EyeOff size={14}/>}</button>
                                              <button onClick={() => { if(window.confirm("삭제?")) deleteArticleComment(isEditingArticle!, c.id); }} className="text-red-500"><Trash2 size={14}/></button>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
                  <div>
                      <h2 className="text-xl font-bold mb-6 text-primary">글 목록</h2>
                      <div className="space-y-2 h-[500px] overflow-y-auto">
                          {articles.map(art => (<div key={art.id} className="p-4 border rounded bg-gray-50 flex justify-between items-start"><div><h4 className="font-bold">{art.title}</h4><p className="text-xs text-gray-500">{art.date} • 댓글 {art.comments.length}</p></div><div className="flex gap-2"><button onClick={() => handleEditArticle(art)} className="text-blue-500 text-sm">수정</button><button onClick={() => { if(window.confirm("삭제?")) deleteArticle(art.id); }} className="text-red-500 text-sm">삭제</button></div></div>))}
                      </div>
                  </div>
              </div>
           )}

           {/* --- COMMUNITY TAB --- */}
           {activeTab === 'community' && (
              <div>
                  <h2 className="text-xl font-bold mb-4">수다 떨기 (토론방) 관리</h2>
                  <div className="bg-gray-50 p-4 rounded h-[600px] overflow-y-auto space-y-4">
                      {posts.map(p => (
                          <div key={p.id} className="bg-white p-4 border rounded shadow-sm">
                              {editingPost?.id === p.id ? (
                                  <div className="mb-2">
                                      <input className="w-full p-2 border mb-1 bg-white text-gray-900" value={editingPost.title} onChange={e=>setEditingPost({...editingPost, title: e.target.value})} />
                                      <textarea className="w-full p-2 border mb-1 bg-white text-gray-900" value={editingPost.content} onChange={e=>setEditingPost({...editingPost, content: e.target.value})} />
                                      <div className="flex gap-2"><button onClick={saveEditedPost} className="bg-green-500 text-white px-2 py-1 rounded text-xs">저장</button><button onClick={()=>setEditingPost(null)} className="bg-gray-300 px-2 py-1 rounded text-xs">취소</button></div>
                                  </div>
                              ) : (
                                  <div className="flex justify-between items-start mb-2">
                                      <div>
                                          <h3 className="font-bold">{p.title} {p.isHidden && <span className="text-red-500 text-xs">(숨김)</span>}</h3>
                                          <p className="text-sm text-gray-600 line-clamp-1">{p.content}</p>
                                          <span className="text-xs text-gray-400">{p.author} | {p.date}</span>
                                      </div>
                                      <div className="flex gap-2">
                                          <button onClick={()=>setEditingPost(p)} className="text-blue-500"><Edit size={16}/></button>
                                          <button onClick={()=>togglePostBlind(p)} className="text-orange-500">{p.isHidden ? <Eye size={16}/> : <EyeOff size={16}/>}</button>
                                          <button onClick={()=>deletePost(p.id)} className="text-red-500"><Trash2 size={16}/></button>
                                          <button onClick={()=>setExpandedPostId(expandedPostId === p.id ? null : p.id)} className="text-gray-500">{expandedPostId === p.id ? "접기" : "댓글 보기"}</button>
                                      </div>
                                  </div>
                              )}
                              
                              {/* Comments Section */}
                              {(expandedPostId === p.id || true) && ( // Always show comments for easier admin
                                  <div className="mt-2 pl-4 border-l-2 border-gray-100 space-y-2">
                                      {p.comments.map(c => (
                                          <div key={c.id} className="text-sm bg-gray-50 p-2 rounded flex justify-between items-center">
                                              {editingComment?.comment.id === c.id ? (
                                                  <div className="flex-1 mr-2">
                                                      <input className="w-full p-1 border bg-white text-gray-900" value={editingComment.comment.content} onChange={e=>setEditingComment({...editingComment, comment: {...editingComment.comment, content: e.target.value}})} />
                                                      <button onClick={saveEditedComment} className="text-xs text-green-600 mr-2">저장</button>
                                                      <button onClick={()=>setEditingComment(null)} className="text-xs text-gray-500">취소</button>
                                                  </div>
                                              ) : (
                                                  <span className="flex-1">{c.content} {c.isHidden && <span className="text-red-500 text-xs">(숨김)</span>} <span className="text-gray-400 text-xs">- {c.author}</span></span>
                                              )}
                                              <div className="flex gap-1">
                                                  <button onClick={()=>setEditingComment({postId: p.id, comment: c})} className="text-blue-400"><Edit size={12}/></button>
                                                  <button onClick={()=>toggleCommentBlind(p.id, c)} className="text-orange-400">{c.isHidden ? <Eye size={12}/> : <EyeOff size={12}/>}</button>
                                                  <button onClick={()=>deleteComment(p.id, c.id)} className="text-red-400"><Trash2 size={12}/></button>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
           )}

           {/* --- RESOURCE TAB --- */}
           {activeTab === 'resource' && (
               <div className="grid lg:grid-cols-2 gap-8">
                   <div>
                       <h2 className="text-xl font-bold mb-4">자료 등록/수정</h2>
                       <form onSubmit={handleSaveResource} className="space-y-4">
                           <input type="text" placeholder="자료명" value={resourceForm.title} onChange={e=>setResourceForm({...resourceForm, title: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" required />
                           
                           <label className="block text-xs font-bold text-gray-500">관련 도서 선택</label>
                           <select value={resourceForm.bookId || ""} onChange={e=>setResourceForm({...resourceForm, bookId: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900">
                               <option value="">선택 안 함 (공통 자료)</option>
                               {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                           </select>

                           <div className="grid grid-cols-2 gap-2">
                               <select value={resourceForm.type} onChange={e=>setResourceForm({...resourceForm, type: e.target.value as any})} className="w-full p-2 border rounded bg-white text-gray-900">
                                   <option value="PDF">PDF</option>
                                   <option value="ZIP">ZIP</option>
                                   <option value="LINK">LINK</option>
                               </select>
                               <input type="text" placeholder="용량 (예: 1.5MB)" value={resourceForm.size} onChange={e=>setResourceForm({...resourceForm, size: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                           </div>

                           <div className="flex gap-4 border p-2 rounded">
                               <label className="flex items-center gap-2"><input type="radio" checked={resourceForm.category==='PUBLIC'} onChange={()=>setResourceForm({...resourceForm, category:'PUBLIC'})} /> 일반 자료</label>
                               <label className="flex items-center gap-2"><input type="radio" checked={resourceForm.category==='BOOK'} onChange={()=>setResourceForm({...resourceForm, category:'BOOK'})} /> 도서 인증 필요</label>
                           </div>
                           {resourceForm.category === 'BOOK' && <input type="text" placeholder="다운로드 인증 코드 (예: epab1234)" value={resourceForm.downloadCode} onChange={e=>setResourceForm({...resourceForm, downloadCode: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />}
                           
                           <input type="text" placeholder="다운로드 링크 / 이동 URL" value={resourceForm.url} onChange={e=>setResourceForm({...resourceForm, url: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                           <textarea placeholder="자료 설명" value={resourceForm.description} onChange={e=>setResourceForm({...resourceForm, description: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900 h-20" />

                           <button className="w-full py-2 bg-primary text-white rounded">저장</button>
                           {isEditingResource && <button type="button" onClick={resetResourceForm} className="w-full py-2 bg-gray-200 rounded mt-2">취소</button>}
                       </form>
                   </div>
                   <div className="h-[600px] overflow-y-auto">
                       <h2 className="text-xl font-bold mb-4">자료 목록</h2>
                       {resources.map(r => (
                           <div key={r.id} className="flex justify-between p-3 border-b hover:bg-gray-50">
                               <div>
                                   <div className="font-bold">{r.title}</div>
                                   <div className="text-xs text-gray-500">{r.type} | {r.category === 'BOOK' ? '🔒 도서인증' : '🌍 일반'}</div>
                               </div>
                               <div className="flex gap-2">
                                   <button onClick={()=>handleEditResource(r)} className="text-blue-500">수정</button>
                                   <button onClick={()=>deleteResource(r.id)} className="text-red-500">삭제</button>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* --- FAQ TAB --- */}
           {activeTab === 'faq' && (
               <div>
                   <h2 className="text-xl font-bold mb-4">FAQ 관리</h2>
                   <form onSubmit={handleSaveFaq} className="mb-4 space-y-2">
                       <input type="text" placeholder="질문" value={faqForm.question} onChange={e=>setFaqForm({...faqForm, question: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                       <textarea placeholder="답변" value={faqForm.answer} onChange={e=>setFaqForm({...faqForm, answer: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                       <button className="px-4 py-2 bg-primary text-white rounded">저장</button>
                   </form>
                   <div>{faqs.map(f => <div key={f.id} className="p-2 border-b flex justify-between"><span>{f.question}</span><div><button onClick={()=>handleEditFaq(f)} className="text-blue-500 mr-2">수정</button><button onClick={()=>deleteFaq(f.id)} className="text-red-500">삭제</button></div></div>)}</div>
               </div>
           )}

           {/* --- SITE TAB --- */}
           {activeTab === 'site' && (
               <div className="space-y-8">
                   <div className="p-6 border rounded-xl bg-gray-50">
                       <h3 className="font-bold mb-4 text-lg">프로필 이미지 설정</h3>
                       <div className="flex flex-col md:flex-row gap-8 items-start">
                           <div className="flex-1 w-full">
                               <input type="text" value={profileImageUrl} onChange={e => handleProfileImageChange(e.target.value)} className="w-full p-3 border rounded bg-white text-gray-900 mb-2" placeholder="이미지 URL 입력 (Imgur 등)" />
                               <button onClick={handleSaveSiteSettings} className="bg-primary text-white px-6 py-2 rounded font-bold">저장</button>
                               <p className="text-sm text-gray-500 mt-4">
                                   * 메인 화면의 작가/연구그룹 사진으로 사용됩니다.<br/>
                                   * <b>1:1 정사각형 비율</b>을 권장합니다.<br/>
                                   * 권장 사이즈: <b>800x800px 이상</b>
                               </p>
                           </div>
                           <div className="flex flex-col items-center">
                               <span className="text-xs font-bold text-gray-400 mb-2">미리보기</span>
                               {previewUrl ? (
                                   <img src={previewUrl} alt="Preview" className="w-48 h-48 rounded-2xl object-cover border-4 border-white shadow-lg" />
                               ) : (
                                   <div className="w-48 h-48 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                               )}
                           </div>
                       </div>
                   </div>
                   <div className="p-4 border rounded bg-gray-50 border-gray-200">
                       <h3 className="font-bold mb-2 flex items-center gap-2"><RotateCcw size={18} className="text-red-500"/> 데이터 초기화 (공장 초기화)</h3>
                       <p className="text-xs text-gray-600 mb-4">
                           메인 페이지에 책이 2권만 보이는 등 데이터 오류가 있을 때 사용하세요.<br/>
                           모든 데이터를 삭제하고 constants.ts에 정의된 기본 데이터(책 4권 등)로 되돌립니다.
                       </p>
                       <button onClick={handleFactoryReset} className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-colors">모든 데이터 초기화</button>
                   </div>
                   <div className="p-4 border rounded">
                       <h3 className="font-bold mb-2">비밀번호 변경</h3>
                       <input type="password" value={newAdminPassword} onChange={e=>setNewAdminPassword(e.target.value)} className="w-full p-2 border rounded mb-2 bg-white text-gray-900" placeholder="새 비밀번호" />
                       <button onClick={handleChangePassword} className="bg-red-500 text-white px-4 py-2 rounded">변경</button>
                   </div>
                   <div className="p-4 bg-gray-900 text-green-400 rounded">
                       <h3 className="font-bold mb-2">데이터 내보내기</h3>
                       <pre className="text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">{exportCode}</pre>
                       <button onClick={() => navigator.clipboard.writeText(exportCode)} className="mt-2 bg-green-700 text-white px-3 py-1 rounded text-xs">Copy</button>
                   </div>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};
export default Admin;