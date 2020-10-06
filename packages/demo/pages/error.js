export default function ErrorPage() {
  if (!process.browser) {
    return <div>SSR is ok, client will throw...</div>;
  }

  throw new Error('test');
}
