import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Trash2, Edit, Save, X, FileText, Download, Link as LinkIcon, Image, Key, Pin, HelpCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Book, Resource, FaqItem } from '../types';

// Helper to convert Google Drive share links to direct image links
const convertGoogleDriveLink = (url: string) => {
  if (!url || !url.includes('drive.google.com')) return url;
  
  // Try to extract ID from standard sharing URL or id param
  const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }
  return url;
};

// Helper to convert Imgur standard links to direct image links
const getDirectImageUrl = (url: string) => {
  if (!url) return "";
  
  // 1. Google Drive Conversion
  const driveLink = convertGoogleDriveLink(url);
  if (driveLink !== url) return driveLink;

  // 2. Imgur Conversion
  if (url.includes('imgur.com')) {
    // If it's already a direct link, leave it
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) return url;
    
    // Check for Album links (unsupported for auto-convert usually)
    if (url.includes('/a/') || url.includes('/gallery/')) {
        return "ERROR_ALBUM";
    }

    // Convert standard post link to .jpg (imgur.com/ID -> i.imgur.com/ID.jpg)
    const idMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)/);
    if (idMatch && idMatch[1]) {
        return `https://i.imgur.com/${idMatch[1]}.jpg`;
    }
  }

  return url;
};

const Admin: React.FC = () => {
  const { 
    isAdmin, login, logout, changePassword,
    books, addBook, updateBook, deleteBook,
    posts, deleteComment, deletePost,
    resources, addResource, updateResource, deleteResource,
    faqs, addFaq, updateFaq, deleteFaq,
    authorProfileImage, updateProfileImage
  } = useData();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'book' | 'resource' | 'community' | 'faq' | 'site'>('book');

  // --- Export Data State ---
  const [exportCode, setExportCode] = useState("");

  // --- Book State ---
  const [isEditingBook, setIsEditingBook] = useState<string | null>(null); // ID of book being edited, null if creating
  const [tagsInput, setTagsInput] = useState("");
  const [bookForm, setBookForm] = useState<Partial<Book>>({
    title: "", subtitle: "", description: "", publisher: "", coverUrl: "", purchaseUrl: "", tags: [], 
    authorNote: "", reviewsText: "", tableOfContents: "", category: "", isPinned: false
  });

  // --- Resource State ---
  const [isEditingResource, setIsEditingResource] = useState<number | null>(null);
  const [resourceForm, setResourceForm] = useState<Partial<Resource>>({
    title: "", type: "PDF", description: "", url: "", size: "", bookId: ""
  });

  // --- FAQ State ---
  const [isEditingFaq, setIsEditingFaq] = useState<number | string | null>(null);
  const [faqForm, setFaqForm] = useState<Partial<FaqItem>>({ question: "", answer: "" });

  // --- Site Settings State ---
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  useEffect(() => {
    setProfileImageUrl(authorProfileImage);
    setPreviewUrl(authorProfileImage);
  }, [authorProfileImage]);

  // Update export code whenever data changes
  useEffect(() => {
    // We must export ALL constants, not just the dynamic ones, otherwise copy-pasting will break imports.
    const code = `
// constants.ts 파일의 내용을 아래 코드로 교체하세요.

export const APP_NAME = "이팝나무의 서재";
export const DEFAULT_ADMIN_PASSWORD = "admin123";
export const MASTER_KEY = "ipannamoo2024!";

export const INITIAL_BOOKS = ${JSON.stringify(books, null, 2)};

export const INITIAL_RESOURCES = ${JSON.stringify(resources, null, 2)};

export const INITIAL_POSTS = ${JSON.stringify(posts, null, 2)};

export const FAQS = ${JSON.stringify(faqs, null, 2)};

export const CHAPTERS = [
  { id: 1, title: "1장. AI의 도래", description: "인공지능이 가져올 노동의 변화" },
  { id: 2, title: "2장. 기본소득", description: "새로운 사회 안전망의 필요성" },
  { id: 3, title: "3장. 사회적 경제", description: "경쟁을 넘어선 연대" }
];
    `;
    setExportCode(code);
  }, [books, resources, posts, faqs]);

  // --- Login Logic ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) setError("");
    else setError("비밀번호가 올바르지 않습니다.");
  };
  
  const handleResetPassword = () => {
    const key = prompt("비밀번호를 초기화하려면 마스터 키를 입력하세요.");
    if (key) {
        if (login(key)) {
            setError("");
        } else {
            alert("마스터 키가 올바르지 않습니다.");
        }
    }
  };

  // --- Book Actions ---
  const resetBookForm = () => {
    setBookForm({ 
      title: "", subtitle: "", description: "", publisher: "", 
      coverUrl: "https://loremflickr.com/600/900/book,cover,abstract", 
      purchaseUrl: "", tags: [], 
      authorNote: "", reviewsText: "", tableOfContents: "",
      category: "", isPinned: false
    });
    setTagsInput("");
    setIsEditingBook(null);
  };

  const handleEditBook = (book: Book) => {
    setIsEditingBook(book.id);
    setBookForm(book);
    setTagsInput(book.tags.join(', '));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.description) return;

    const currentTags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    // Auto-convert Google Drive Links for Cover URL
    const processedCoverUrl = getDirectImageUrl(bookForm.coverUrl || "");
    if (processedCoverUrl === "ERROR_ALBUM") {
        alert("Imgur 앨범 링크는 사용할 수 없습니다. 이미지 위에서 우클릭하여 주소를 복사해주세요.");
        return;
    }

    const bookData: Book = {
      ...bookForm as Book,
      coverUrl: processedCoverUrl,
      id: isEditingBook || bookForm.title.toLowerCase().replace(/\s+/g, '-') || `book-${Date.now()}`,
      publishDate: bookForm.publishDate || new Date().toISOString().split('T')[0],
      tags: currentTags.length > 0 ? currentTags : ["New"],
      chapters: [] // We are not using structured chapters anymore, relying on tableOfContents string
    };

    if (isEditingBook) {
      updateBook(bookData);
      alert('도서 정보가 수정되었습니다.');
    } else {
      addBook(bookData);
      alert('새 도서가 추가되었습니다.');
    }
    resetBookForm();
  };

  // --- Resource Actions ---
  const resetResourceForm = () => {
    setResourceForm({ title: "", type: "PDF", description: "", url: "", size: "", bookId: "" });
    setIsEditingResource(null);
  };

  const handleEditResource = (res: Resource) => {
    setIsEditingResource(res.id);
    setResourceForm(res);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceForm.title || !resourceForm.bookId || !resourceForm.url) {
      alert("관련 도서, 제목, 링크 URL은 필수 항목입니다.");
      return;
    }

    const resourceData: Resource = {
      id: isEditingResource || Date.now(),
      title: resourceForm.title!,
      type: resourceForm.type as 'PDF' | 'ZIP' | 'LINK',
      description: resourceForm.description || "",
      url: resourceForm.url || "#",
      size: resourceForm.size || "Link",
      bookId: resourceForm.bookId
    };

    if (isEditingResource) {
      updateResource(resourceData);
      alert("자료가 수정되었습니다.");
    } else {
      addResource(resourceData);
      alert("자료가 등록되었습니다.");
    }
    
    resetResourceForm();
  };

  // --- FAQ Actions ---
  const resetFaqForm = () => {
    setFaqForm({ question: "", answer: "" });
    setIsEditingFaq(null);
  };

  const handleEditFaq = (faq: FaqItem) => {
    setIsEditingFaq(faq.id);
    setFaqForm(faq);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) {
      alert("질문과 답변을 모두 입력해주세요.");
      return;
    }

    const faqData: FaqItem = {
      id: isEditingFaq || Date.now(),
      question: faqForm.question!,
      answer: faqForm.answer!
    };

    if (isEditingFaq) {
      updateFaq(faqData);
      alert("FAQ가 수정되었습니다.");
    } else {
      addFaq(faqData);
      alert("FAQ가 등록되었습니다.");
    }
    resetFaqForm();
  };

  // --- Site Actions ---
  const handleProfileImageChange = (val: string) => {
      setProfileImageUrl(val);
      const direct = getDirectImageUrl(val);
      if (direct !== "ERROR_ALBUM") {
          setPreviewUrl(direct);
      }
  }

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-convert Google Drive Links
    const processedUrl = getDirectImageUrl(profileImageUrl);
    
    if (processedUrl === "ERROR_ALBUM") {
        alert("Imgur 앨범 링크는 사용할 수 없습니다.");
        return;
    }

    updateProfileImage(processedUrl);
    setProfileImageUrl(processedUrl); // Update state to show the converted URL
    setPreviewUrl(processedUrl);
    
    alert("사이트 설정이 저장되었습니다.");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if(newAdminPassword.length < 4) {
      alert("비밀번호는 4자리 이상이어야 합니다.");
      return;
    }
    changePassword(newAdminPassword);
    setNewAdminPassword("");
    alert("관리자 비밀번호가 변경되었습니다. 다음에 로그인할 때 사용하세요.");
  };

  // --- Community Data Prep ---
  const allComments = posts.flatMap(post => 
    post.comments.map(comment => ({ ...comment, postId: post.id, postTitle: post.title }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
               <Lock size={32} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-primary">관리자 로그인</h1>
            <p className="text-gray-500 text-sm mt-2">연구그룹 이팝나무 관리자 페이지입니다.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="비밀번호를 입력하세요" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-secondary bg-white text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
            <button className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-[#1a252f] transition-colors">
              로그인
            </button>
            <div className="text-center mt-6 p-4 bg-gray-50 rounded text-xs text-gray-500">
              <p>초기 비밀번호: <b>admin123</b></p>
              <button 
                type="button"
                onClick={handleResetPassword}
                className="mt-2 text-secondary underline hover:text-orange-600 focus:outline-none"
              >
                비밀번호를 잊으셨나요? (비밀번호 초기화)
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary">관리자 CMS (Epabnamu)</h1>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            <LogOut size={16} /> 로그아웃
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-gray-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('book')}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'book' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            도서 관리
          </button>
          <button 
            onClick={() => setActiveTab('resource')}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'resource' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            자료실 관리
          </button>
          <button 
            onClick={() => setActiveTab('community')}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'community' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            커뮤니티 관리
          </button>
          <button 
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'faq' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            FAQ 관리
          </button>
          <button 
            onClick={() => setActiveTab('site')}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'site' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            사이트 관리
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
          
          {/* --- BOOK TAB --- */}
          {activeTab === 'book' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-8">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                   {isEditingBook ? <Edit size={20} className="text-secondary"/> : <Plus size={20} className="text-secondary"/>}
                   {isEditingBook ? "도서 정보 수정" : "신규 도서 등록"}
                 </h2>
                 <form onSubmit={handleSaveBook} className="space-y-4">
                   {/* Basic Info */}
                   <div className="p-4 bg-gray-50 rounded-lg space-y-3 mb-4">
                     <h3 className="font-bold text-sm text-gray-500 uppercase">기본 정보</h3>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">책 제목 *</label>
                       <input type="text" className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                         value={bookForm.title} onChange={(e) => setBookForm({...bookForm, title: e.target.value})} required />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">부제</label>
                       <input type="text" className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                         value={bookForm.subtitle} onChange={(e) => setBookForm({...bookForm, subtitle: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">출판사</label>
                          <input type="text" className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                            value={bookForm.publisher} onChange={(e) => setBookForm({...bookForm, publisher: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">발행일</label>
                          <input type="text" className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                            placeholder="2024.01.01"
                            value={bookForm.publishDate} onChange={(e) => setBookForm({...bookForm, publishDate: e.target.value})} />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                       <div>
                         <label className="block text-xs font-bold text-gray-500 mb-1">분야/시리즈 (Category)</label>
                         <input 
                           type="text" 
                           className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                           placeholder="경제학, 사회과학 등"
                           value={bookForm.category || ""} 
                           onChange={(e) => setBookForm({...bookForm, category: e.target.value})} 
                         />
                       </div>
                       <div className="flex items-center pt-5">
                         <label className="flex items-center gap-2 cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={bookForm.isPinned || false}
                             onChange={(e) => setBookForm({...bookForm, isPinned: e.target.checked})}
                             className="w-5 h-5 accent-secondary"
                           />
                           <span className="text-sm font-bold text-primary flex items-center gap-1">
                             <Pin size={14} className="text-secondary"/> 메인 페이지 고정
                           </span>
                         </label>
                       </div>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">태그 (쉼표로 구분)</label>
                       <input 
                         type="text" 
                         className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                         placeholder="경제, AI, 미래"
                         value={tagsInput} 
                         onChange={(e) => setTagsInput(e.target.value)} 
                       />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">책 소개 (요약)</label>
                        <textarea rows={3} className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none resize-none bg-white text-gray-900"
                          value={bookForm.description} onChange={(e) => setBookForm({...bookForm, description: e.target.value})} required></textarea>
                     </div>
                   </div>

                   {/* Links */}
                   <div className="p-4 bg-gray-50 rounded-lg space-y-3 mb-4">
                     <h3 className="font-bold text-sm text-gray-500 uppercase">링크 설정</h3>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">이미지 URL</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                          value={bookForm.coverUrl} onChange={(e) => setBookForm({...bookForm, coverUrl: e.target.value})} />
                        <p className="text-[10px] text-gray-400 mt-1">* 구글 드라이브/Imgur 링크 자동 변환</p>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">구매 링크 URL</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                          value={bookForm.purchaseUrl || ""} onChange={(e) => setBookForm({...bookForm, purchaseUrl: e.target.value})} />
                     </div>
                   </div>

                   {/* Detailed Content */}
                   <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                     <h3 className="font-bold text-sm text-gray-500 uppercase">상세 콘텐츠 (줄글 입력)</h3>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">저자의 책 소개</label>
                        <textarea rows={6} className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900 text-sm"
                          value={bookForm.authorNote || ""} onChange={(e) => setBookForm({...bookForm, authorNote: e.target.value})}
                          placeholder="저자의 인사말이나 책을 쓰게 된 계기 등을 자유롭게 작성하세요."
                        ></textarea>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">서평 / 추천사</label>
                        <textarea rows={6} className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900 text-sm"
                          value={bookForm.reviewsText || ""} onChange={(e) => setBookForm({...bookForm, reviewsText: e.target.value})}
                          placeholder="추천사나 서평 내용을 입력하세요."
                        ></textarea>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">전체 목차</label>
                        <textarea rows={8} className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900 text-sm font-mono"
                          value={bookForm.tableOfContents || ""} onChange={(e) => setBookForm({...bookForm, tableOfContents: e.target.value})}
                          placeholder="목차를 입력하세요. 입력한 그대로 화면에 표시됩니다."
                        ></textarea>
                     </div>
                   </div>

                   <div className="flex gap-2 pt-2 sticky bottom-0 bg-white p-2 border-t">
                     <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-[#1a252f] transition-colors flex justify-center items-center gap-2">
                       <Save size={18}/> 저장하기
                     </button>
                     {isEditingBook && (
                       <button type="button" onClick={resetBookForm} className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                         <X size={18}/> 취소
                       </button>
                     )}
                   </div>
                 </form>
              </div>

              {/* List Section */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-bold mb-6 text-primary">등록된 도서 목록 ({books.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {books.map(book => (
                    <div key={book.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative">
                      {book.isPinned && (
                        <div className="absolute top-2 right-2 z-10 bg-secondary text-white p-1 rounded-full shadow-lg">
                          <Pin size={12} fill="currentColor" />
                        </div>
                      )}
                      <div className="h-40 w-full overflow-hidden bg-gray-100 relative">
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-md text-primary truncate mb-1" title={book.title}>{book.title}</h3>
                          <p className="text-xs text-gray-500 truncate mb-1" title={book.subtitle}>{book.subtitle || '부제 없음'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-3">{book.category || '미분류'}</p>
                          
                          <div className="mt-auto flex gap-2">
                            <button 
                              onClick={() => handleEditBook(book)} 
                              className="flex-1 py-2 text-xs bg-gray-50 border border-gray-200 hover:bg-secondary hover:text-white hover:border-secondary rounded transition-colors"
                            >
                              수정
                            </button>
                            <button 
                              onClick={() => { if(window.confirm(`<${book.title}>을(를) 삭제하시겠습니까?`)) deleteBook(book.id); }} 
                              className="flex-1 py-2 text-xs bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white rounded transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- RESOURCE TAB --- */}
          {activeTab === 'resource' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                  {isEditingResource ? <Edit size={20} className="text-secondary" /> : <Plus size={20} className="text-secondary" />}
                  {isEditingResource ? "자료 수정" : "자료 추가"}
                </h2>
                <form onSubmit={handleSaveResource} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">관련 도서 선택 *</label>
                     <select 
                       className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                       value={resourceForm.bookId}
                       onChange={(e) => setResourceForm({...resourceForm, bookId: e.target.value})}
                       required
                     >
                       <option value="">도서를 선택하세요</option>
                       {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">자료 제목 *</label>
                     <input type="text" className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                       value={resourceForm.title} onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})} required />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">파일 유형</label>
                       <select 
                         className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                         value={resourceForm.type}
                         onChange={(e) => setResourceForm({...resourceForm, type: e.target.value as any})}
                       >
                         <option value="PDF">PDF 문서</option>
                         <option value="ZIP">ZIP 압축파일</option>
                         <option value="LINK">외부 링크</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">용량 (표기용)</label>
                       <input type="text" className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                         placeholder="ex. 5MB"
                         value={resourceForm.size} onChange={(e) => setResourceForm({...resourceForm, size: e.target.value})} />
                     </div>
                   </div>

                   {/* URL Input - Positioned After Type Selection */}
                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                     <label className="block text-xs font-bold text-gray-700 mb-1">파일 주소 / 외부 링크 *</label>
                     <input type="text" className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                       placeholder="https://..."
                       value={resourceForm.url || ""} onChange={(e) => setResourceForm({...resourceForm, url: e.target.value})} required />
                     <p className="text-[10px] text-gray-500 mt-2">
                       * 구글 드라이브, 노션, Dropbox, 또는 웹사이트 주소를 입력하세요.<br/>
                       * 파일 직접 업로드는 지원하지 않으며, 외부 링크 방식입니다.
                     </p>
                   </div>

                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">설명</label>
                     <textarea rows={2} className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none resize-none bg-white text-gray-900"
                       value={resourceForm.description} onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}></textarea>
                   </div>
                   
                   <div className="flex gap-2">
                       <button type="submit" className="flex-1 py-2.5 bg-secondary text-white rounded-lg font-bold hover:bg-orange-600 transition-colors">
                         {isEditingResource ? "자료 수정" : "자료 등록"}
                       </button>
                       {isEditingResource && (
                           <button type="button" onClick={resetResourceForm} className="px-4 py-2.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                               취소
                           </button>
                       )}
                   </div>
                </form>
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-6 text-primary">자료실 목록 ({resources.length})</h2>
                <div className="space-y-3">
                  {resources.map(res => {
                    const relatedBook = books.find(b => b.id === res.bookId);
                    return (
                      <div key={res.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4 overflow-hidden">
                           <div className={`p-2 rounded shrink-0 ${res.type === 'PDF' ? 'bg-red-100 text-red-500' : res.type === 'ZIP' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-500'}`}>
                             {res.type === 'PDF' ? <FileText size={20}/> : res.type === 'ZIP' ? <Download size={20}/> : <LinkIcon size={20}/>}
                           </div>
                           <div className="min-w-0">
                             <h4 className="font-bold text-gray-800 truncate">{res.title}</h4>
                             <p className="text-xs text-gray-500 truncate">
                               {relatedBook?.title || 'Unknown Book'} • {res.size} • <span className="text-gray-400">{res.url}</span>
                             </p>
                           </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                             <button 
                                onClick={() => handleEditResource(res)}
                                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                title="수정"
                             >
                                <Edit size={18} />
                             </button>
                             <button 
                                onClick={() => { if(window.confirm('정말 삭제하시겠습니까?')) deleteResource(res.id); }}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="삭제"
                             >
                                <Trash2 size={18} />
                             </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* --- COMMUNITY TAB --- */}
          {activeTab === 'community' && (
            <div>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Post Management */}
                <div>
                   <h2 className="text-xl font-bold mb-6 text-primary">게시글 관리</h2>
                   <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                     <div className="max-h-[400px] overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 text-gray-500 font-bold">
                            <tr>
                              <th className="px-4 py-2 text-left">제목</th>
                              <th className="px-4 py-2 text-left">작성자</th>
                              <th className="px-4 py-2 text-right">삭제</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {posts.map(post => (
                              <tr key={post.id} className="hover:bg-white">
                                <td className="px-4 py-3 truncate max-w-[150px]">{post.title}</td>
                                <td className="px-4 py-3">{post.author}</td>
                                <td className="px-4 py-3 text-right">
                                  <button onClick={() => {if(window.confirm('게시글 삭제?')) deletePost(post.id)}} className="text-red-400 hover:text-red-600">
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                   </div>
                </div>

                {/* Comment Management */}
                <div>
                  <h2 className="text-xl font-bold mb-6 text-primary">댓글 관리</h2>
                  <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <div className="max-h-[400px] overflow-y-auto">
                      {allComments.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">댓글이 없습니다.</div>
                      ) : (
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 text-gray-500 font-bold">
                            <tr>
                              <th className="px-4 py-2 text-left">내용</th>
                              <th className="px-4 py-2 text-left">게시글</th>
                              <th className="px-4 py-2 text-left">작성자</th>
                              <th className="px-4 py-2 text-right">삭제</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {allComments.map(comment => (
                              <tr key={`${comment.postId}-${comment.id}`} className="hover:bg-white">
                                <td className="px-4 py-3 truncate max-w-[150px]" title={comment.content}>{comment.content}</td>
                                <td className="px-4 py-3 truncate max-w-[120px] text-gray-500" title={comment.postTitle}>{comment.postTitle}</td>
                                <td className="px-4 py-3">{comment.author}</td>
                                <td className="px-4 py-3 text-right">
                                  <button onClick={() => deleteComment(comment.postId, comment.id)} className="text-red-400 hover:text-red-600">
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- FAQ TAB --- */}
          {activeTab === 'faq' && (
             <div className="grid lg:grid-cols-2 gap-8">
               <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-8">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                    <HelpCircle size={20} className="text-secondary" />
                    {isEditingFaq ? "FAQ 수정" : "FAQ 등록"}
                 </h2>
                 <form onSubmit={handleSaveFaq} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">질문 (Question)</label>
                     <input 
                       type="text" 
                       className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                       value={faqForm.question} 
                       onChange={(e) => setFaqForm({...faqForm, question: e.target.value})} 
                       required 
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">답변 (Answer)</label>
                     <textarea 
                       rows={5} 
                       className="w-full px-3 py-2 border rounded-lg focus:border-secondary outline-none resize-none bg-white text-gray-900"
                       value={faqForm.answer} 
                       onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})} 
                       required 
                     ></textarea>
                   </div>
                   <div className="flex gap-2">
                     <button type="submit" className="flex-1 py-3 bg-secondary text-white rounded-lg font-bold hover:bg-orange-600 transition-colors">
                       {isEditingFaq ? "수정 완료" : "FAQ 등록"}
                     </button>
                     {isEditingFaq && (
                       <button type="button" onClick={resetFaqForm} className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                         취소
                       </button>
                     )}
                   </div>
                 </form>
               </div>

               <div className="lg:col-span-1">
                 <h2 className="text-xl font-bold mb-6 text-primary">FAQ 목록 ({faqs.length})</h2>
                 <div className="space-y-3 max-h-[500px] overflow-y-auto">
                   {faqs.map(faq => (
                     <div key={faq.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-secondary transition-colors group">
                       <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-primary">Q. {faq.question}</h4>
                         <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditFaq(faq)} className="p-1 text-gray-400 hover:text-blue-500">
                               <Edit size={16} />
                            </button>
                            <button onClick={() => {if(window.confirm('삭제하시겠습니까?')) deleteFaq(faq.id);}} className="p-1 text-gray-400 hover:text-red-500">
                               <Trash2 size={16} />
                            </button>
                         </div>
                       </div>
                       <p className="text-sm text-gray-600 whitespace-pre-line">{faq.answer}</p>
                     </div>
                   ))}
                   {faqs.length === 0 && <p className="text-gray-400 text-center py-8">등록된 FAQ가 없습니다.</p>}
                 </div>
               </div>
             </div>
          )}

          {/* --- SITE SETTINGS TAB --- */}
          {activeTab === 'site' && (
            <div className="space-y-12">
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Profile Image Section */}
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                    <Image size={20} className="text-secondary" /> 프로필 이미지 설정
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-full">
                    <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-200">
                        {/* Modified Preview Container */}
                        <div className="w-full max-w-xs aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 shadow-md mb-4 bg-gray-100 flex items-center justify-center">
                           {previewUrl ? (
                              <img src={previewUrl} onError={() => setPreviewUrl("https://placehold.co/800x800?text=Image+Error")} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                              <span className="text-gray-400">이미지 없음</span>
                           )}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">메인 화면 미리보기 (1:1 비율 권장)</span>
                        <span className="text-xs text-gray-400 mt-1">권장 사이즈: 800x800px 이상</span>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          이미지 URL
                        </label>
                        <div className="flex gap-2">
                           <input 
                              type="text" 
                              className="flex-1 px-4 py-3 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                              value={profileImageUrl}
                              onChange={(e) => handleProfileImageChange(e.target.value)}
                              placeholder="https://..."
                           />
                           <button type="button" onClick={() => handleProfileImageChange("https://loremflickr.com/800/800/writer,portrait,man")} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm whitespace-nowrap">
                             기본값 복원
                           </button>
                        </div>
                        {profileImageUrl.includes('imgur.com/a/') && <p className="text-xs text-red-500 mt-1 font-bold">Imgur 앨범 링크는 사용할 수 없습니다. 이미지 우클릭 → 주소 복사를 이용하세요.</p>}
                      </div>

                      <button type="submit" className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-[#1a252f] transition-colors flex justify-center items-center gap-2">
                        <Save size={18} /> 이미지 저장하기
                      </button>
                    </form>
                  </div>
                </div>

                {/* Password Change Section */}
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                    <Key size={20} className="text-secondary" /> 비밀번호 변경
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-full">
                    <form onSubmit={handleChangePassword} className="space-y-6">
                       <p className="text-sm text-gray-600 mb-4">
                         관리자 페이지 접속을 위한 비밀번호를 변경합니다.<br/>
                         변경된 비밀번호는 현재 브라우저에 저장됩니다.
                       </p>
                       
                       <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">
                           새로운 비밀번호
                         </label>
                         <input 
                            type="text" 
                            className="w-full px-4 py-3 border rounded-lg focus:border-secondary outline-none bg-white text-gray-900"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            placeholder="변경할 비밀번호 입력"
                         />
                       </div>

                       <button type="submit" className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-black transition-colors flex justify-center items-center gap-2">
                         <Save size={18} /> 비밀번호 변경하기
                       </button>
                       
                       <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-800">
                         <p className="font-bold mb-1">비밀번호를 잊으셨나요?</p>
                         <p>로그인 화면의 '비밀번호를 잊으셨나요?' 버튼을 통해 초기화할 수 있습니다.</p>
                       </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* --- EXPORT DATA SECTION (MOVED HERE FOR VISIBILITY) --- */}
              <div className="p-8 bg-gray-900 text-green-400 rounded-xl border border-gray-800 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <div>
                     <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                       <Download size={24} className="text-green-500"/> 데이터 내보내기 (개발자용)
                     </h3>
                     <p className="text-gray-400 text-sm">
                       여기서 수정한 데이터를 영구 저장하려면 아래 코드를 복사하세요.
                     </p>
                  </div>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(exportCode); alert("코드가 클립보드에 복사되었습니다!"); }}
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors shrink-0"
                  >
                    코드 복사하기
                  </button>
                </div>
                <div className="bg-black p-4 rounded-lg overflow-x-auto max-h-60 border border-gray-700">
                  <pre className="text-xs font-mono whitespace-pre-wrap">{exportCode}</pre>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Admin;