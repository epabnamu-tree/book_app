
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, Download, ExternalLink, Archive, Lock, X, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Resource } from '../types';
import SEO from '../components/SEO';

const Resources: React.FC = () => {
  const { resources, books } = useData();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterBookId = searchParams.get('bookId');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLIC' | 'BOOK'>('ALL');
  const [downloadModal, setDownloadModal] = useState<{ isOpen: boolean, resource: Resource | null }>({ isOpen: false, resource: null });
  const [downloadCode, setDownloadCode] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [expandedDescId, setExpandedDescId] = useState<number | null>(null);

  const filteredResources = resources.filter(res => {
    const matchesTab = activeTab === 'ALL' || res.category === activeTab || (!res.category && activeTab === 'PUBLIC');
    const matchesBook = filterBookId ? res.bookId === filterBookId : true;
    return matchesTab && matchesBook;
  });

  const handleDownloadClick = (res: Resource) => {
    if (res.category === 'BOOK') { setDownloadModal({ isOpen: true, resource: res }); setDownloadCode(""); setDownloadError(""); } 
    else { window.open(res.url, '_blank'); }
  };
  const handleVerifyDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (downloadModal.resource?.downloadCode === downloadCode) { window.open(downloadModal.resource.url, '_blank'); setDownloadModal({ isOpen: false, resource: null }); } 
    else { setDownloadError("코드가 일치하지 않습니다."); }
  };

  const getBookTitle = (bookId?: string) => {
      if (!bookId) return null;
      return books.find(b => b.id === bookId)?.title;
  };

  const toggleDetail = (id: number) => {
      setExpandedDescId(expandedDescId === id ? null : id);
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <SEO 
        title="자료실" 
        description="이팝나무 도서의 부록 및 연구 자료를 다운로드할 수 있습니다. 독서 가이드, 통계 데이터 등 다양한 자료를 제공합니다." 
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12"><h1 className="text-4xl font-serif font-bold text-primary mb-4">자료실 & 부록</h1></div>
        <div className="flex justify-center mb-12">
           <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              {['ALL', 'PUBLIC', 'BOOK'].map(t => <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>{t === 'ALL' ? '전체' : t === 'PUBLIC' ? '일반' : '도서(인증)'}</button>)}
           </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map(res => {
                const associatedBook = getBookTitle(res.bookId);
                return (
                    <div key={res.id} className="bg-background rounded-xl border border-gray-100 flex flex-col relative group hover:shadow-lg transition-shadow overflow-hidden">
                        {/* Header Badge */}
                        <div className="absolute top-0 right-0 p-3 z-10">
                            {res.category === 'BOOK' ? (
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm"><Lock size={12}/> 인증필요</span>
                            ) : (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold shadow-sm">Free</span>
                            )}
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            {/* Associated Book Info */}
                            {associatedBook && (
                                <div className="text-xs text-secondary font-bold mb-2 flex items-center gap-1">
                                    <BookOpen size={12}/> {associatedBook}
                                </div>
                            )}

                            {/* Title & Description */}
                            <h3 className="text-lg font-bold text-primary mb-2 pr-16 leading-snug">{res.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{res.description}</p>
                            
                            {/* Detailed Description Toggle */}
                            {res.detailedDescription && (
                                <div className="mb-4">
                                    <button onClick={() => toggleDetail(res.id)} className="text-xs text-gray-400 hover:text-primary flex items-center gap-1">
                                        {expandedDescId === res.id ? '상세 설명 접기' : '상세 설명 보기'} 
                                        {expandedDescId === res.id ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                                    </button>
                                    {expandedDescId === res.id && (
                                        <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 animate-fade-in">
                                            {res.detailedDescription}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-auto pt-4">
                                <button onClick={() => handleDownloadClick(res)} className={`w-full py-3 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${res.category === 'BOOK' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-primary text-white hover:bg-gray-700'}`}>
                                    {res.category === 'BOOK' ? <Lock size={16}/> : <Download size={16}/>}
                                    {res.category === 'BOOK' ? '인증 후 다운로드' : '다운로드'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
      {downloadModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">도서 구매 인증</h3>
                  <button onClick={() => setDownloadModal({isOpen: false, resource: null})} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                  선택하신 자료는 <b>&lt;{getBookTitle(downloadModal.resource?.bookId)}&gt;</b> 도서 구매자를 위한 부록입니다. 책에 기재된 인증 코드를 입력해주세요.
              </p>
              <form onSubmit={handleVerifyDownload}>
                 <input type="text" placeholder="인증 코드 입력" className="w-full px-4 py-3 border rounded-lg mb-2 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none" value={downloadCode} onChange={(e) => setDownloadCode(e.target.value)} />
                 {downloadError && <p className="text-red-500 text-xs mb-3 flex items-center gap-1"><X size={12}/> {downloadError}</p>}
                 <div className="flex gap-2 mt-4">
                     <button type="button" onClick={() => setDownloadModal({isOpen: false, resource: null})} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200">취소</button>
                     <button type="submit" className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">확인</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
export default Resources;