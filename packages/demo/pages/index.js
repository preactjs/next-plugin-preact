import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Lazy = dynamic(() => import('../lazy'));

export default function IndexPage() {
  return (
    <div>
      Hello world!
      <Head>
        <link rel="stylesheet" href="http://example.org" />
      </Head>
      <Lazy />
    </div>
  );
}
