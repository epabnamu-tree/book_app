import React, { useEffect } from 'react';

interface CommentsProps {
  id: string;
  title: string;
}

const Comments: React.FC<CommentsProps> = ({ id, title }) => {
  useEffect(() => {
    const SHORTNAME = "epabnamu"; // 사용자님의 Disqus ID

    // 고유 URL 생성 (현재 주소 + # + ID)
    // 이렇게 해야 Disqus가 서로 다른 페이지로 인식합니다.
    const uniqueUrl = `${window.location.origin}${window.location.pathname}#!${id}`;

    // @ts-ignore
    window.disqus_config = function () {
      this.page.url = uniqueUrl;  // 고유 URL 적용
      this.page.identifier = id;
      this.page.title = title;
    };

    const d = document;
    const scriptId = 'disqus_embed_script';
    
    if (d.getElementById(scriptId)) {
      // @ts-ignore
      if (window.DISQUS) {
        // @ts-ignore
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = id;
            this.page.title = title;
            this.page.url = uniqueUrl; // 리셋 시에도 고유 URL 적용
          }
        });
      }
      return;
    }

    const s = d.createElement('script');
    s.id = scriptId;
    s.src = `https://${SHORTNAME}.disqus.com/embed.js`;
    s.setAttribute('data-timestamp', String(+new Date()));
    (d.head || d.body).appendChild(s);

  }, [id, title]);

  return (
    <div className="mt-8 py-8 border-t border-gray-100">
      <div id="disqus_thread"></div>
    </div>
  );
};

export default Comments;