import Script from "next/script";

export default function Page() {
  return (
    <>
      <Script
        src="https://static.cdn.prismic.io/prismic.js?new=true&repo=swipestats"
        strategy="lazyOnload"
      />
      <main>
        <h1>Welcome to my Next.js 14 page</h1>
        <p>This page has the Prismic script injected.</p>
      </main>
    </>
  );
}
