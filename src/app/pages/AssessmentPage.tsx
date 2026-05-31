import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, User, UserCircle, Activity, Clock as ClockIcon, BookOpen, Phone, ArrowUp } from 'lucide-react';

// Import Logo
// @ts-ignore
import logoImage from "@/assets/logoss.png";

export function AssessmentPage() {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [gender, setGender] = useState<'Laki-Laki' | 'Perempuan' | ''>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll for back-to-top button
  useState(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientName.trim() && gender) {
      sessionStorage.setItem('patientName', patientName);
      sessionStorage.setItem('patientGender', gender);
      navigate('/parameters');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col">
      
      {/* ============================================ */}
      {/* 📌 HEADER / NAVIGATION BAR */}
      {/* ============================================ */}
      <nav className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-3">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br rounded-xl flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
                <img src={logoImage} alt="DiaCares Logo" className="w-full h-full object-contain scale-[2]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent truncate">
                  DiaCARES
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                  Diabetes Care & Risk Evaluation
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link to="/history" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto py-2"
                >
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Riwayat
                </Button>
              </Link>
              <Link to="/assessment" className="w-full sm:w-auto">
                <Button 
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg w-full sm:w-auto py-2"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Asesmen Baru
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* 📌 MAIN CONTENT - FORM ASSESSMENT */}
      {/* ============================================ */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl">
          
          {/* Tombol kembali ke beranda */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 hover:bg-white/50 transition-all text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>

          {/* Card Form Assessment */}
          <Card className="w-full shadow-2xl border-2 border-red-200 overflow-hidden">
            
            {/* Header dengan Logo Transparan */}
            <CardHeader className="bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 border-b border-red-200 pt-8 pb-6 text-center">
              
              {/* LOGO */}
              <div className="flex justify-center -mb-5">
                <img
                  src={logoImage}
                  alt="DiaCares Logo"
                  className="w-90 h-auto mix-blend-multiply" 
                />
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <CardDescription className="text-base text-gray-600 font-medium">
                  Diabetes Care & Risk Evaluation System
                </CardDescription>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  Masukkan Informasi Pasien
                </p>
              </div>
            </CardHeader>

            <CardContent className="pt-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Patient Name Input */}
                <div className="space-y-3">
                  <Label htmlFor="patientName" className="text-base font-semibold flex items-center gap-2 text-gray-700">
                    <User className="w-5 h-5 text-red-600" />
                    Nama Pasien
                  </Label>
                  <Input
                    id="patientName"
                    type="text"
                    placeholder="Masukkan Nama Lengkap Pasien"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="h-14 text-base border-2 border-red-200 focus:border-red-500 rounded-xl transition-all"
                  />
                </div>

                {/* Gender Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2 text-gray-700">
                    <UserCircle className="w-5 h-5 text-red-600" />
                    Jenis Kelamin
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Male Button */}
                    <button
                      type="button"
                      onClick={() => setGender('Laki-Laki')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        gender === 'Laki-Laki'
                          ? 'border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-lg scale-[1.02]'
                          : 'border-red-200 bg-white hover:border-red-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                          gender === 'Laki-Laki'
                            ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-md'
                            : 'bg-gray-200'
                        }`}>
                          <svg className={`w-8 h-8 ${gender === 'Laki-Laki' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className={`font-semibold text-base ${gender === 'Laki-Laki' ? 'text-red-700' : 'text-gray-700'}`}>
                          Laki-laki
                        </span>
                      </div>
                    </button>

                    {/* Female Button */}
                    <button
                      type="button"
                      onClick={() => setGender('Perempuan')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        gender === 'Perempuan'
                          ? 'border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-lg scale-[1.02]'
                          : 'border-red-200 bg-white hover:border-red-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                          gender === 'Perempuan'
                            ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-md'
                            : 'bg-gray-200'
                        }`}>
                          <svg className={`w-8 h-8 ${gender === 'Perempuan' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className={`font-semibold text-base ${gender === 'Perempuan' ? 'text-red-700' : 'text-gray-700'}`}>
                          Perempuan
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!patientName.trim() || !gender}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-700 hover:via-red-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-xl text-white"
                >
                  Lanjutkan ke Parameter Klinis
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl text-center shadow-lg border-2 border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-1">1</div>
              <div className="text-sm font-medium text-gray-700">Data Pasien</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl text-center shadow-md border border-gray-200">
              <div className="text-3xl font-bold text-gray-400 mb-1">2</div>
              <div className="text-sm text-gray-500">Parameter</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl text-center shadow-md border border-gray-200">
              <div className="text-3xl font-bold text-gray-400 mb-1">3</div>
              <div className="text-sm text-gray-500">Hasil</div>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================ */}
      {/* 📌 FOOTER */}
      {/* ============================================ */}
      <footer className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 text-white py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={logoImage} alt="DiaCares Logo" className="w-full h-full object-contain scale-[2]" />
                </div>
                <h3 className="text-lg font-bold">DiaCARES</h3>
              </div>
              <p className="text-red-200 text-sm">
                Platform digital terpercaya untuk skrining dan deteksi dini risiko diabetes mellitus.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-2">Tautan Cepat</h4>
              <div className="space-y-1 text-sm text-red-200">
                <Link to="/" className="block hover:text-white transition-colors">Beranda</Link>
                <Link to="/assessment" className="block hover:text-white transition-colors">Asesmen Baru</Link>
                <Link to="/history" className="block hover:text-white transition-colors">Riwayat</Link>
                <Link to="/education" className="block hover:text-white transition-colors">Edukasi</Link>
              </div>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-bold mb-2">Kontak Kami</h4>
              <div className="space-y-1 text-sm text-red-200">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>info@diacares.id</span>
                </div>
                <div>📍 Bandung, Indonesia</div>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-red-700 pt-4 text-center">
            <p className="text-red-100 text-sm">
              © 2026 DiaCARES - Diabetes Care & Risk Evaluation System
            </p>
            <p className="text-red-300 text-xs mt-1">
              Untuk keperluan skrining dan edukasi
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-2xl z-50"
          aria-label="Kembali ke atas"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}