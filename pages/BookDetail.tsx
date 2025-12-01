
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Download, Users, FileText, Star, AlignLeft, Book, BookOpen, Gift, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useSEO } from '../hooks/useSEO';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { books } = useData();
  const book = books.find(b => b.id === id);
  useSEO({ title: book ? book.title : "도서 상세", description: book ? book.description : "도서 정보를 찾을 수 없습니다." });

  const [activeTab, setActiveTab] = useState<'intro' | 'review' | 'toc'>('intro');
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  
  if (!book) return <Navigate to="/" replace />;
  const getStoreInfo = (key: string) => { switch (key) { case 'kyobo': return { label: '교보문고', color: 'text-green-600', icon: <BookOpen size={16}/> }; case 'aladin': return { label: '알라딘', color: 'text-pink-600', icon: <Book size={16}/> }; case 'yes24': return { label: 'YES24', color: 'text-blue-600', icon: <BookOpen size={16}/> }; default: return { label: '기타/공식몰', color: 'text-gray-600', icon: <Gift size={16}/> }; } };
  const purchaseKeys = book.purchaseLinks ? Object.keys(book.purchaseLinks).filter(k => book.purchaseLinks![k as keyof typeof book.purchaseLinks]) : [];

  return (
    <div className="pt-8 pb-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"><Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"><ArrowLeft size={16} /> 홈으로 돌아가기</Link></div>
      <div className="bg-white border-b border-gray-100 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3 flex justify-center md:justify-start"><img src={book.coverUrl} alt={book.title} className="w-64 md:w-full max-w-sm shadow-2xl rounded-lg object-cover" /></div>
            <div className="w-full md:w-2/3 pt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {book.category && <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{book.category}</span>}
                {book.format?.map(fmt => <span key={fmt} className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{fmt}</span>)}
              </div>
              <h1 className="text-4xl font-serif font-bold text-primary mb-2">{book.title}</h1>
              <p className="text-xl text-gray-500 mb-6">{book.subtitle}</p>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 border-l-4 border-secondary pl-4 bg-gray-50 py-4 pr-4 rounded-r-lg">{book.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 text-sm border-t border-b border-gray-100 py-6">
                <div><span className="block text-gray-400 mb-1">저자</span><span className="font-semibold">연구그룹 이팝나무</span></div>
                <div><span className="block text-gray-400 mb-1">출판사</span><span className="font-semibold">{book.publisher}</span></div>
                <div><span className="block text-gray-400 mb-1">발행일</span><span className="font-semibold">{book.publishDate}</span></div>
                <div><span className="block text-gray-400 mb-1">상태</span><span className="font-semibold text-green-600">판매중</span></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 relative">
                <div className="relative flex-1">
                    <button onClick={() => setIsPurchaseOpen(!isPurchaseOpen)} className="w-full py-3.5 px-6 bg-primary text-white rounded-lg font-bold hover:bg-[#1a252f] flex items-center justify-center gap-2 shadow-lg"><ShoppingCart size={18} /> 구매하기 {purchaseKeys.length > 1 && <ChevronDown size={16}/>}</button>
                    {isPurchaseOpen && purchaseKeys.length > 0 && (
                      <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-20">
                        {purchaseKeys.map(key => { const info = getStoreInfo(key); return <a key={key} href={book.purchaseLinks![key as any]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50"><span className={info.color}>{info.icon}</span><span className="font-bold text-gray-700 text-sm">{info.label}</span></a>; })}
                      </div>
                    )}
                </div>
                <Link to="/discussion" className="flex-1 py-3.5 px-6 bg-white border border-gray-300 text-primary rounded-lg font-bold hover:bg-gray-50 flex items-center justify-center gap-2"><Users size={18} /> 수다 떨기</Link>
                <Link to={`/resources?bookId=${book.id}`} className="flex-1 py-3.5 px-6 bg-white border border-gray-300 text-primary rounded-lg font-bold hover:bg-gray-50 flex items-center justify-center gap-2"><Download size={18} /> 부록 다운로드</Link>
              </div>
            </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {['intro', 'review', 'toc'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex items-center gap-2 px-6 py-4 font-bold text-lg border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>{tab === 'intro' ? '저자의 책소개' : tab === 'review' ? '서평' : '목차'}</button>
          ))}
        </div>
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
           {activeTab === 'intro' && <div className="prose prose-lg text-gray-700 leading-loose whitespace-pre-line font-light">{book.authorNote || "내용 없음"}</div>}
           {activeTab === 'review' && <div className="prose prose-lg text-gray-700 leading-loose whitespace-pre-line italic bg-gray-50 p-6 rounded-lg">{book.reviewsText || "내용 없음"}</div>}
           {activeTab === 'toc' && <div className="prose prose-lg text-gray-700 leading-loose whitespace-pre-line font-mono text-sm">{book.tableOfContents || "내용 없음"}</div>}
        </div>
      </div>
    </div>
  );
};
export default BookDetail;
