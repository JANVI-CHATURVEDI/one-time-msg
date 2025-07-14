import React from 'react';
import SecretForm from '../components/SecretForm';

function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://plus.unsplash.com/premium_photo-1713009135123-66cd53ccb9f5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
     
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
        <SecretForm />
      </div>
    </div>
  );
}

export default Home;
