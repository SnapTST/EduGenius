
'use client';

import Script from 'next/script';

const AdScript = () => {
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1141286894515635"
      crossOrigin="anonymous"
      onError={(e) => {
        console.error('Ad Script failed to load', e)
      }}
    />
  );
};

export default AdScript;
