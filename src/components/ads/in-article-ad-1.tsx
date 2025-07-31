'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

const InArticleAd1 = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
        return;
    }

    if (adRef.current && adRef.current.children.length === 0) {
      try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          initialized.current = true;
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return (
    <div ref={adRef} className="my-4">
        <ins className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-1141286894515635"
            data-ad-slot="3599527099"></ins>
    </div>
  );
};

export default InArticleAd1;
