import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  User, 
  Activity, 
  Loader2,
  AlertCircle,
  FileText,
  Home,
  Shield,
  Clock as ClockIcon,
  ArrowUp,
  Menu,
  Phone,
  Hospital,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// @ts-ignore
import logoImage from "@/assets/logoss.png";

interface HistoryData {
  _id: string;
  patientName: string;
  patientGender: string;
  status: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/history`);
        const result = await response.json();
        
        if (result.success) {
          setHistory(result.data);
        } else {
          setError('Gagal memuat data riwayat');
        }
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Tidak dapat terhubung ke server');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Format Date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      let cleanDate = dateString.replace(' ', 'T');
      if (cleanDate.includes('+00:00')) {
        cleanDate = cleanDate.replace('+00:00', 'Z');
      }
      const utcDate = new Date(cleanDate);
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const formatted = utcDate.toLocaleString('id-ID', {
        timeZone: userTimezone,
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      return formatted;
    } catch (error) {
      console.error('Format date error:', error);
      return '-';
    }
  };

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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">Memuat riwayat asesmen...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-red-300 shadow-lg">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <p className="text-red-600 font-semibold mb-2">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <Link to="/history" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
            <ClockIcon className="w-5 h-5" />
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
          <Link to="/about" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 transition-colors">
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
        {/* Main Content */}
        <div className="p-6">
          {/* Header dengan Tombol Kembali */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Riwayat Asesmen</h1>
                <p className="text-gray-600 mt-1">
                  Daftar pasien yang telah melakukan pemeriksaan
                </p>
              </div>
              <div className="flex gap-2">
                       <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {history.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="pt-12 pb-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Belum Ada Riwayat
                </h3>
                <p className="text-gray-500 mb-4">
                  Data asesmen akan muncul di sini setelah ada pasien yang melakukan pemeriksaan
                </p>
                <Button onClick={() => navigate('/assessment')}>
                  Mulai Asesmen Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* List History */
            <div className="space-y-3">
              {history.map((item) => (
                <Card 
                  key={item._id} 
                  className="border-2 border-gray-200 hover:border-red-300 transition-all shadow-sm hover:shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      
                      {/* Left: Patient Info */}
                      <div className="flex items-center gap-4 flex-1">
                        {/* Icon Gender */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.patientGender === 'perempuan' 
                            ? 'bg-pink-100' 
                            : 'bg-blue-100'
                        }`}>
                          <User className={`w-6 h-6 ${
                            item.patientGender === 'perempuan' 
                              ? 'text-pink-600' 
                              : 'text-blue-600'
                          }`} />
                        </div>

                        {/* Patient Name & Date */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg truncate">
                            {item.patientName}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                            <span>•</span>
                            <span>{item.patientGender}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Badge Only */}
                      <div className="ml-4">
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          item.status === 'completed'
                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                            : item.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                        }`}>
                          {item.status === 'completed' ? '✅ Selesai' : 
                           item.status === 'processing' ? '⏳ Diproses' : 
                           '⏳ Pending'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-8">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  🔒 Kerahasiaan Data Pasien Terjaga
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Halaman ini hanya menampilkan informasi dasar (nama, tanggal, dan jenis kelamin). 
                  Hasil pemeriksaan medis yang bersifat rahasia tidak ditampilkan di sini untuk 
                  melindungi privasi pasien.
                </p>
              </div>
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