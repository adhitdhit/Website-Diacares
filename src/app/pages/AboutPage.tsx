import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';
import { 
  Heart, Shield, Award, Users, TrendingUp, Target,
  CheckCircle, Globe, Smartphone, Activity, Clock as ClockIcon,
  Mail, Phone, MapPin, ArrowUp, Menu, Zap, ArrowLeft,
  Hospital, BookOpen
} from 'lucide-react';
// @ts-ignore
import logoImage from "@/assets/logoss.png";

export function AboutPage() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const features = [
    {
      icon: Activity,
      title: 'Prediksi Akurat',
      desc: 'Algoritma Machine Learning berbasis faktor risiko klinis yang telah teruji secara medis',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Data Aman',
      desc: 'Enkripsi end-to-end untuk melindungi privasi dan kerahasiaan data medis Anda',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: ClockIcon,
      title: 'Hasil Instan',
      desc: 'Dapatkan hasil prediksi dan rekomendasi medis dalam hitungan detik',
      color: 'from-red-600 to-red-500'
    },
    {
      icon: Smartphone,
      title: 'Akses Mudah',
      desc: 'Platform responsif yang dapat diakses dari perangkat apa saja, kapan saja',
      color: 'from-orange-600 to-red-600'
    }
  ];

  const stats = [
    { icon: Users, value: '1K+', label: 'Pengguna Aktif' },
    { icon: Activity, value: '1K+', label: 'Asesmen Dilakukan' },
    { icon: Award, value: '90%', label: 'Tingkat Akurasi' },
    { icon: Globe, value: '100%', label: 'Gratis & Aman' }
  ];

  const steps = [
    {
      num: '01',
      title: 'Input Data Pasien',
      desc: 'Masukkan parameter klinis seperti glukosa, tekanan darah, BMI, dan faktor risiko lainnya',
      icon: Target
    },
    {
      num: '02',
      title: 'Analisis Otomatis',
      desc: 'Sistem kami menganalisis data menggunakan model sistem yang telah terlatih',
      icon: TrendingUp
    },
    {
      num: '03',
      title: 'Hasil & Rekomendasi',
      desc: 'Dapatkan skor risiko, kategori, dan rekomendasi medis yang dipersonalisasi',
      icon: CheckCircle
    }
  ];

  const whyChooseUs = [
    {
      icon: Activity,
      title: 'Teknologi Canggih',
      desc: 'Proses olah data dengan akurasi terbaik untuk prediksi risiko diabetes',
      stat: '90%',
      statLabel: 'Akurasi',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Shield,
      title: 'Privasi & Keamanan',
      desc: 'Data Anda terlindungi dengan enkripsi standar baik',
      stat: '100%',
      statLabel: 'Aman',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Zap,
      title: 'Proses Super Cepat',
      desc: 'Dapatkan hasil analisis dalam waktu cepat',
      stat: '<5s',
      statLabel: 'Cepat',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Banyak Pengguna',
      desc: 'Telah membantu berbagai pengguna di Indonesia',
      stat: '1K+',
      statLabel: 'Pengguna',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Award,
      title: 'Standar Internasional',
      desc: 'Mengikuti pedoman WHO dan Kementerian Kesehatan RI',
      stat: 'WHO',
      statLabel: 'Standar',
      color: 'from-red-500 to-rose-600'
    },
    {
      icon: Globe,
      title: 'Free Akses',
      desc: 'Akses penuh tanpa biaya, tanpa iklan',
      stat: 'FREE',
      statLabel: 'Gratis',
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      
      {/* SIDEBAR */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-white border-r-2 border-red-100 shadow-lg z-50 transition-transform duration-300 ease-in-out flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b-2 border-red-100 bg-red-50">
          <h3 className="text-lg font-bold text-gray-900">Menu</h3>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="font-medium text-sm">Beranda</span>
          </Link>
          <Link to="/assessment" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="font-medium text-sm">Asesmen Baru</span>
          </Link>
          <Link to="/history" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-medium text-sm">Riwayat</span>
          </Link>
          <Link to="/hospitals" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 transition-colors">
            <Hospital className="w-5 h-5" />
            <span className="font-medium text-sm">Rumah Sakit</span>
          </Link>
          <Link to="/education" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 transition-colors">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium text-sm">Edukasi</span>
          </Link>
          <Link to="/about" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-medium text-sm">Tentang</span>
          </Link>
        </nav>

        {/* Bottom Section */}
        <div className="flex-shrink-0 space-y-3 p-4 bg-gray-50 border-t border-red-100">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm">
            <div className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                <span className="text-xs font-bold text-amber-800">Tips Hari Ini</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">💧 Minum 8 gelas air putih per hari</p>
            </div>
          </Card>

          <div className="flex items-start gap-2 text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
            <Phone className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium block">Butuh bantuan?</span>
              <span className="text-gray-500">info@diacares.id</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Tombol Hamburger */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border-2 border-red-100 hover:border-red-300 transition-all"
        >
          <Menu className="w-6 h-6 text-red-600" />
        </button>
      )}

      {/* WRAPPER DENGAN MARGIN DINAMIS */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        
      {/* Navigation Bar */}
<nav className="bg-white shadow-md sticky top-0 z-30">
  <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-3">
      
      {/* Logo & Title - Responsive */}
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

      {/* Buttons - Vertical di Mobile, Horizontal di Desktop */}
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

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#9F1239] via-[#BE123C] to-[#E11D48] text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Tentang DiaCARES</h1>
            <p className="text-xl text-rose-100 max-w-2xl mx-auto">
              Platform digital terpercaya untuk skrining dan deteksi dini risiko diabetes mellitus 
              dengan teknologi berbasis standar medis 
            </p>
          </div>
        </div>

        {/* Main Content */}


        {/* Container dengan justify-end agar tombol mentok ke kanan */}
        <div className="flex justify-end mb-8 mt-6">
        <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="border-red-300 text-red-600 hover:bg-red-50"
        >
        <ArrowLeft className="w-4 h-5 gap-5 mr-2" />
        Kembali
        </Button>
        </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="border-2 border-red-100 text-center">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-orange-50">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h2>
                <p className="text-gray-700 leading-relaxed">
                  Menjadi platform terdepan dalam deteksi dini dan pencegahan diabetes mellitus 
                  di Indonesia, serta meningkatkan kesadaran masyarakat akan pentingnya gaya hidup sehat.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 bg-gradient-to-br from-orange-50 to-amber-50">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h2>
                <p className="text-gray-700 leading-relaxed">
                  Memberikan akses mudah dan gratis terhadap skrining diabetes berkualitas, 
                  edukasi kesehatan yang komprehensif, serta rekomendasi medis yang dapat ditindaklanjuti.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CARA KERJA - VERTICAL TIMELINE */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12 mt-6">Cara Kerja Aplikasi</h2>
            <div className="max-w-4xl mx-auto space-y-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative">
                    {idx !== steps.length - 1 && (
                      <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-red-300 to-orange-300"></div>
                    )}
                    
                    <Card className="border-2 border-red-100 hover:shadow-2xl transition-all overflow-hidden group hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 bg-gradient-to-br from-red-600 to-orange-600 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 transform -skew-x-12"></div>
                            <div className="text-7xl font-bold opacity-20 absolute -top-4 -right-4">{step.num}</div>
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xl">
                              <Icon className="w-10 h-10" />
                            </div>
                            <div className="text-2xl font-bold">{step.num}</div>
                          </div>
                          
                          <div className="md:w-3/4 p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
               

          {/* MENGAPA MEMILIH DIACARES? */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-4 mt-6">Mengapa Memilih DiaCARES?</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Platform kami dirancang dengan teknologi terkini untuk memberikan pengalaman terbaik dalam deteksi dini diabetes
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseUs.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card key={idx} className="border-2 border-red-100 hover:shadow-2xl transition-all group hover:-translate-y-2 overflow-hidden">
                    <div className={`h-1.5 bg-gradient-to-r ${item.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${item.color} text-white shadow-md`}>
                          {item.stat}
                        </div>
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-red-600 transition-colors">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                      <div className="text-xs text-gray-500 font-medium">{item.statLabel}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 text-white py-12 px-4 mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    <img src={logoImage} alt="DiaCares Logo" className="w-full h-full object-contain scale-[2]" />
                  </div>
                  <h3 className="text-xl font-bold">DiaCARES</h3>
                </div>
                <p className="text-red-200 text-sm">
                  Platform digital terpercaya untuk skrining dan deteksi dini risiko diabetes mellitus.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-3">Tautan Cepat</h4>
                <div className="space-y-2 text-sm text-red-200">
                  <Link to="/assessment" className="block hover:text-white transition-colors">Asesmen Baru</Link>
                  <Link to="/history" className="block hover:text-white transition-colors">Riwayat Pemeriksaan</Link>
                  <Link to="/hospitals" className="block hover:text-white transition-colors">Rumah Sakit</Link>
                  <Link to="/about" className="block hover:text-white transition-colors">Tentang Kami</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3">Kontak Kami</h4>
                <div className="space-y-2 text-sm text-red-200">
                  <div>📧 info@diacares.id</div>
                  <div>📞 (022) 123-4567</div>
                  <div>📍 Bandung, Indonesia</div>
                </div>
              </div>
            </div>
            <div className="border-t border-red-700 pt-6 text-center">
              <p className="text-red-100 mb-2">
                © 2026 DiaCARES - Diabetes Care & Risk Evaluation System
              </p>
              <p className="text-red-300 text-sm">
                Untuk keperluan skrining dan edukasi
              </p>
            </div>
          </div>
        </div>

        {/* Tombol Back to Top */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-2xl z-50 transform hover:scale-110 transition-all duration-300 animate-bounce"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
        )}
      </div>
    
  );
}