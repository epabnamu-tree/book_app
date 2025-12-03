import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Download, Users, Star, AlignLeft, Book, BookOpen, Gift, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import SEO from '../components/SEO';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { books } = useData();
  const book = books.find(b => b.id === id);

  const [activeTab, setActiveTab] = useState<'intro' | 'review' | 'toc'>('intro');
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  
  if (!book) return <Navigate to="/" replace />;
  
  const getStoreInfo = (key: string) => { switch (key) { case 'kyobo': return { label: '교보문고', color: 'text-green-600', icon: <BookOpen size={16}/> }; case 'aladin': return { label: '알라딘', color: 'text-pink-600', icon: <Book size={16}/> }; case 'yes24': return { label: 'YES24', color: 'text-blue-600', icon: <BookOpen size={16}/> }; default: return { label: '기타/공식몰', color: 'text-gray-600', icon: <Gift size={16}/> }; } };
  const purchaseKeys = book.purchaseLinks ? Object.keys(book.purchaseLinks).filter(k => book.purchaseLinks![k as keyof typeof book.purchaseLinks]) : [];

  // Google Structured Data (JSON-LD) for Book
  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "author": {
      "@type": "Organization",
      "name": "연구그룹 이팝나무"
    },
    "datePublished": book.publishDate,
    "image": book.coverUrl,
    "description": book.description,
    "publisher": {
      "@type": "Organization",
      "name": book.publisher
    },
    "isbn": "", // ISBN 정보가 있다면 추가
    "url": window.location.href
  };

  return (
    <div className="pt-8 pb-20 bg-background min-h-screen">
      <SEO 
        title={book.title} 
        description={book.description.substring(0, 150) + "..."} 
        image={book.coverUrl}
        type="book"
        keywords={book.tags}
        schema={bookSchema}
      />
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
                      <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden">
                        {purchaseKeys.map((key) => {
                          const info = getStoreInfo(key);
                          const link = book.purchaseLinks![key as keyof typeof book.purchaseLinks];
                          return (
                            <a
                              key={key}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-gray-800 border-b last:border-none"
                            >
                              <div className={info.color}>{info.icon}</div>
                              <span className="text-sm font-bold">{info.label}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                </div>
                
                <Link to="/resources" className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Download size={18} /> 자료실
                </Link>
                <Link to="/discussion" className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Users size={18} /> 독자 토론
                </Link>
              </div>
            </div>
          </div>
        </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-6 py-4 font-bold text-lg flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'intro' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <AlignLeft size={20} /> 책 소개
          </button>
          <button
            onClick={() => setActiveTab('toc')}
            className={`px-6 py-4 font-bold text-lg flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'toc' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Book size={20} /> 목차
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-6 py-4 font-bold text-lg flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'review' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Star size={20} /> 서평/추천사
          </button>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'intro' && (
            <div className="space-y-12 animate-fade-in">
              {book.authorNote && (
                <div>
                  <h3 className="text-2xl font-serif font-bold text-primary mb-4">저자의 말</h3>
                  <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-gray-700 leading-loose whitespace-pre-wrap">
                    {book.authorNote}
                  </div>
                </div>
              )}
              <div>
                 <h3 className="text-2xl font-serif font-bold text-primary mb-4">상세 소개</h3>
                 <div className="prose prose-lg max-w-none text-gray-700 leading-loose whitespace-pre-wrap">
                    {book.description}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'toc' && (
            <div className="animate-fade-in">
               <h3 className="text-2xl font-serif font-bold text-primary mb-6">목차</h3>
               <div className="bg-white p-8 rounded-xl border border-gray-100 text-gray-700 leading-loose whitespace-pre-wrap">
                 {book.tableOfContents || "등록된 목차 정보가 없습니다."}
               </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="animate-fade-in">
               <h3 className="text-2xl font-serif font-bold text-primary mb-6">서평 및 추천사</h3>
               <div className="prose prose-lg max-w-none text-gray-700 leading-loose whitespace-pre-wrap">
                 {book.reviewsText || "등록된 서평이 없습니다."}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;