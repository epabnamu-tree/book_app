import React from 'react';
import Comments from '../components/Comments';
import { useSEO } from '../hooks/useSEO';

const Discussion: React.FC = () => {
  useSEO({ title: "수다 떨기", description: "이팝나무 독자들의 자유로운 소통 공간입니다." });

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Community</span>
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">수다 떨기</h1>
          <p className="text-gray-600 leading-relaxed">
            책에 대한 감상, 질문, 또는 자유로운 이야기를 남겨주세요.<br/>
            이팝나무 연구그룹과 독자들이 함께 소통하는 공간입니다.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <Comments id="discussion-board-main" title="수다 떨기 방명록" />
        </div>
      </div>
    </div>
  );
};

export default Discussion;