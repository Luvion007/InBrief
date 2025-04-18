'use client'
import React from 'react'
import { Dispatch, SetStateAction } from 'react';
import { BookOpen, Clock } from "lucide-react";
import Link from 'next/link';

interface SidebarComponentProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function SidebarComponent({ activeTab, setActiveTab }: SidebarComponentProps) {
  return (
    <>
      {/* Sidebar - Fixed position */}
      <div className="w-24 bg-blue-950 text-white flex-shrink-0 h-screen fixed top-0 left-0">        
        <div className="flex flex-col items-center pt-6 pb-8">
          <Link href="/home" className="text-center">
            <h1 className="text-xl font-bold">
              In<span className="text-blue-400">Brief</span>
            </h1>
          </Link>
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center space-y-8">
          <Link href="/news" className="flex flex-col items-center">
            <button
              className={`p-2 rounded-md ${activeTab === "news" ? "bg-blue-800" : ""}`}
              onClick={() => setActiveTab("news")}
            >
              <BookOpen className="h-6 w-6" />
            </button>
            <p className="text-center mt-1 text-sm">News</p>
          </Link>

          <Link href="/bookmarks" className="flex flex-col items-center">
            <button
              className={`p-2 rounded-md ${activeTab === "bookmarks" ? "bg-blue-800" : ""}`}
              onClick={() => setActiveTab("bookmarks")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </button>
            <p className="text-center mt-1 text-sm">Bookmarks</p>
          </Link>

          <Link href="/category" className="flex flex-col items-center">
            <button
              className={`p-2 rounded-md ${activeTab === "categories" ? "bg-blue-800" : ""}`}
              onClick={() => setActiveTab("categories")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </button>
            <p className="text-center mt-1 text-sm">Categories</p>
          </Link>

          <Link href="/payment" className="flex flex-col items-center">
            <button
              className={`p-2 rounded-md ${activeTab === "payment" ? "bg-blue-800" : ""}`}
              onClick={() => setActiveTab("payment")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </button>
            <p className="text-center mt-1 text-sm">Payment</p>
          </Link>
        </nav>
      </div>
    </>
  );
}