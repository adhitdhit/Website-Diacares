import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Activity, Heart, Hospital, ClipboardList, TrendingUp, AlertCircle, 
  Stethoscope, Shield, ChevronRight, Sparkles, Clock, Calendar, 
  MapPin, Phone, Users, Award, CheckCircle2, ArrowRight, ArrowUp,
  FileText, BarChart3, Smartphone, Loader2, Menu
} from 'lucide-react';

// @ts-ignore
import logoImage from "@/assets/logoss.png";

// Interface untuk data history
interface HistoryData {
  _id: string;
  patientName: string;
  patientGender: string;
  status: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State untuk riwayat pemeriksaan
  const [recentHistory, setRecentHistory] = useState<HistoryData[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Fetch data history dari backend
  useEffect(() => {
    const fetchRecentHistory = async () => {
      try {
        setHistoryLoading(true);
        const response = await fetch(`${API_URL}/history`);
        const result = await response.json();
        
        if (result.success) {
          const latest = result.data.slice(0, 4);
          setRecentHistory(latest);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchRecentHistory();
  }, []);

  // Format tanggal
  // Format tanggal - Simple & Clean
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString); // ✅ Langsung parse, gak perlu manipulasi string
    
    return date.toLocaleString('id-ID', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // ✅ Auto detect timezone user
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Format date error:', error);
    return '-';
  }
};

  // Fungsi scroll
  const scrollToDiabetesInfo = () => {
    const element = document.getElementById('diabetes-info');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Efek scroll untuk tombol back to top
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

  // Data rumah sakit (4 saja untuk preview)
  const hospitals = [
    { name: 'RS Siloam Hospitals', distance: '2.3 km', address: 'Jl. Garnisun No. 52-53', telp: '(022) 2033 8888', specialty: 'Pusat Diabetes & Endokrinologi' },
    { name: 'RS Hermina Pasteur', distance: '3.1 km', address: 'Jl. Dr. Djunjunan No. 107', telp: '(022) 203 1000', specialty: 'Klinik Penyakit Dalam' },
    { name: 'RS Advent Bandung', distance: '4.5 km', address: 'Jl. Cihampelas No. 161', telp: '(022) 204 6390', specialty: 'Pusat Diabetes Terpadu' },
    { name: 'RS Santo Borromeus', distance: '5.2 km', address: 'Jl. Ir. H. Juanda No. 100', telp: '(022) 250 3100', specialty: 'Poli Penyakit Dalam' },
  ];

  const features = [
    {
      icon: Activity,
      title: 'Asesmen Cepat',
      description: 'Proses asesmen risiko diabetes dalam 3 langkah mudah',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Stethoscope,
      title: 'Analisis Akurat',
      description: 'Algoritma berdasarkan standar medis internasional',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Shield,
      title: 'Data Aman',
      description: 'Privasi dan keamanan data pasien terjamin',
      color: 'from-red-600 to-red-500'
    },
    {
      icon: ClipboardList,
      title: 'Laporan Lengkap',
      description: 'Export hasil ke PDF untuk dokumentasi',
      color: 'from-orange-600 to-red-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      
      {/* SIDEBAR DENGAN LAYOUT FLEKSIBEL (FIX POSISI BAWAH) */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-white border-r-2 border-red-100 shadow-lg z-50 transition-transform duration-300 ease-in-out flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* 1. Header (Tetap di atas) */}
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

        {/* 2. Navigation (Mengisi ruang tengah) */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <span className="font-medium text-sm">Edukasi</span>
          </Link>
          <Link to="/about" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-medium text-sm">Tentang</span>
          </Link>
        </nav>

        {/* 3. Bottom Section (Tips & Kontak - Dipaksa ke bawah) */}
        <div className="flex-shrink-0 space-y-3 p-4 bg-gray-50 border-t border-red-100">
          
          {/* Tips Hari Ini */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm">
            <div className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                <span className="text-xs font-bold text-amber-800">Tips Hari Ini</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">💧 Minum 8 gelas air putih per hari</p>
            </div>
          </Card>

          {/* Butuh Bantuan */}
          <div className="flex items-start gap-2 text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
            <Phone className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium block">Butuh bantuan?</span>
              <span className="text-gray-500">info@diacares.id</span>
            </div>
          </div>
          
        </div>
      </aside>

      {/* Tombol Hamburger (muncul saat sidebar tertutup) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border-2 border-red-100 hover:border-red-300 transition-all"
        >
          <Menu className="w-6 h-6 text-red-600" />
        </button>
      )}

      {/* WRAPPER KONTEN DENGAN MARGIN DINAMIS */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        
       {/* Navigation Bar */}
<nav className="bg-white shadow-md sticky top-0 z-30">
  <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-3">
      
      {/* Logo & Title - Responsive */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        {/* Logo - Ukuran Responsive */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br rounded-xl flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
          <img src={logoImage} alt="DiaCares Logo" className="w-full h-full object-contain scale-[2]" />
        </div>
        
        {/* Title - Responsive */}
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
            <Clock className="w-4 h-4 mr-2" />
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
        <div className="bg-gradient-to-br from-[#9F1239] via-[#BE123C] to-[#E11D48] text-white py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Platform Skrining Diabetes Terpercaya</span>
                </div>
                
                <h1 className="text-5xl font-bold mb-4 leading-tight drop-shadow-md">
                  Deteksi Dini Risiko<br />
                  <span className="text-amber-300">Diabetes Mellitus</span>
                </h1>
                
                <p className="text-lg text-rose-100 mb-8 max-w-2xl">
                  Platform digital terpercaya untuk skrining dan deteksi dini risiko diabetes mellitus 
                  dengan teknologi berbasis standar medis internasional.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    onClick={scrollToDiabetesInfo}
                    className="bg-white text-[#9F1239] hover:bg-gray-50 shadow-2xl text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    Selengkapnya
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="flex-1 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop" 
                    alt="Medical Checkup" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative p-6 rounded-2xl border-2 border-red-100 bg-white transform transition-all duration-300 cursor-pointer ${
                    hoveredCard === index ? 'scale-105 shadow-2xl border-red-300' : 'shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 transform transition-transform duration-300 ${
                    hoveredCard === index ? 'scale-110 rotate-6' : ''
                  }`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* RIWAYAT PEMERIKSAAN */}
          <Card className="border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border-b border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">Riwayat Pemeriksaan</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Asesmen yang telah dilakukan</p>
                  </div>
                </div>
                <Link to="/history">
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                    Lihat Semua
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Loading State */}
              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Memuat riwayat...</span>
                </div>
              ) : recentHistory.length === 0 ? (
                /* Empty State */
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada riwayat pemeriksaan</p>
                  <Link to="/assessment">
                    <Button variant="link" className="text-red-600 mt-2">
                      Mulai asesmen pertama →
                    </Button>
                  </Link>
                </div>
              ) : (
                /* List History - Privacy Focused (tanpa risk score) */
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentHistory.map((item) => (
                    <div 
                      key={item._id} 
                      className="bg-gradient-to-br from-white to-red-50 p-5 rounded-xl border-2 border-red-100 hover:border-red-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status === 'completed' ? '✅ Selesai' : 
                           item.status === 'processing' ? '⏳ Diproses' : '⏳ Pending'}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-gray-900 mb-1 truncate">
                        {item.patientName}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.createdAt)}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={`w-2 h-2 rounded-full ${
                          item.patientGender === 'perempuan' ? 'bg-pink-400' : 'bg-blue-400'
                        }`}></span>
                        {item.patientGender}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* About Diabetes Section */}
          <Card id="diabetes-info" className="border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden scroll-mt-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100 to-transparent rounded-full blur-3xl opacity-50"></div>
            <CardHeader className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border-b border-red-100 relative">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
            <h1 className="text-3xl font-bold text-gray-900">Apa itu Diabetes Mellitus?</h1>
            <p className="text-gray-600">Pelajari lebih lanjut tentang penyakit ini</p>
            </div>
            </div>
  
         {/* Tombol */}
        <Link to="/education">
        <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
        Selengkapnya
        <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
            </CardHeader>
            
            <CardContent className="pt-8 relative">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 text-gray-700">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-red-600">Diabetes Mellitus</strong> adalah penyakit metabolik kronis yang ditandai dengan tingginya kadar gula (glukosa) dalam darah. Kondisi ini terjadi ketika tubuh tidak dapat memproduksi insulin yang cukup atau tidak dapat menggunakan insulin secara efektif.
                  </p>

                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-red-900 mb-3 text-lg">Faktor Risiko Utama:</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span className="text-red-800 text-sm">Glukosa darah tinggi</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span className="text-red-800 text-sm">BMI &gt; 25 kg/m²</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span className="text-red-800 text-sm">Tekanan darah tinggi</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span className="text-red-800 text-sm">Riwayat keluarga</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-white border-2 border-red-100 rounded-xl hover:border-red-300 transition-all duration-300 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">588 Juta</div>
                      <div className="text-xs text-gray-600">Penderita di dunia</div>
                    </div>
                    <div className="p-4 bg-white border-2 border-orange-100 rounded-xl hover:border-orange-300 transition-all duration-300 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">20,4 Juta</div>
                      <div className="text-xs text-gray-600">Di Indonesia</div>
                    </div>
                    <div className="p-4 bg-white border-2 border-red-100 rounded-xl hover:border-red-300 transition-all duration-300 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">50%</div>
                      <div className="text-xs text-gray-600">Tidak menyadari</div>
                    </div>
                  </div>
                </div>
                
                {/* Gambar Diabetes */}
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=400&fit=crop" 
                      alt="Diabetes Awareness" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-bold text-lg">Deteksi Dini</p>
                      <p className="text-sm text-red-100">Kunci pencegahan diabetes</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border-2 border-red-200">
                      <Smartphone className="w-8 h-8 text-red-600 mb-2" />
                      <p className="font-bold text-red-900 text-sm">Cek Gula Darah</p>
                      <p className="text-xs text-gray-600 mt-1">Rutin monitoring</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border-2 border-orange-200">
                      <Activity className="w-8 h-8 text-orange-600 mb-2" />
                      <p className="font-bold text-orange-900 text-sm">Pola Hidup Sehat</p>
                      <p className="text-xs text-gray-600 mt-1">Olahraga & diet</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About DiaCares App Section - DENGAN TOMBOL KE HALAMAN ABOUT */}
          <Card className="border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-100 to-transparent rounded-full blur-3xl opacity-40"></div>
            <CardHeader className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 border-b border-orange-100 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-3xl">Tentang Aplikasi DiaCARES</CardTitle>
                </div>
                {/* TOMBOL LIHAT SELENGKAPNYA */}
                <Link to="/about">
                  <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                    Selengkapnya
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-8 relative">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Gambar Aplikasi */}
                <div className="order-2 lg:order-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-orange-200 rounded-3xl transform rotate-3"></div>
                    <div className="relative bg-white rounded-3xl p-6 shadow-2xl border-4 border-red-100">
                      <img 
                        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=600&fit=crop" 
                        alt="DiaCares App Interface" 
                        className="w-full h-auto rounded-xl"
                      />
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <Activity className="w-6 h-6 text-red-600 mx-auto mb-1" />
                          <p className="text-xs font-semibold text-red-900">Cepat</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg text-center">
                          <Shield className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                          <p className="text-xs font-semibold text-orange-900">Aman</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <Award className="w-6 h-6 text-red-600 mx-auto mb-1" />
                          <p className="text-xs font-semibold text-red-900">Akurat</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-gray-700 order-1 lg:order-2">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-orange-600">DiaCARES</strong> adalah platform digital prediksi risiko diabetes mellitus yang menggunakan algoritma berbasis faktor risiko klinis yang telah mapan secara medis.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-100 hover:border-red-300 transition-all">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-red-900">Input Data Pasien</h4>
                        <p className="text-sm text-gray-600">Masukkan parameter klinis dengan mudah</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-all">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-orange-900">Analisis Otomatis</h4>
                        <p className="text-sm text-gray-600">Sistem menghitung skor risiko</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-100 hover:border-red-300 transition-all">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-700 to-orange-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-red-900">Hasil & Rekomendasi</h4>
                        <p className="text-sm text-gray-600">Rekomendasi medis personal</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-5 rounded-lg">
                    <p className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Fitur Unggulan:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-orange-800">
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                        <span>Prediksi 4 kategori risiko</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-800">
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                        <span>Export PDF</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-800">
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                        <span>Rekomendasi personal</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-800">
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                        <span>Data terenkripsi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Hospitals Section - DENGAN TOMBOL KE HALAMAN HOSPITALS */}
          <Card 
          id="hospitals-section" 
          className="border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 scroll-mt-20">
            <CardHeader className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border-b border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Hospital className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">Rumah Sakit Terdekat</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Layanan diabetes dan endokrinologi</p>
                  </div>
                </div>
                {/*  TOMBOL LIHAT SELENGKAPNYA */}
                <Link to="/hospitals">
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                    Selengkapnya
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {hospitals.map((hospital, index) => (
                  <div
                    key={index}
                    className="group relative p-5 bg-gradient-to-br from-white to-red-50 rounded-2xl border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Hospital className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">{hospital.name}</h3>
                        <p className="text-sm text-red-600 font-medium mb-2">{hospital.specialty}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4 text-red-500" />
                          {hospital.address}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-red-100 rounded-md">
                              <span className="text-xs font-semibold text-red-700">📍 {hospital.distance}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {hospital.telp}
                          </div>
                        </div>
                      </div>
                    </div>
                    {}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Action Section */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-red-600 via-red-500 to-orange-600 overflow-hidden relative text-white">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <CardContent className="pt-12 pb-12 relative z-10">
              <div className="text-center space-y-6">
                <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                  <ClipboardList className="w-16 h-16" />
                </div>
                <h2 className="text-4xl font-bold">Siap Melakukan Asesmen?</h2>
                <p className="text-red-100 max-w-2xl mx-auto text-lg">
                  Mulai proses asesmen pasien sekarang untuk mendapatkan prediksi risiko diabetes 
                  dan rekomendasi medis yang tepat.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Link to="/assessment">
                    <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 shadow-2xl text-xl px-10 py-7 transform hover:scale-105 transition-all duration-300">
                      <Activity className="w-6 h-6 mr-3" />
                      Mulai Asesmen Sekarang
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-8 text-sm text-red-100 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                    <span>Gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                    <span>Hasil Instan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                    <span>Data Aman</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                Untuk keperluan skrining dan edukasi. Bukan pengganti konsultasi medis profesional.
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
    </div>
  );
}