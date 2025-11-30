import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Tag, User, Trash2, ChevronDown, ChevronUp, Send, Edit2, Lock, X, Save } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Post, Comment } from '../types';

const Discussion: React.FC = () => {
  const { posts, addPost, updatePost, deletePost, addComment, updateComment, deleteComment, isAdmin } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  
  // Write Form State
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Comment Form State
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentPassword, setCommentPassword] = useState("");

  // Comment Edit State
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Auth Modal State
  const [authModal, setAuthModal] = useState<{ 
    isOpen: boolean, 
    postId: number | null, 
    commentId?: number,
    action: 'edit' | 'delete' | 'edit-comment' | 'delete-comment' | null 
  }>({
    isOpen: false, postId: null, action: null
  });
  const [authPasswordInput, setAuthPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // --- Helper Functions ---

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAuthorName("");
    setEmail("");
    setPassword("");
    setFormMode('create');
    setEditPostId(null);
    setShowWriteForm(false);
  };

  const startEditing = (post: Post) => {
    setFormMode('edit');
    setEditPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setAuthorName(post.author);
    setEmail(post.email || "");
    // Force user to re-enter password for verification on save
    setPassword(""); 
    setShowWriteForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const executeDelete = (postId: number) => {
    deletePost(postId);
    if (expandedPostId === postId) setExpandedPostId(null);
    if (editPostId === postId) resetForm();
  };

  // --- Action Handlers (Post) ---

  const handleEditClick = (post: Post) => {
    if (isAdmin) {
      startEditing(post);
    } else {
      setAuthModal({ isOpen: true, postId: post.id, action: 'edit' });
      setAuthPasswordInput("");
      setAuthError("");
    }
  };

  const handleDeleteClick = (post: Post) => {
    if (isAdmin) {
      if(window.confirm("관리자 권한으로 삭제하시겠습니까?")) executeDelete(post.id);
    } else {
      setAuthModal({ isOpen: true, postId: post.id, action: 'delete' });
      setAuthPasswordInput("");
      setAuthError("");
    }
  };

  // --- Action Handlers (Comment) ---
  const handleCommentEditClick = (postId: number, comment: Comment) => {
    if (isAdmin) {
      setEditingCommentId(comment.id);
      setEditCommentText(comment.content);
    } else {
      setAuthModal({ isOpen: true, postId: postId, commentId: comment.id, action: 'edit-comment' });
      setAuthPasswordInput("");
      setAuthError("");
    }
  }

  const handleCommentDeleteClick = (postId: number, comment: Comment) => {
     if (isAdmin) {
        if(window.confirm("댓글을 삭제하시겠습니까?")) deleteComment(postId, comment.id);
     } else {
        setAuthModal({ isOpen: true, postId: postId, commentId: comment.id, action: 'delete-comment' });
        setAuthPasswordInput("");
        setAuthError("");
     }
  }

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { postId, action, commentId } = authModal;
    if (!postId || !action) return;

    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) {
      closeAuthModal();
      return;
    }

    // Post Actions
    if (action === 'edit' || action === 'delete') {
      if (targetPost.password === authPasswordInput) {
        if (action === 'edit') {
          startEditing(targetPost);
        } else if (action === 'delete') {
          if(window.confirm("정말로 삭제하시겠습니까?")) {
             executeDelete(postId);
          }
        }
        closeAuthModal();
      } else {
        setAuthError("비밀번호가 일치하지 않습니다.");
      }
      return;
    }

    // Comment Actions
    const targetComment = targetPost.comments.find(c => c.id === commentId);
    if (!targetComment) {
        closeAuthModal();
        return;
    }

    if (targetComment.password === authPasswordInput) {
        if (action === 'edit-comment') {
            setEditingCommentId(targetComment.id);
            setEditCommentText(targetComment.content);
        } else if (action === 'delete-comment') {
            if(window.confirm("댓글을 삭제하시겠습니까?")) {
                deleteComment(postId, targetComment.id);
            }
        }
        closeAuthModal();
    } else {
        setAuthError("비밀번호가 일치하지 않습니다.");
    }
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, postId: null, action: null });
    setAuthPasswordInput("");
    setAuthError("");
  };

  // --- Form Submission ---

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !authorName || !email || !password) {
      alert("모든 필드(제목, 내용, 이름, 이메일, 비밀번호)를 입력해주세요.");
      return;
    }

    if (formMode === 'create') {
      const newPost: Post = {
        id: Date.now(),
        title: title,
        author: authorName,
        email: email,
        password: password,
        date: new Date().toISOString().split('T')[0],
        content: content,
        tags: ["일반"],
        comments: []
      };
      addPost(newPost);
      alert("게시글이 등록되었습니다.");
    } else if (formMode === 'edit' && editPostId) {
      const originalPost = posts.find(p => p.id === editPostId);
      if (originalPost) {
        // Password verification for edit save
        if (!isAdmin && password !== originalPost.password) {
          alert("비밀번호가 일치하지 않습니다. 처음 등록했던 비밀번호를 입력해주세요.");
          return;
        }

        const updatedPost: Post = {
          ...originalPost,
          title, content, author: authorName, email, password
        };
        updatePost(updatedPost);
        alert("게시글이 수정되었습니다.");
      }
    }

    resetForm();
  };

  // --- Comment Logic ---

  const toggleExpand = (id: number) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    if (!commentText || !commentPassword) {
        alert("댓글 내용과 비밀번호를 입력해주세요.");
        return;
    }
    
    const newComment: Comment = {
      id: Date.now(),
      author: commentAuthor || (isAdmin ? "이팝나무" : "익명"),
      content: commentText,
      date: new Date().toISOString().split('T')[0],
      password: commentPassword
    };

    addComment(postId, newComment);
    setCommentText("");
    setCommentAuthor("");
    setCommentPassword("");
  };

  const handleSaveCommentEdit = (postId: number, comment: Comment) => {
      updateComment(postId, { ...comment, content: editCommentText });
      setEditingCommentId(null);
      setEditCommentText("");
  };

  // --- Filtering ---
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-12 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">토론방</h1>
            <p className="text-gray-600 mt-2">이팝나무의 모든 책에 대해 자유롭게 의견을 나누세요.</p>
          </div>
          <button 
            onClick={() => {
              if (showWriteForm) resetForm();
              else setShowWriteForm(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md"
          >
            {showWriteForm ? '작성 취소' : <><Plus size={18} /> 새 글 쓰기</>}
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center gap-3">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="관심 있는 키워드나 제목을 검색해보세요..." 
            className="flex-1 outline-none text-gray-900 bg-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Write Form */}
        {showWriteForm && (
          <div className="bg-white p-8 rounded-xl shadow-md mb-8 border-l-4 border-secondary animate-fade-in-down">
            <h3 className="text-xl font-bold mb-6 text-primary border-b pb-2">
              {formMode === 'create' ? (isAdmin ? '공지/칼럼 작성하기' : '새로운 토론 시작하기') : '게시글 수정하기'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary bg-white text-gray-900"
                />
              </div>

              {/* Author Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">이름(별명) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={authorName} 
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-secondary outline-none bg-white text-gray-900"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">이메일 <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-secondary outline-none bg-white text-gray-900"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">비밀번호 (수정/삭제용) <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-secondary outline-none bg-white text-gray-900"
                    placeholder="숫자 4자리 권장"
                  />
                  {formMode === 'edit' && <p className="text-xs text-secondary mt-1">수정을 완료하려면 원래 비밀번호를 입력해야 합니다.</p>}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">내용 <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="내용을 입력하세요. 서로 존중하는 태도로 의견을 나눠주세요."
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary resize-none bg-white text-gray-900"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2">
                 <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                   취소
                 </button>
                 <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#1a252f] font-medium">
                   {formMode === 'create' ? '등록하기' : '수정 완료'}
                 </button>
              </div>
            </form>
          </div>
        )}

        {/* Post List */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                {/* Post Summary (Clickable Header) */}
                <div 
                  onClick={() => toggleExpand(post.id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 mb-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium flex items-center gap-1">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{post.date}</span>
                      {/* User Actions: Edit/Delete */}
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleEditClick(post)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded bg-gray-50 hover:bg-blue-50 transition-colors" title="수정">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteClick(post)} className="p-1.5 text-gray-400 hover:text-red-500 rounded bg-gray-50 hover:bg-red-50 transition-colors" title="삭제">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">{post.title}</h3>
                     {expandedPostId === post.id ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                  </div>
                  
                  {/* Show preview if not expanded */}
                  {expandedPostId !== post.id && (
                     <p className="text-gray-600 text-sm line-clamp-2 mt-2">{post.content}</p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User size={14} />
                      <span className={post.author === "이팝나무" ? "font-bold text-secondary" : ""}>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1 text-secondary text-sm font-medium">
                      <MessageSquare size={14} />
                      <span>댓글 {post.comments.length}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details & Comments */}
                {expandedPostId === post.id && (
                  <div className="px-6 pb-6 bg-gray-50 border-t border-gray-100 animate-fade-in">
                    {/* Full Content */}
                    <div className="py-6 prose prose-sm max-w-none text-gray-800 whitespace-pre-line leading-relaxed">
                      {post.content}
                    </div>

                    {/* Comments Section */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <MessageSquare size={16} /> 댓글 ({post.comments.length})
                      </h4>
                      
                      {/* Comment List */}
                      <div className="space-y-3 mb-6">
                        {post.comments.length > 0 ? (
                           post.comments.map(comment => (
                             <div key={comment.id} className="bg-white p-3 rounded-lg border border-gray-200 text-sm group">
                               <div className="flex justify-between mb-1">
                                 <span className="font-bold text-primary">{comment.author}</span>
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">{comment.date}</span>
                                    {/* Comment Actions */}
                                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                      <button onClick={() => handleCommentEditClick(post.id, comment)} className="text-blue-400 hover:text-blue-600">
                                         <Edit2 size={12}/>
                                      </button>
                                      <button onClick={() => handleCommentDeleteClick(post.id, comment)} className="text-red-400 hover:text-red-600">
                                         <Trash2 size={12}/>
                                      </button>
                                    </div>
                                 </div>
                               </div>
                               {editingCommentId === comment.id ? (
                                 <div className="flex gap-2">
                                    <input 
                                      type="text" 
                                      value={editCommentText}
                                      onChange={(e) => setEditCommentText(e.target.value)}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-secondary bg-white text-gray-900"
                                      autoFocus
                                    />
                                    <button onClick={() => handleSaveCommentEdit(post.id, comment)} className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                                        <Save size={16} />
                                    </button>
                                    <button onClick={() => setEditingCommentId(null)} className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                                        <X size={16} />
                                    </button>
                                 </div>
                               ) : (
                                 <p className="text-gray-700">{comment.content}</p>
                               )}
                             </div>
                           ))
                        ) : (
                          <p className="text-sm text-gray-400 italic">아직 작성된 댓글이 없습니다.</p>
                        )}
                      </div>

                      {/* Add Comment Form */}
                      <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex flex-col gap-2">
                         <div className="flex flex-wrap gap-2">
                           <input 
                              type="text" 
                              placeholder="이름 (생략가능)"
                              value={commentAuthor}
                              onChange={(e) => setCommentAuthor(e.target.value)}
                              className="w-1/4 min-w-[100px] px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-secondary text-gray-900"
                           />
                           <input 
                              type="password" 
                              placeholder="비밀번호"
                              value={commentPassword}
                              onChange={(e) => setCommentPassword(e.target.value)}
                              className="w-1/4 min-w-[100px] px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-secondary text-gray-900"
                           />
                           <input 
                              type="text" 
                              placeholder="댓글 내용을 입력하세요..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="flex-1 min-w-[200px] px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-secondary text-gray-900"
                           />
                           <button type="submit" className="p-2 bg-primary text-white rounded-lg hover:bg-gray-700">
                             <Send size={16} />
                           </button>
                         </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>검색 결과가 없습니다. 첫 번째 글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {authModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Lock size={20} /> 비밀번호 확인
              </h3>
              <button onClick={closeAuthModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {authModal.action?.includes('delete') ? '삭제하려면' : '수정하려면'} 작성 시 설정한 비밀번호를 입력하세요.
            </p>
            <form onSubmit={handleAuthSubmit}>
              <input 
                type="password"
                autoFocus
                placeholder="비밀번호 입력"
                className={`w-full px-4 py-2 border rounded-lg mb-2 focus:outline-none text-gray-900 bg-white ${authError ? 'border-red-500' : 'border-gray-300 focus:border-secondary'}`}
                value={authPasswordInput}
                onChange={(e) => {
                  setAuthPasswordInput(e.target.value);
                  if (authError) setAuthError("");
                }}
              />
              {authError && <p className="text-red-500 text-sm mb-4 font-bold">{authError}</p>}
              
              <div className="flex gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={closeAuthModal}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-[#1a252f] font-medium"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Discussion;