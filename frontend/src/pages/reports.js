import Head from 'next/head';
import { ArrowLeft } from 'lucide-react';

export default function Reports() {
  return (
    <>
      <Head><title>Reports - GM Electric Store</title></Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <a href="/" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </a>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
                <p className="text-sm text-slate-500">Sales, inventory, and financial insights</p>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-500">Reports module coming soon...</p>
          </div>
        </main>
      </div>
    </>
  );
}
