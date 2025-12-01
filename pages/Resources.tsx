
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, Download, ExternalLink, Archive, Lock, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Resource } from '../types';
import { useSEO } from '../hooks/useSEO';

const Resources: React.FC = () => {
  useSEO({ title: "자료실", description: "도서 부록 및 연구 자료를 다운로드할 수 있습니다." });
  const { resources, books } = useData();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterBookId = searchParams.get('bookId');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLIC' | 'BOOK'>('ALL');
  const [downloadModal, setDownloadModal] = useState<{ isOpen: boolean, resource: Resource | null }>({ isOpen: false, resource: null });
  const [downloadCode, setDownloadCode] = useState("");
  const [downloadError, setDownloadError] = useState("");

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

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12"><h1 className="text-4xl font-serif font-bold text-primary mb-4">자료실 & 부록</h1></div>
        <div className="flex justify-center mb-12">
           <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              {['ALL', 'PUBLIC', 'BOOK'].map(t => <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>{t === 'ALL' ? '전체' : t === 'PUBLIC' ? '일반' : '도서(인증)'}</button>)}
           </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map(res => (
                <div key={res.id} className="bg-background rounded-xl p-6 border border-gray-100 flex flex-col relative group">
                    {res.category === 'BOOK' && <div className="absolute top-4 right-4 text-purple-400"><Lock size={20}/></div>}
                    <h3 className="text-lg font-bold text-primary mb-2">{res.title}</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">{res.description}</p>
                    <button onClick={() => handleDownloadClick(res)} className={`w-full py-2.5 font-medium rounded-lg flex items-center justify-center gap-2 ${res.category === 'BOOK' ? 'bg-purple-50 text-purple-600' : 'bg-white border text-primary'}`}>{res.category === 'BOOK' ? '인증 후 다운로드' : '다운로드'}</button>
                </div>
            ))}
        </div>
      </div>
      {downloadModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold mb-4">도서 인증</h3>
              <form onSubmit={handleVerifyDownload}>
                 <input type="text" placeholder="인증 코드" className="w-full px-4 py-3 border rounded-lg mb-2 bg-white text-gray-900" value={downloadCode} onChange={(e) => setDownloadCode(e.target.value)} />
                 {downloadError && <p className="text-red-500 text-xs mb-3">{downloadError}</p>}
                 <div className="flex gap-2"><button type="button" onClick={() => setDownloadModal({isOpen: false, resource: null})} className="flex-1 py-3 bg-gray-200 rounded-lg">취소</button><button type="submit" className="flex-1 py-3 bg-purple-600 text-white rounded-lg">확인</button></div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
export default Resources;
