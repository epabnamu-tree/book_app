import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Trash2, Edit, Save, X, FileText, Download, Link as LinkIcon, Image, Key, Pin, HelpCircle, BookOpen, ShoppingCart, PenTool, Eye, EyeOff, MessageSquare, RotateCcw, RefreshCw } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Book, Resource, FaqItem, Article, Post, Comment, ArticleComment } from '../types';

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

  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingComment, setEditingComment] = useState<{postId: number, comment: Comment} | null>(null);

  useEffect(() => { setProfileImageUrl(authorProfileImage); setPreviewUrl(authorProfileImage); }, [authorProfileImage]);

  const generateExportCode = () => {
    const code = `
// constants.ts 파일의 내용을 아래 코드로 교체하세요.
export const APP_NAME = "이팝나무의 서재";
export const DEFAULT_ADMIN_PASSWORD = "slit0800@@";
export const MASTER_KEY = "ipannamoo2024!";
export const INITIAL_PROFILE_IMAGE = "${authorProfileImage}";
export const INITIAL_BOOKS = ${JSON.stringify(books, null, 2)};
export const INITIAL_RESOURCES = ${JSON.stringify(resources, null, 2)};
export const INITIAL_POSTS = ${JSON.stringify(posts, null, 2)};
export const INITIAL_ARTICLES = ${JSON.stringify(articles, null, 2)};
export const FAQS = ${JSON.stringify(faqs, null, 2)};
export const CHAPTERS = [ { id: 1, title: "1장", description: "내용" } ];
    `;
    setExportCode(code);
  };

  useEffect(() => {
    generateExportCode();
  }, [books, resources, posts, articles, faqs, authorProfileImage]);

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); if (login(password)) setError(""); else setError("비밀번호가 올바르지 않습니다."); };
  const handleResetPassword = () => { const key = prompt("마스터 키 입력"); if (key && login(key)) setError(""); else alert("실패"); };
  const handleFactoryReset = () => {
      if (window.confirm("경고: 모든 데이터를 초기화합니다!\n\n현재 웹사이트에 저장된 모든 글, 댓글, 설정이 삭제되고 constants.ts에 정의된 초기 상태(책 4권 등)로 되돌아갑니다.\n\n정말 진행하시겠습니까?")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  // Book Handlers
  const resetBookForm = () => { setBookForm({ title: "", subtitle: "", description: "", publisher: "", coverUrl: "https://loremflickr.com/600/900/book,cover,abstract", purchaseLinks: { kyobo: "", aladin: "", yes24: "", other: "" }, format: [], tags: [], authorNote: "", reviewsText: "", tableOfContents: "", category: "", isPinned: false }); setTagsInput(""); setIsEditingBook(null); };
  const handleEditBook = (book: Book) => { setIsEditingBook(book.id); setBookForm({ ...book, purchaseLinks: book.purchaseLinks || { kyobo: "", aladin: "", yes24: "", other: "" } }); setTagsInput(book.tags.join(', ')); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleSaveBook = (e: React.FormEvent) => { e.preventDefault(); const currentTags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0); const processedCoverUrl = getDirectImageUrl(bookForm.coverUrl || ""); if (processedCoverUrl === "ERROR_ALBUM") { alert("Imgur Album Error"); return; } const bookData: Book = { ...bookForm as Book, coverUrl: processedCoverUrl, id: isEditingBook || bookForm.title?.toLowerCase().replace(/\s+/g, '-') || `book-${Date.now()}`, publishDate: bookForm.publishDate || new Date().toISOString().split('T')[0], tags: currentTags.length > 0 ? currentTags : ["New"], chapters: [] }; if (isEditingBook) updateBook(bookData); else addBook(bookData); resetBookForm(); };
  const toggleFormat = (fmt: string) => { const current = bookForm.format || []; if (current.includes(fmt)) setBookForm({...bookForm, format: current.filter(f => f !== fmt)}); else setBookForm({...bookForm, format: [...current, fmt]}); };

  // Article Handlers
  const resetArticleForm = () => { setArticleForm({ title: "", content: "", tags: "" }); setIsEditingArticle(null); };
  const handleEditArticle = (art: Article) => { setIsEditingArticle(art.id); setArticleForm({ title: art.title, content: art.content, tags: art.tags.join(', ') }); };
  const handleSaveArticle = (e: React.FormEvent) => { e.preventDefault(); const tagList = articleForm.tags.split(',').map(t => t.trim()).filter(Boolean); const newArticle: Article = { id: isEditingArticle || Date.now(), title: articleForm.title, content: articleForm.content, author: "이팝나무", date: new Date().toISOString().split('T')[0], tags: tagList.length > 0 ? tagList : ["칼럼"], comments: isEditingArticle ? articles.find(a => a.id === isEditingArticle)?.comments || [] : [] }; if (isEditingArticle) updateArticle(newArticle); else addArticle(newArticle); alert("저장되었습니다."); resetArticleForm(); };
  const toggleArticleCommentBlind = (articleId: number, comment: ArticleComment) => { updateArticleComment(articleId, { ...comment, isHidden: !comment.isHidden }); };

  // Resource Handlers
  const resetResourceForm = () => { setResourceForm({ title: "", type: "PDF", description: "", url: "", size: "", bookId: "", category: "PUBLIC", downloadCode: "" }); setIsEditingResource(null); };
  const handleEditResource = (res: Resource) => { setIsEditingResource(res.id); setResourceForm(res); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleSaveResource = (e: React.FormEvent) => { e.preventDefault(); const resData: Resource = { id: isEditingResource || Date.now(), title: resourceForm.title!, type: resourceForm.type as any, description: resourceForm.description || "", url: resourceForm.url || "#", size: resourceForm.size || "", bookId: resourceForm.bookId || "", category: resourceForm.category || "PUBLIC", downloadCode: resourceForm.category === 'BOOK' ? resourceForm.downloadCode : undefined }; if(isEditingResource) updateResource(resData); else addResource(resData); resetResourceForm(); };

  // FAQ/Site Handlers
  const resetFaqForm = () => { setFaqForm({ question: "", answer: "" }); setIsEditingFaq(null); };
  const handleEditFaq = (faq: FaqItem) => { setIsEditingFaq(faq.id); setFaqForm(faq); };
  const handleSaveFaq = (e: React.FormEvent) => { e.preventDefault(); const d: FaqItem = { id: isEditingFaq || Date.now(), question: faqForm.question!, answer: faqForm.answer! }; if(isEditingFaq) updateFaq(d); else addFaq(d); resetFaqForm(); };
  const handleProfileImageChange = (val: string) => { setProfileImageUrl(val); const d = getDirectImageUrl(val); if(d !== "ERROR_ALBUM") setPreviewUrl(d); };
  const handleSaveSiteSettings = (e: React.FormEvent) => { e.preventDefault(); const d = getDirectImageUrl(profileImageUrl); if(d==="ERROR_ALBUM") { alert("Error"); return; } updateProfileImage(d); setProfileImageUrl(d); setPreviewUrl(d); alert("Saved"); };
  const handleChangePassword = (e: React.FormEvent) => { e.preventDefault(); if(newAdminPassword.length<4) { alert("Too short"); return; } changePassword(newAdminPassword); setNewAdminPassword(""); alert("Changed"); };
  
  // Community Handlers
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
                                <input type="text" placeholder="교보문고" value={bookForm.purchaseLinks?.kyobo || ""} onChange={e=>setBookForm({...bookForm, purchaseLinks: {...bookForm.purchaseLinks, kyobo: e.target.value}})} className="w-full p-2 border rounded bg-white text-gray-900 text-xs" />
                                <input type="text" placeholder="알라딘" value={bookForm.purchaseLinks?.aladin || ""} onChange={e=>setBookForm({...bookForm, purchaseLinks: {...bookForm.purchaseLinks, aladin: e.target.value}})} className="w-full p-2 border rounded bg-white text-gray-900 text-xs" />
                                <input type="text" placeholder="YES24" value={bookForm.purchaseLinks?.yes24 || ""} onChange={e=>setBookForm({...bookForm, purchaseLinks: {...bookForm.purchaseLinks, yes24: e.target.value}})} className="w-full p-2 border rounded bg-white text-gray-900 text-xs" />
                                <input type="text" placeholder="기타" value={bookForm.purchaseLinks?.other || ""} onChange={e=>setBookForm({...bookForm, purchaseLinks: {...bookForm.purchaseLinks, other: e.target.value}})} className="w-full p-2 border rounded bg-white text-gray-900 text-xs" />
                             </div>
                          </div>
                          <div className="flex gap-4 p-2 border rounded">
                             <label className="flex items-center gap-2"><input type="checkbox" checked={bookForm.format?.includes('종이책')} onChange={()=>toggleFormat('종이책')} /> 종이책</label>
                             <label className="flex items-center gap-2"><input type="checkbox" checked={bookForm.format?.includes('전자책')} onChange={()=>toggleFormat('전자책')} /> 전자책</label>
                             <label className="flex items-center gap-2 ml-auto text-red-500"><input type="checkbox" checked={bookForm.isPinned || false} onChange={e=>setBookForm({...bookForm, isPinned: e.target.checked})} /> 메인 고정</label>
                          </div>
                          <input type="text" placeholder="카테고리" value={bookForm.category} onChange={e=>setBookForm({...bookForm, category: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                          <input type="text" placeholder="태그 (쉼표 구분)" value={tagsInput} onChange={e=>setTagsInput(e.target.value)} className="w-full p-2 border rounded bg-white text-gray-900" />
                          <textarea placeholder="저자 노트" value={bookForm.authorNote} onChange={e=>setBookForm({...bookForm, authorNote: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900 h-20" />
                          <textarea placeholder="서평" value={bookForm.reviewsText} onChange={e=>setBookForm({...bookForm, reviewsText: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900 h-20" />
                          <textarea placeholder="목차" value={bookForm.tableOfContents} onChange={e=>setBookForm({...bookForm, tableOfContents: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900 h-20" />
                          <button className="w-full py-2 bg-primary text-white rounded">저장</button>
                      </form>
                  </div>
                  <div className="h-[600px] overflow-y-auto">
                      <h2 className="text-xl font-bold mb-4">목록</h2>
                      {books.map(b => (
                          <div key={b.id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50">
                              <div className="flex items-center gap-3"><img src={b.coverUrl} className="w-8 h-12 object-cover" alt="" /><div className="text-sm font-bold">{b.title}</div></div>
                              <div className="flex gap-2"><button onClick={() => handleEditBook(b)} className="text-blue-500">수정</button><button onClick={() => deleteBook(b.id)} className="text-red-500">삭제</button></div>
                          </div>
                      ))}
                  </div>
              </div>
           )}
           {activeTab === 'article' && (
              <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary"><PenTool size={20}/> 글 작성/수정</h2>
                      <form onSubmit={handleSaveArticle} className="space-y-4">
                          <input type="text" value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" required placeholder="제목" />
                          <input type="text" value={articleForm.tags} onChange={e => setArticleForm({...articleForm, tags: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" placeholder="태그" />
                          <textarea rows={10} value={articleForm.content} onChange={e => setArticleForm({...articleForm, content: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" required placeholder="내용" />
                          <div className="flex gap-2"><button className="flex-1 py-2 bg-primary text-white rounded font-bold">저장</button>{isEditingArticle && <button type="button" onClick={resetArticleForm} className="flex-1 py-2 bg-gray-200 rounded font-bold">취소</button>}</div>
                      </form>
                  </div>
                  <div>
                      <h2 className="text-xl font-bold mb-6 text-primary">목록</h2>
                      <div className="space-y-2 h-[500px] overflow-y-auto">
                          {articles.map(art => (<div key={art.id} className="p-4 border rounded bg-gray-50 flex justify-between items-start"><div><h4 className="font-bold">{art.title}</h4></div><div className="flex gap-2"><button onClick={() => handleEditArticle(art)} className="text-blue-500 text-sm">수정</button><button onClick={() => { if(window.confirm("삭제?")) deleteArticle(art.id); }} className="text-red-500 text-sm">삭제</button></div></div>))}
                      </div>
                  </div>
              </div>
           )}
           {activeTab === 'community' && (<div><h2 className="text-xl font-bold mb-4">수다 떨기 (Disqus로 운영중)</h2><p>댓글 관리는 Disqus 관리자 페이지에서 가능합니다.</p></div>)}
           {activeTab === 'resource' && (
               <div className="grid lg:grid-cols-2 gap-8">
                   <div>
                       <h2 className="text-xl font-bold mb-4">자료 등록</h2>
                       <form onSubmit={handleSaveResource} className="space-y-4">
                           <input type="text" placeholder="자료명" value={resourceForm.title} onChange={e=>setResourceForm({...resourceForm, title: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" required />
                           <select value={resourceForm.bookId || ""} onChange={e=>setResourceForm({...resourceForm, bookId: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900"><option value="">선택 안 함</option>{books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}</select>
                           <input type="text" placeholder="URL" value={resourceForm.url} onChange={e=>setResourceForm({...resourceForm, url: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
                           <button className="w-full py-2 bg-primary text-white rounded">저장</button>
                       </form>
                   </div>
                   <div className="h-[600px] overflow-y-auto">
                       {resources.map(r => (<div key={r.id} className="flex justify-between p-3 border-b"><span>{r.title}</span><div className="flex gap-2"><button onClick={()=>handleEditResource(r)} className="text-blue-500">수정</button><button onClick={()=>deleteResource(r.id)} className="text-red-500">삭제</button></div></div>))}
                   </div>
               </div>
           )}
           {activeTab === 'faq' && (<div><h2 className="text-xl font-bold mb-4">FAQ 관리</h2><form onSubmit={handleSaveFaq}><input className="w-full p-2 border mb-2 bg-white text-gray-900" value={faqForm.question} onChange={e=>setFaqForm({...faqForm, question: e.target.value})} placeholder="질문"/><textarea className="w-full p-2 border mb-2 bg-white text-gray-900" value={faqForm.answer} onChange={e=>setFaqForm({...faqForm, answer: e.target.value})} placeholder="답변"/><button className="bg-primary text-white px-4 py-2 rounded">저장</button></form><div className="mt-4">{faqs.map(f=><div key={f.id} className="border-b p-2 flex justify-between"><span>{f.question}</span><button onClick={()=>deleteFaq(f.id)} className="text-red-500">삭제</button></div>)}</div></div>)}
           
           {activeTab === 'site' && (
               <div className="space-y-8">
                   <div className="p-6 border rounded-xl bg-gray-50">
                       <h3 className="font-bold mb-4 text-lg">프로필 이미지</h3>
                       <div className="flex gap-4">
                           <input type="text" value={profileImageUrl} onChange={e => handleProfileImageChange(e.target.value)} className="flex-1 p-2 border rounded bg-white text-gray-900" />
                           <button onClick={handleSaveSiteSettings} className="bg-primary text-white px-6 py-2 rounded font-bold">저장</button>
                       </div>
                       {previewUrl && <img src={previewUrl} alt="Preview" className="w-48 h-48 rounded-2xl object-cover mt-2" />}
                   </div>
                   <div className="p-4 border rounded bg-gray-50 border-gray-200">
                       <h3 className="font-bold mb-2 flex items-center gap-2"><RotateCcw size={18} className="text-red-500"/> 데이터 초기화</h3>
                       <button onClick={handleFactoryReset} className="bg-red-600 text-white px-4 py-2 rounded font-bold">초기화</button>
                   </div>
                   <div className="p-4 bg-gray-900 text-green-400 rounded relative">
                       <h3 className="font-bold mb-2">데이터 내보내기 (Deploy용)</h3>
                       <button onClick={generateExportCode} className="absolute top-4 right-20 bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"><RefreshCw size={12}/> 코드 갱신</button>
                       <pre className="text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">{exportCode}</pre>
                       <button onClick={() => navigator.clipboard.writeText(exportCode)} className="mt-2 bg-green-700 text-white px-3 py-1 rounded text-xs absolute top-4 right-4">Copy</button>
                   </div>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};
export default Admin;