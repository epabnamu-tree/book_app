import React, { useEffect } from 'react';

interface CommentsProps {
  id: string;
  title: string;
}

const Comments: React.FC<CommentsProps> = ({ id, title }) => {
  useEffect(() => {
    const SHORTNAME = "epabnamu"; // 사용자님의 Disqus ID

    // @ts-ignore
    window.disqus_config = function () {
      this.page.url = window.location.href;
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
            this.page.url = window.location.href;
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