import React from 'react';
import Comments from '../components/Comments';
import { useSEO } from '../hooks/useSEO';
import { MessageCircle, ShieldCheck } from 'lucide-react';

const Discussion: React.FC = () => {
  useSEO({ title: "수다 떨기", description: "이팝나무 독자들의 자유로운 소통 공간입니다." });

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 헤더 */}
        <div className="text-center mb-12">
          <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Community</span>
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">수다 떨기</h1>
          <p className="text-gray-600 leading-relaxed">
            책에 대한 감상, 질문, 또는 자유로운 이야기를 남겨주세요.<br/>
            이팝나무 연구그룹과 독자들이 함께 소통하는 공간입니다.
          </p>
        </div>

        {/* 안내 문구 박스 (신규 추가) */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-sm text-blue-800">
           <div className="flex items-start gap-3">
              <MessageCircle className="shrink-0 mt-1" size={20}/>
              <div className="space-y-2">
                 <p className="font-bold">댓글 시스템 안내 (Disqus)</p>
                 <ul className="list-disc pl-4 space-y-1 opacity-80">
                    <li>이곳은 <b>Disqus(디스커스)</b> 댓글 시스템을 사용하여 운영됩니다.</li>
                    <li>구글, 페이스북, 트위터 아이디로 로그인하거나, <b>게스트(비회원)</b>로 댓글을 남길 수 있습니다.</li>
                    <li>무료 버전을 사용 중이므로 댓글창 주변에 <b>광고가 표시될 수 있습니다.</b> 너른 양해 부탁드립니다.</li>
                 </ul>
              </div>
           </div>
        </div>

        {/* Disqus 댓글창 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <Comments 
            id="discussion-board-main" 
            title="수다 떨기 방명록" 
          />
        </div>

      </div>
    </div>
  );
};

export default Discussion;