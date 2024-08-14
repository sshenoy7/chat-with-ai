"use client"

import Sidebar from "./_components/sidebar";
import ChatInterface from "./_components/chat-interface";


export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex"><Sidebar/></div>
      <div className="flex-1 h-full">
        <ChatInterface/>
      </div>
    </div>
  );
}
