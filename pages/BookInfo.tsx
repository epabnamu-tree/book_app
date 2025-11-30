import React from 'react';
import { ShoppingCart, BookOpen, Check } from 'lucide-react';
import { CHAPTERS } from '../constants';

const BookInfo: React.FC = () => {
  return (
    <div className="pt-8 pb-20">
      
      {/* Header */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">상세 정보</h1>
          <p className="text-lg opacity-80">책의 구성과 핵심 내용을 소개합니다.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Book Image */}
            <div className="w-full md:w-1/3 bg-gray-50 p-10 flex items-center justify-center">
               <div className="w-48 shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
                  <img src="https://loremflickr.com/600/900/book,cover" alt="Book Cover" className="w-full rounded" />
               </div>
            </div>

            {/* Book Details */}
            <div className="w-full md:w-2/3 p-10">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Economics</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Technology</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-4">Insight: 미래를 읽는 통찰</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                이 책은 단순한 기술 서적이 아닙니다. 인문학적 관점에서 AI를 바라보고, 경제학적 관점에서 해법을 제시하는 융합적 통찰의 결과물입니다.
                복잡한 수식 대신 생생한 사례와 명쾌한 논리로 독자들을 안내합니다.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
                <div>
                  <span className="block text-gray-400 mb-1">저자</span>
                  <span className="font-semibold">홍길동 (경제학 박사)</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">출판사</span>
                  <span className="font-semibold">미래지향</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">발행일</span>
                  <span className="font-semibold">2024. 10. 01</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">페이지</span>
                  <span className="font-semibold">342쪽</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-bold hover:bg-[#1a252f] transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={18} /> 교보문고 구매
                </button>
                <button className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={18} /> 예스24 구매
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <h3 className="text-2xl font-serif font-bold text-primary mb-8 flex items-center gap-2">
          <BookOpen className="text-secondary" /> 목차 소개
        </h3>
        <div className="space-y-6">
          {CHAPTERS.map((chapter) => (
            <div key={chapter.id} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-secondary/30 transition-colors shadow-sm">
              <h4 className="text-lg font-bold text-primary mb-2">{chapter.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{chapter.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
         <h3 className="text-2xl font-serif font-bold text-primary mb-8">이런 분들께 추천합니다</h3>
         <div className="grid sm:grid-cols-2 gap-4">
            {[
              "AI가 내 직업을 위협할까 두려운 직장인",
              "기본소득 논의의 핵심 쟁점을 알고 싶은 대학생",
              "ESG 경영과 사회적 가치를 고민하는 경영자",
              "기술과 사회의 공존에 관심 있는 모든 교양인"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-background rounded-lg">
                <div className="mt-1 bg-secondary rounded-full p-1 text-white">
                  <Check size={12} />
                </div>
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default BookInfo;
