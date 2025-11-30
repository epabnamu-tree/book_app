import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ShoppingCart, BookOpen, Check, ArrowLeft, Download, Users, FileText, Star, AlignLeft } from 'lucide-react';
import { useData } from '../context/DataContext';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { books } = useData();
  const [activeTab, setActiveTab] = useState<'intro' | 'review' | 'toc'>('intro');
  
  const book = books.find(b => b.id === id);

  if (!book) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pt-8 pb-20 bg-background min-h-screen">
      
      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft size={16} /> 다른 책 보러가기
        </Link>
      </div>

      {/* Header Area */}
      <div className="bg-white border-b border-gray-100 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Cover Image */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-start">
               <div className="w-64 md:w-full max-w-sm shadow-2xl rounded-r-lg transform transition-transform hover:scale-105 duration-500 bg-gray-200">
                  <img src={book.coverUrl} alt={book.title} className="w-full rounded-lg object-cover" />
               </div>
            </div>

            {/* Book Info */}
            <div className="w-full md:w-2/3 pt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {book.tags.map(tag => (
                  <span key={tag} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-serif font-bold text-primary mb-2">{book.title}</h1>
              <p className="text-xl text-gray-500 mb-6">{book.subtitle}</p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-8 border-l-4 border-secondary pl-4 bg-gray-50 py-4 pr-4 rounded-r-lg">
                {book.description}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 text-sm border-t border-b border-gray-100 py-6">
                <div>
                  <span className="block text-gray-400 mb-1">저자</span>
                  <span className="font-semibold">연구그룹 이팝나무</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">출판사</span>
                  <span className="font-semibold">{book.publisher}</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">발행일</span>
                  <span className="font-semibold">{book.publishDate}</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">상태</span>
                  <span className="font-semibold text-green-600">판매중</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={book.purchaseUrl || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-6 bg-primary text-white rounded-lg font-bold hover:bg-[#1a252f] transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingCart size={18} /> 구매하기
                </a>
                <Link to="/discussion" className="flex-1 py-3.5 px-6 bg-white border border-gray-300 text-primary rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Users size={18} /> 독자 토론장
                </Link>
                <Link to="/resources" className="flex-1 py-3.5 px-6 bg-white border border-gray-300 text-primary rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Download size={18} /> 부록 다운로드
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Tab Header */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('intro')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-lg border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'intro' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <FileText size={20} /> 저자의 책소개
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-lg border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'review' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Star size={20} /> 서평 / 추천사
          </button>
          <button 
            onClick={() => setActiveTab('toc')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-lg border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'toc' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <AlignLeft size={20} /> 목차
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
          {activeTab === 'intro' && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif font-bold text-primary mb-6">저자의 책 소개</h3>
              <div className="prose prose-lg text-gray-700 leading-loose whitespace-pre-line font-light">
                {book.authorNote || "작성된 책 소개가 없습니다."}
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif font-bold text-primary mb-6">서평 및 추천사</h3>
              <div className="prose prose-lg text-gray-700 leading-loose whitespace-pre-line bg-gray-50 p-6 rounded-lg border-l-4 border-secondary italic">
                {book.reviewsText || "등록된 서평이 없습니다."}
              </div>
            </div>
          )}

          {activeTab === 'toc' && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif font-bold text-primary mb-6">목차</h3>
              <div className="prose prose-lg text-gray-700 leading-loose whitespace-pre-line font-mono text-sm md:text-base">
                {book.tableOfContents || "목차 정보가 없습니다."}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default BookDetail;