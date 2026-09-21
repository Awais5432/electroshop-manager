import Head from 'next/head';
import { ArrowLeft, Store, Printer, User, Database, Languages, Type } from 'lucide-react';

export default function Settings() {
  return (
    <>
      <Head><title>Settings - GM Electric Store</title></Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <a href="/" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </a>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                <p className="text-sm text-slate-500">Configure your store preferences</p>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Shop Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Store className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-slate-800">Shop Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Shop Name</label>
                  <input type="text" defaultValue="GM Electric Store" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input type="text" placeholder="Shop address" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input type="tel" placeholder="Contact number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* Printer Setup */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Printer className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-slate-800">Printer Setup</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Default Printer</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Select a printer...</option>
                    <option>Microsoft Print to PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Receipt Type</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Thermal 80mm</option>
                    <option>Thermal 58mm</option>
                    <option>A4 Paper</option>
                  </select>
                </div>
                <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700">
                  Test Print
                </button>
              </div>
            </div>

            {/* Backup */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-slate-800">Backup & Restore</h2>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">
                  Backup Now
                </button>
                <button className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200">
                  Restore from Backup
                </button>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Type className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-slate-800">Appearance</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>English</option>
                    <option>Urdu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Font Size</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Normal</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
