import React from 'react';
import { useData } from '../context/DataContext';
import { useSEO } from '../hooks/useSEO';

const About: React.FC = () => {
  useSEO({ title: "소개", description: "연구그룹 이팝나무의 철학과 비전을 소개합니다." });
  const { authorProfileImage } = useData();

  return (
    <div className="bg-[#F9F7F2] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Research Group Epabnamu</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">연구그룹 이팝나무 소개</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
          <div className="relative h-64 md:h-80 bg-gray-100 overflow-hidden">
            <img src={authorProfileImage} alt="Research Group Epabnamu" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white"><p className="text-lg md:text-xl font-serif italic opacity-90">"기술이 누구를 위해 존재해야 하는가?"</p></div>
            </div>
          </div>
          <div className="p-8 md:p-12 space-y-8 text-gray-700 leading-loose text-lg font-light">
            <p><strong className="text-primary font-bold">연구그룹 이팝나무</strong>는 기술의 진보가 인간의 삶과 어떻게 조화롭게 공존할 수 있는지를 탐구하는 작은 연구 공동체입니다. 이곳에서 여러 연구자와 함께 사회적경제와 기술의 접점을 꾸준히 고민해 왔습니다.</p>
            <p>여러 해 동안 대학에서 공정무역, 사회적 자본, 커먼즈, 지역순환경제, 커뮤니티 비즈니스를 가르치며 학생들과 함께 '삶의 지속가능성'과 '연대의 구조'를 질문해 왔습니다. 한편 현장에서는 인공지능, 센서, 영상 분석, 장비 개발, 실증 프로젝트에 직접 참여하며 기술과 사회가 만나는 지점을 탐구해 왔습니다.</p>
            <p>"사회과학의 질문과 기술 현장의 경험이 교차하는 이 길 위에서, '기술이 누구를 위해 존재해야 하는가'라는 물음을 쉽게 지나칠 수 없었습니다."</p>
            <p>오늘날 AI는 우리에게 경이로움과 불안을 동시에 안겨 줍니다. 편리함을 선사하면서도, 우리의 노동과 시간, 삶의 기반이 흔들릴 수 있다는 질문을 끊임없이 던집니다.</p>
            <p className="font-serif font-bold text-primary text-xl pl-4 border-l-4 border-secondary">"이 거대한 변화의 과실은 누구의 몫이어야 하는가?"</p>
            <p>이 질문 앞에서 기술 자체보다 '기술이 만든 부를 어떻게 나누는가'가 더 본질적인 문제라고 생각하게 되었습니다.</p>
            <p>여름날 이팝나무가 시원한 그늘을 나누듯, 기술의 혜택도 우리 모두에게 공정하게 돌아가는 세상을 꿈꾸며 글을 쓰고 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;