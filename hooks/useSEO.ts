import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

export const useSEO = ({ title, description }: SEOProps) => {
  useEffect(() => {
    // Update Title
    const defaultTitle = "이팝나무의 서재";
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || "연구그룹 이팝나무의 공식 홈페이지입니다. AI, 기본소득, 사회적 경제에 대한 통찰을 나누고 소통합니다.");
    } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = description || "연구그룹 이팝나무의 공식 홈페이지입니다. AI, 기본소득, 사회적 경제에 대한 통찰을 나누고 소통합니다.";
        document.head.appendChild(meta);
    }
  }, [title, description]);
};