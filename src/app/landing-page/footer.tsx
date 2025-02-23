import React from 'react';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-xl font-semibold">Face Recognition Attendance System</h3>
        <p className="mt-2 text-gray-400">Effortless, secure, and automated attendance tracking.</p>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="hover:text-blue-500"><Facebook /></a>
          <a href="#" className="hover:text-blue-400"><Twitter /></a>
          <a href="#" className="hover:text-blue-600"><Linkedin /></a>
          <a href="#" className="hover:text-red-500"><Mail /></a>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Student Power Club.
        </p>
      </div>
    </footer>
  );
}
