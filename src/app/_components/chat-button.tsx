import Link from 'next/link';
import React from 'react';

export default function ChatButton() {

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      <Link className="text-lg" href="/chat">
        <span>Start Chatting</span>
      </Link>
    </button>
  );
}