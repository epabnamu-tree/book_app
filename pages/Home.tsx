import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Mic, ChevronRight, Book as BookIcon } from 'lucide-react';
import { useData } from '../context/DataContext';

const Home: React.FC = () => {
  const { books, authorProfileImage } = useData();
  const [rotatingIndex, setRotatingIndex] = useState(0);

  // Logic to determine which books to show
  // We want 2 pinned books and 1 rotating book from the "rest"
  const pinnedBooks = books.filter(b => b.isPinned).slice(0, 2);
  const otherBooks = books.filter(b => !pinnedBooks.includes(b));

  // Carousel Logic
  useEffect(() => {
    if (otherBooks.length <= 1) return;
    const interval = setInterval(() => {
      setRotatingIndex(prev => (prev + 1) % otherBooks.length);
    }, 5000); // 5 seconds interval
    return () => clearInterval(interval);
  }, [otherBooks.length]);

  const currentRotatingBook = otherBooks.length > 0 ? otherBooks[rotatingIndex] : null;

  // Compile the display list: 2 Pinned + 1 Rotating (if available)
  const displayBooks = [...pinnedBooks];
  if (currentRotatingBook) {
    displayBooks.push(currentRotatingBook);
  }

  return (
    <div className="flex flex-col gap-0">
      
      {/* Hero Section: Author Focus */}
      <section className="relative min-h-[600px] flex items-center bg-[#F9F7F2] overflow-hidden py-12 md:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center gap-16 w-full relative z-10">
          
          {/* Text Content */}
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs md:text-sm uppercase mb-2 block">Research Group Epabnamu</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary">
                <span className="block mb-2 md:mb-4 leading-snug">기술의 진보와 인간의 삶,</span>
                <span className="relative inline-block leading-snug">
                  <span className="relative z-10">조화로운 공존을 탐구하다</span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-secondary/20 -z-0 rounded-sm"></span>
                </span>
              </h1>
            </div>
            <p className="text-lg text-gray-600 font-light max-w-lg leading-relaxed mx-auto md:mx-0">
              사회과학의 질문과 기술 현장의 경험이 교차하는 길 위에서,
              '기술이 누구를 위해 존재해야 하는가'를 끊임없이 고민합니다.<br/><br/>
              <b>연구그룹 이팝나무</b>는 기술의 혜택이 모두에게<br/>
              공정하게 흐르는 세상을 꿈꿉니다.
            </p>
            <div className="pt-4 flex justify-center md:justify-start gap-4">
               <Link to="/about" className="px-8 py-3.5 bg-white border border-gray-200 text-primary rounded-lg font-bold hover:bg-gray-50 transition-all shadow-sm hover:shadow flex items-center gap-3">
                 소개 더 보기
               </Link>
            </div>
          </div>
          
          {/* Author/Group Image - Redesigned */}
          <div className="flex-1 flex justify-center md:justify-end relative w-full max-w-lg">
             <div className="relative w-full aspect-[4/3] md:aspect-square max-w-md mx-auto">
                {/* Decorative Elements */}
                <div className="absolute top-6 left-6 w-full h-full bg-primary/5 rounded-2xl -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -z-10"></div>
                
                {/* Main Image Card */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/50 bg-white">
                  <img 
                    src={authorProfileImage} 
                    alt="Research Group Epabnamu" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Book Gallery Section (3 Books: 2 Pinned + 1 Rotating) */}
      <section id="book-list" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">대표 도서</h2>
            <p className="text-gray-500">이팝나무의 통찰이 담긴 저서들을 만나보세요.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayBooks.map((book) => (
              <div key={book.id} className="group cursor-pointer animate-fade-in">
                <Link to={`/book/${book.id}`} className="block h-full">
                  <div className="relative aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden shadow-lg mb-6 transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border border-gray-100">
                    <img 
                      src={book.coverUrl} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-primary px-6 py-2 rounded-full font-bold transform scale-95 group-hover:scale-100 transition-all shadow-lg">
                        자세히 보기
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col h-full">
                    <div className="flex gap-2 mb-2">
                       {/* Show Category if available, otherwise tag */}
                       {book.category ? (
                         <span className="text-xs font-bold text-secondary uppercase tracking-wider border border-secondary/20 px-2 py-0.5 rounded">
                           {book.category}
                         </span>
                       ) : (
                         book.tags.slice(0, 1).map(tag => (
                           <span key={tag} className="text-xs font-bold text-secondary uppercase tracking-wider">{tag}</span>
                         ))
                       )}
                    </div>
                    <h3 className="text-xl font-bold font-serif text-primary mb-1 group-hover:text-secondary transition-colors">{book.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{book.subtitle}</p>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
                      {book.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
            
            {/* If we have fewer than 3 books total, fill space with a placeholder */}
            {displayBooks.length < 3 && (
              <div className="flex flex-col items-center justify-center aspect-[2/3] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 p-8 text-center hover:border-gray-300 transition-colors">
                 <BookIcon size={48} className="mb-4 opacity-30" />
                 <h3 className="text-lg font-bold mb-2">Next Book</h3>
                 <p className="text-sm">디지털 휴머니즘을 주제로<br/>연구 및 집필 중입니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Philosophy / About Section */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 leading-snug">
                "기술은 차갑지만,<br/>경제는 따뜻해야 합니다."
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
                <p>
                  우리는 전례 없는 속도로 발전하는 AI 시대를 살아가고 있습니다.
                  하지만 그 속도감 속에서 정작 중요한 '사람'의 가치는 희미해져 갑니다.
                </p>
                <p>
                  저희는 경제학 데이터와 인문학적 상상력을 도구 삼아, 
                  기술 발전이 소수가 아닌 모두의 번영으로 이어지는 길을 찾습니다.
                  저희의 책들이 여러분에게 작은 나침반이 되기를 바랍니다.
                </p>
              </div>
              <div className="mt-10 flex gap-6">
                 <div className="flex items-center gap-3">
                   <div className="p-3 bg-white/10 rounded-full"><PenTool size={20}/></div>
                   <span className="font-medium">20+ 칼럼 기고</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="p-3 bg-white/10 rounded-full"><Mic size={20}/></div>
                   <span className="font-medium">50+ 강연 진행</span>
                 </div>
              </div>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
               <h3 className="text-xl font-bold mb-6 text-secondary">주요 활동 분야</h3>
               <ul className="space-y-4">
                 {[
                   "디지털 전환과 노동 시장의 변화 연구",
                   "사회적 경제 기업 자문 및 컨설팅",
                   "기본소득 한국 네트워크 정책 위원",
                   "청년 협동조합 멘토링 프로그램 운영"
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <ChevronRight className="text-secondary shrink-0 mt-1" size={16} />
                     <span className="text-gray-200">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;