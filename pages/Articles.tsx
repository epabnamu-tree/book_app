
import React, { useState } from 'react';
import { PenTool, Calendar, User, MessageSquare, ChevronDown, ChevronUp, Lock, Send, X, Edit2, Trash2, List, Layout as LayoutIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ArticleComment, Article } from '../types';
import { useSEO } from '../hooks/useSEO';

const Articles: React.FC = () => {
  useSEO({ title: "글 나누기", description: "연구그룹 이팝나무의 칼럼, 에세이, 공지사항을 공유하는 공간입니다." });
  
  const { articles, isAdmin, addArticleComment, updateArticleComment, deleteArticleComment } = useData();
  const [viewMode, setViewMode] = useState<'feed' | 'list'>('feed');
  const [expandedArticleId, setExpandedArticleId] = useState<number | null>(null);

  const [activeCommentBoxId, setActiveCommentBoxId] = useState<number | null>(null);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentPassword, setCommentPassword] = useState("");
  const [commentText, setCommentText] = useState("");

  const [authModal, setAuthModal] = useState<{ isOpen: boolean, articleId: number, commentId: number, action: 'edit' | 'delete' }>({
    isOpen: false, articleId: 0, commentId: 0, action: 'edit'
  });
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const sortedArticles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const toggleExpand = (id: number) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  const handleCommentSubmit = (e: React.FormEvent, articleId: number) => {
    e.preventDefault();
    if (!commentText || !commentPassword) { alert("내용과 비밀번호를 입력해주세요."); return; }
    const newComment: ArticleComment = {
      id: Date.now(),
      author: commentAuthor || (isAdmin ? "이팝나무" : "익명"),
      content: commentText,
      date: new Date().toISOString().split('T')[0],
      password: commentPassword
    };
    addArticleComment(articleId, newComment);
    setCommentText(""); setCommentAuthor(""); setCommentPassword(""); setActiveCommentBoxId(null);
  };

  const openAuthModal = (articleId: number, commentId: number, action: 'edit' | 'delete') => {
    if (isAdmin) {
        if (action === 'delete') { if(window.confirm("삭제하시겠습니까?")) deleteArticleComment(articleId, commentId); } 
        else { 
             const art = articles.find(a => a.id === articleId);
             const com = art?.comments.find(c => c.id === commentId);
             if (com) { setEditingCommentId(commentId); setEditCommentContent(com.content); }
        }
    } else {
        setAuthModal({ isOpen: true, articleId, commentId, action });
        setAuthPassword(""); setAuthError("");
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { articleId, commentId, action } = authModal;
    const article = articles.find(a => a.id === articleId);
    const comment = article?.comments.find(c => c.id === commentId);
    if (comment && comment.password === authPassword) {
        if (action === 'delete') { if(window.confirm("댓글을 삭제하시겠습니까?")) deleteArticleComment(articleId, commentId); } 
        else { setEditingCommentId(commentId); setEditCommentContent(comment.content); }
        setAuthModal({ ...authModal, isOpen: false });
    } else { setAuthError("비밀번호가 일치하지 않습니다."); }
  };

  const handleSaveEdit = (articleId: number, commentId: number) => {
      const article = articles.find(a => a.id === articleId);
      const comment = article?.comments.find(c => c.id === commentId);
      if (comment) { updateArticleComment(articleId, { ...comment, content: editCommentContent }); setEditingCommentId(null); }
  };

  return (
    <div className="bg-[#F9F7F2] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Articles & Essays</span>
           <h1 className="text-4xl font-serif font-bold text-primary mb-4">글 나누기</h1>
           <p className="text-gray-600">이팝나무의 생각, 연구 노트, 그리고 소식을 전합니다.</p>
        </div>
        <div className="flex justify-between items-center mb-8">
           <div className="text-sm text-gray-500 font-medium">총 {articles.length}개의 글</div>
           <div className="flex bg-white rounded-lg p-1 border border-gray-200">
              <button onClick={() => setViewMode('feed')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${viewMode === 'feed' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600'}`}><LayoutIcon size={16} /> 전체 보기</button>
              <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600'}`}><List size={16} /> 제목만 보기</button>
           </div>
        </div>
        <div className="space-y-8">
           {sortedArticles.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-xl border border-gray-100 text-gray-400">
                  <PenTool size={40} className="mx-auto mb-4 opacity-30" />
                  <p>아직 등록된 글이 없습니다.</p>
               </div>
           ) : (
             sortedArticles.map(article => (
               <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {viewMode === 'feed' || expandedArticleId === article.id ? (
                      <div className="p-8">
                         <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.map(tag => ( <span key={tag} className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs font-bold rounded uppercase tracking-wider">{tag}</span> ))}
                         </div>
                         <h2 className="text-2xl font-serif font-bold text-primary mb-2">{article.title}</h2>
                         <div className="flex items-center gap-4 text-xs text-gray-400 mb-8 border-b border-gray-100 pb-4">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span>
                            <span className="flex items-center gap-1"><User size={12}/> {article.author}</span>
                            {viewMode === 'list' && (<button onClick={() => setExpandedArticleId(null)} className="ml-auto flex items-center gap-1 text-primary hover:underline">접기 <ChevronUp size={12}/></button>)}
                         </div>
                         <div className="prose prose-lg text-gray-700 leading-loose whitespace-pre-line mb-8">{article.content}</div>
                         <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                               <h3 className="font-bold text-primary flex items-center gap-2"><MessageSquare size={16}/> 댓글 ({article.comments.length})</h3>
                               <button onClick={() => setActiveCommentBoxId(activeCommentBoxId === article.id ? null : article.id)} className="text-sm text-secondary font-bold hover:underline">{activeCommentBoxId === article.id ? "작성 취소" : "댓글 쓰기"}</button>
                            </div>
                            <div className="space-y-4 mb-6">
                               {article.comments.length > 0 ? (
                                   article.comments.map(comment => (
                                      <div key={comment.id} className="bg-white p-4 rounded border border-gray-200 text-sm group">
                                         {editingCommentId === comment.id ? (
                                             <div>
                                                 <textarea value={editCommentContent} onChange={(e) => setEditCommentContent(e.target.value)} className="w-full p-2 border rounded mb-2 text-gray-900 bg-white" />
                                                 <div className="flex gap-2"><button onClick={() => handleSaveEdit(article.id, comment.id)} className="px-3 py-1 bg-green-500 text-white rounded text-xs">저장</button><button onClick={() => setEditingCommentId(null)} className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs">취소</button></div>
                                             </div>
                                         ) : (
                                            <>
                                                <div className="flex justify-between mb-1">
                                                    <span className={`font-bold ${comment.author === '이팝나무' ? 'text-secondary' : 'text-gray-800'}`}>{comment.author}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-400">{comment.date}</span>
                                                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                                            <button onClick={() => openAuthModal(article.id, comment.id, 'edit')} className="text-blue-400 hover:text-blue-600"><Edit2 size={12}/></button>
                                                            <button onClick={() => openAuthModal(article.id, comment.id, 'delete')} className="text-red-400 hover:text-red-600"><Trash2 size={12}/></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">{comment.isHidden ? <span className="text-gray-400 italic">블라인드 처리된 댓글</span> : comment.content}</p>
                                            </>
                                         )}
                                      </div>
                                   ))
                               ) : <p className="text-gray-400 text-xs italic">첫 번째 댓글을 남겨보세요.</p>}
                            </div>
                            {activeCommentBoxId === article.id && (
                                <form onSubmit={(e) => handleCommentSubmit(e, article.id)} className="animate-fade-in">
                                    <div className="flex gap-2 mb-2">
                                        <input type="text" placeholder="이름" value={commentAuthor} onChange={e => setCommentAuthor(e.target.value)} className="w-1/3 p-2 text-sm border rounded bg-white text-gray-900" />
                                        <input type="password" placeholder="비밀번호" value={commentPassword} onChange={e => setCommentPassword(e.target.value)} className="w-1/3 p-2 text-sm border rounded bg-white text-gray-900" />
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="내용을 입력하세요..." value={commentText} onChange={e => setCommentText(e.target.value)} className="flex-1 p-2 text-sm border rounded bg-white text-gray-900" />
                                        <button type="submit" className="bg-primary text-white p-2 rounded hover:bg-gray-700"><Send size={16}/></button>
                                    </div>
                                </form>
                            )}
                         </div>
                      </div>
                  ) : (
                      <div onClick={() => toggleExpand(article.id)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                             <span className="text-xs text-gray-400 w-24">{article.date}</span>
                             <h3 className="font-bold text-primary text-lg truncate max-w-md">{article.title}</h3>
                             <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-400"><MessageSquare size={12}/> {article.comments.length}</span>
                          </div>
                          <ChevronDown size={20} className="text-gray-300" />
                      </div>
                  )}
               </div>
             ))
           )}
        </div>
      </div>
      {authModal.isOpen && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold flex items-center gap-2"><Lock size={18}/> 비밀번호 확인</h3>
                  <button onClick={() => setAuthModal({...authModal, isOpen: false})}><X size={18}/></button>
               </div>
               <input type="password" autoFocus className="w-full p-2 border rounded mb-2 bg-white text-gray-900" placeholder="비밀번호 입력" value={authPassword} onChange={(e) => { setAuthPassword(e.target.value); setAuthError(""); }} />
               {authError && <p className="text-red-500 text-xs mb-2">{authError}</p>}
               <button onClick={handleAuthSubmit} className="w-full py-2 bg-primary text-white rounded font-bold">확인</button>
            </div>
         </div>
      )}
    </div>
  );
};
export default Articles;
    