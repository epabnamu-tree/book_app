import React, { useState } from 'react';
import { Mail, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useData } from '../context/DataContext';

const Contact: React.FC = () => {
  const { faqs } = useData();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  // We use standard form submission now
  const [formData, setFormData] = useState({ name: '', email: '', type: '강연 요청', message: '' });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-[#F9F7F2] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">문의하기</h1>
          <p className="text-gray-600">궁금한 점이 있으시거나 제안하실 내용이 있다면 언제든 연락 주세요.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <h2 className="text-2xl font-bold font-serif text-primary mb-6">메시지 보내기</h2>
            
            {/* Standard FormSubmit Form */}
            <form 
              action="https://formsubmit.co/epabnamu@gmail.com" 
              method="POST" 
              className="space-y-6"
              target="_blank"
            >
              {/* Configuration Inputs */}
              <input type="hidden" name="_subject" value={`[이팝나무 문의] ${formData.name}님의 메시지`} />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              {/* Redirect back to contact page after submission */}
              <input type="hidden" name="_next" value={window.location.href} />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-secondary bg-gray-50 text-gray-900" 
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-secondary bg-gray-50 text-gray-900" 
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">문의 유형</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-secondary bg-gray-50 text-gray-900"
                >
                  <option>강연 요청</option>
                  <option>오탈자 제보</option>
                  <option>기타 문의</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                <textarea 
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-secondary bg-gray-50 resize-none text-gray-900"
                  placeholder="내용을 입력해주세요..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-[#1a252f] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Send size={18} /> 메시지 보내기
              </button>
            </form>
          </div>

          {/* FAQ & Info */}
          <div className="space-y-10">
            
            {/* Contact Info Cards */}
            <div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-secondary/10 text-secondary rounded-full">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                  <p className="font-medium text-primary">epabnamu@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Accordion FAQ */}
            <div>
              <h2 className="text-2xl font-bold font-serif text-primary mb-6">자주 묻는 질문 (FAQ)</h2>
              <div className="space-y-4">
                {faqs.length === 0 ? (
                  <p className="text-gray-500">등록된 FAQ가 없습니다.</p>
                ) : (
                  faqs.map((faq, index) => (
                    <div key={faq.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300">
                      <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                      >
                        <span className={`font-medium ${openFaqIndex === index ? 'text-secondary' : 'text-primary'}`}>
                          Q. {faq.question}
                        </span>
                        {openFaqIndex === index ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
                      </button>
                      <div 
                        className={`px-6 overflow-hidden transition-all duration-300 ${
                          openFaqIndex === index ? 'max-h-40 py-4 border-t border-gray-50' : 'max-h-0'
                        }`}
                      >
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;