'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// const Header = dynamic(() => import('../../components/Header/Header'));
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
