
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useSEO } from '../hooks/useSEO';

const Library: React.FC = () => {
  useSEO({ title: "이팝나무의 서재", description: "연구그룹 이팝나무의 도서 목록입니다." });
  const { books } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", ...Array.from(new Set(books.map(b => b.category || "기타").filter(Boolean)))];
  const filteredBooks = selectedCategory === "All" ? books : books.filter(b => (b.category || "기타") === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Epabnamu Library</span>
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">이팝나무의 서재</h1>
          <p className="text-gray-600">연구그룹 이팝나무가 집필하고 연구한 모든 도서를 분야별로 소개합니다.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-bold ${selectedCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}>{cat}</button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col">
              <Link to={`/book/${book.id}`} className="block relative aspect-[2/3] overflow-hidden bg-gray-200">
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </Link>
              <div className="p-5 flex flex-col flex-grow">
                <Link to={`/book/${book.id}`}><h3 className="font-bold font-serif text-lg text-primary mb-1 truncate">{book.title}</h3></Link>
                <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                   <span className="text-xs text-gray-400">{book.publishDate}</span>
                   <Link to={`/book/${book.id}`} className="text-xs font-bold text-secondary hover:underline">자세히 보기</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Library;
