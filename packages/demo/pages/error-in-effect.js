import { useEffect } from 'react';

export default function ErrorPage() {
  if (!process.browser) {
    return <div>SSR is ok, client will throw inside useEffect...</div>;
  }

  useEffect(() => {
    throw new Error('test');
  }, []);

  return <div />;
}
