'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

const DisplayAd = () => {
  useEffect(() => {
    try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="my-4">
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
