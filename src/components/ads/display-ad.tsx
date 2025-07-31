'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

const DisplayAd = () => {
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
            style={{ display: 'block' }}
            data-ad-client="ca-pub-1141286894515635"
            data-ad-slot="9374382354"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    </div>
  );
};

export default DisplayAd;
