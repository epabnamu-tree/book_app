import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string[];
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image, url, type = 'website', keywords, schema }) => {
  const siteTitle = "이팝나무의 서재";
  const fullTitle = title === "홈" ? siteTitle : `${title} | ${siteTitle}`;
  const currentUrl = url || window.location.href;
  const defaultImage = "https://i.imgur.com/AEoNPVC.jpeg";
  const metaImage = image || defaultImage;

  useEffect(() => {
    // 1. Title 업데이트
    document.title = fullTitle;

    // 2. Meta Tag 업데이트 헬퍼 함수
    const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. 기본 메타 태그
    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords.join(', '));

    // 4. Open Graph (SNS 공유)
    updateMeta('og:type', type, 'property');
    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', metaImage, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:site_name', siteTitle, 'property');
    updateMeta('og:locale', 'ko_KR', 'property');

    // 5. Twitter Cards
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', fullTitle, 'name');
    updateMeta('twitter:description', description, 'name');
    updateMeta('twitter:image', metaImage, 'name');

    // 6. JSON-LD 구조화 데이터 (스크립트 태그 주입)
    let script: HTMLScriptElement | null = null;
    if (schema) {
      // 기존 스크립트가 있다면 제거 (중복 방지)
      const existingScript = document.getElementById('ld-json-schema');
      if (existingScript) existingScript.remove();

      script = document.createElement('script');
      script.id = 'ld-json-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    // Cleanup: 컴포넌트 언마운트 시 정리할 것이 있다면 여기에 추가
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [fullTitle, description, metaImage, currentUrl, type, keywords, schema]);

  // 화면에 렌더링할 UI는 없음
  return null;
};

export default SEO;