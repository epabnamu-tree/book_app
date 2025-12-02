import React, { useState } from 'react';
import { PenTool, Calendar, User, ChevronDown, ChevronUp, Layout as LayoutIcon, List, MessageSquare } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useSEO } from '../hooks/useSEO';
import Comments from '../components/Comments';

const Articles: React.FC = () => {
  useSEO({ title: "글 나누기", description: "연구그룹 이팝나무의 칼럼, 에세이, 공지사항을 공유하는 공간입니다." });
  
  const { articles } = useData();
  const [viewMode, setViewMode] = useState<'feed' | 'list'>('feed');
  const [expandedArticleId, setExpandedArticleId] = useState<number | null>(null);
  
  // 댓글창 열림 상태 관리 (글 ID 저장)
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);

  const sortedArticles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const toggleExpand = (id: number) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  const toggleComments = (id: number) => {
      setActiveCommentId(activeCommentId === id ? null : id);
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
                  
                  {/* FEED 모드이거나 확장된 경우 */}
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
                         
                         <div className="prose prose-lg text-gray-700 leading-loose whitespace-pre-line mb-12">{article.content}</div>
                         
                         {/* 댓글 토글 버튼 및 Disqus 영역 */}
                         <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-gray-700 flex items-center gap-2"><MessageSquare size={18}/> 댓글</h3>
                                <button onClick={() => toggleComments(article.id)} className="text-sm font-bold text-secondary hover:underline">
                                    {activeCommentId === article.id ? "댓글 닫기" : "댓글 보기 / 쓰기"}
                                </button>
                            </div>
                            
                            {/* 버튼을 눌렀을 때만 Disqus 로드 (섞임 방지) */}
                            {activeCommentId === article.id && (
                                <div className="mt-4 animate-fade-in">
                                    <p className="text-xs text-gray-400 mb-4">* 댓글 시스템은 Disqus를 사용하며 광고가 표시될 수 있습니다.</p>
                                    <Comments 
                                        id={`article-${article.id}`} 
                                        title={article.title} 
                                    />
                                </div>
                            )}
                         </div>

                      </div>
                  ) : (
                      // LIST 모드
                      <div onClick={() => toggleExpand(article.id)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                             <span className="text-xs text-gray-400 w-24">{article.date}</span>
                             <h3 className="font-bold text-primary text-lg truncate max-w-md">{article.title}</h3>
                          </div>
                          <ChevronDown size={20} className="text-gray-300" />
                      </div>
                  )}
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};
export default Articles;