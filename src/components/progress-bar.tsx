
'use client';

import NextNProgress from 'nextjs-progressbar';

const ProgressBar = () => {
  return <NextNProgress color="hsl(var(--primary))" height={3} options={{ showSpinner: false }} />;
};

export default ProgressBar;
