'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import Header without SSR
const Header = dynamic(() => import('../../components/Header/Header'), {
  ssr: false,
});

const Home = () => {
  return (
    <>
      <Header />
    </>
  );
};

export default Home;
