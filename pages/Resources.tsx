
import React from 'react';
import { FileText, Download, ExternalLink, Archive } from 'lucide-react';
import { useData } from '../context/DataContext';

const Resources: React.FC = () => {
  const { resources } = useData();

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">자료실 & 부록</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            책의 내용을 더 깊이 이해하기 위한 보조 자료들을 모았습니다.<br />
            모든 자료는 독자 여러분의 학습과 연구를 위해 무료로 제공됩니다.
          </p>
        </div>

        {resources.length === 0 ? (
           <div className="text-center py-20 bg-gray-50 rounded-xl">
             <p className="text-gray-500">등록된 자료가 없습니다.</p>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-background rounded-xl p-6 border border-gray-100 flex flex-col hover:border-secondary transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    resource.type === 'PDF' ? 'bg-red-50 text-red-500' :
                    resource.type === 'ZIP' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {resource.type === 'PDF' && <FileText size={24} />}
                    {resource.type === 'ZIP' && <Archive size={24} />}
                    {resource.type === 'LINK' && <ExternalLink size={24} />}
                  </div>
                  <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 text-gray-500">
                    {resource.type} {resource.size && `• ${resource.size}`}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  {resource.description}
                </p>

                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-white border border-gray-200 text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {resource.type === 'LINK' ? <ExternalLink size={16} /> : <Download size={16} />}
                  {resource.type === 'LINK' ? '페이지 이동' : '다운로드'}
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 p-8 bg-primary/5 rounded-2xl border border-primary/10">
          <h3 className="text-xl font-bold font-serif text-primary mb-4">자료 활용 시 유의사항</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>제공되는 모든 자료의 저작권은 저자와 출판사에 있습니다.</li>
            <li>개인적인 학습 및 비영리 목적의 독서 모임에서는 자유롭게 사용하실 수 있습니다.</li>
            <li>자료를 무단으로 가공하여 재배포하거나 상업적으로 이용하는 것은 금지됩니다.</li>
            <li>파일 다운로드에 문제가 있을 경우 '문의하기' 게시판을 이용해 주세요.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Resources;
