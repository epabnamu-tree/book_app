import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Library: React.FC = () => {
  const { books } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extract unique categories, remove undefined/empty, and add "All"
  const categories = ["All", ...Array.from(new Set(books.map(b => b.category || "기타").filter(Boolean)))];

  const filteredBooks = selectedCategory === "All" 
    ? books 
    : books.filter(b => (b.category || "기타") === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Epabnamu Library</span>
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">이팝나무의 서재</h1>
          <p className="text-gray-600">연구그룹 이팝나무가 집필하고 연구한 모든 도서를 분야별로 소개합니다.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Book Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
              <Link to={`/book/${book.id}`} className="block relative aspect-[2/3] overflow-hidden bg-gray-200">
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                   {book.category && (
                     <span className="bg-white/90 text-primary text-[10px] font-bold px-2 py-1 rounded shadow">
                       {book.category}
                     </span>
                   )}
                </div>
              </Link>
              <div className="p-5 flex flex-col flex-grow">
                <Link to={`/book/${book.id}`}>
                   <h3 className="font-bold font-serif text-lg text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1" title={book.title}>
                     {book.title}
                   </h3>
                   <p className="text-xs text-gray-500 mb-3 line-clamp-1">{book.subtitle}</p>
                </Link>
                <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                   <span className="text-xs text-gray-400">{book.publishDate}</span>
                   <Link to={`/book/${book.id}`} className="text-xs font-bold text-secondary hover:underline">
                     자세히 보기
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>해당 카테고리에 도서가 없습니다.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Library;