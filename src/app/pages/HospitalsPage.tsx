import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';

import { 
  Hospital, MapPin, Phone, Globe, Clock, Navigation, 
  Search, Ambulance,
  Activity, Clock as ClockIcon, ArrowUp,
  ArrowLeft, Menu
} from 'lucide-react';

// @ts-ignore
import logoImage from "@/assets/logoss.png";

// IMPORT GAMBAR MANUAL DARI ASSETS
// @ts-ignore
import rsSiloam from "@/assets/siloam.jpg";
// @ts-ignore
import rsHermina from "@/assets/hermina.jfif";
// @ts-ignore
import rsAdvent from "@/assets/advent.jfif";
// @ts-ignore
import rsBorromeus from "@/assets/santo.jfif";
// @ts-ignore
import rsSadikin from "@/assets/hasan.jfif";
// @ts-ignore
import rsImmanuel from "@/assets/imanuel.jfif";

const hospitals = [
  {
    id: 1,
    name: 'RS Siloam Hospitals',
    address: 'Jl. Garnisun No. 52-53, Bandung',
    phone: '(022) 2033 8888',
    website: 'https://www.siloamhospitals.com',
    distance: '2.3 km',
    specialty: ['Pusat Diabetes', 'Endokrinologi', 'Penyakit Dalam'],
    image: rsSiloam,
    openHours: '24 Jam',
    emergency: true
  },
  {
    id: 2,
    name: 'RS Hermina Pasteur',
    address: 'Jl. Dr. Djunjunan No. 107, Bandung',
    phone: '(022) 203 1000',
    website: 'https://www.herminahospitals.com',
    distance: '3.1 km',
    specialty: ['Klinik Penyakit Dalam', 'Diabetes Center'],
    image: rsHermina,
    openHours: '24 Jam',
    emergency: true
  },
  {
    id: 3,
    name: 'RS Advent Bandung',
    address: 'Jl. Cihampelas No. 161, Bandung',
    phone: '(022) 204 6390',
    website: 'https://www.rsadventbandung.com',
    distance: '4.5 km',
    specialty: ['Pusat Diabetes Terpadu', 'Gizi Klinik'],
    image: rsAdvent,
    openHours: '24 Jam',
    emergency: true
  },
  {
    id: 4,
    name: 'RS Santo Borromeus',
    address: 'Jl. Ir. H. Juanda No. 100, Bandung',
    phone: '(022) 250 3100',
    website: 'https://www.rsborromeus.com',
    distance: '5.2 km',
    specialty: ['Poli Penyakit Dalam', 'Endokrin'],
    image: rsBorromeus,
    openHours: '24 Jam',
    emergency: true
  },
  {
    id: 5,
    name: 'RS Hasan Sadikin',
    address: 'Jl. Pasteur No. 38, Bandung',
    phone: '(022) 2034 953',
    website: 'https://web.rshs.go.id/',
    distance: '6.0 km',
    specialty: ['Divisi Endokrinologi', 'Pusat Rujuk Nasional'],
    image: rsSadikin,
    openHours: '24 Jam',
    emergency: true
  },
  {
    id: 6,
    name: 'RS Immanuel',
    address: 'Jl. Kopo No. 161, Bandung',
    phone: '(022) 520 1656',
    website: 'https://www.rsimmanuel.com',
    distance: '6.8 km',
    specialty: ['Klinik Diabetes', 'Pencegahan'],
    image: rsImmanuel,
    openHours: '24 Jam',
    emergency: false
  },
];

export function HospitalsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // STATE UNTUK SIDEBAR
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      {/* SIDEBAR DENGAN LAYOUT FLEKSIBEL (FIX POSISI BAWAH) */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-white border-r-2 border-red-100 shadow-lg z-50 transition-transform duration-300 ease-in-out flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* 1. Header */}
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
          <Link to="/hospitals" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
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

        {/* 3. Bottom Section */}
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

      {/* Tombol Hamburger */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border-2 border-red-100 hover:border-red-300 transition-all"
        >
          <Menu className="w-6 h-6 text-red-600" />
        </button>
      )}
      
      {/* WRAPPER*/}
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

        {/* Main Content */}
        <div className="p-6">
          {/* Header dengan Tombol Kembali */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {/* Judul di Kiri */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Hospital className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Rumah Sakit Terdekat</h1>
                  <p className="text-gray-600">Layanan diabetes dan endokrinologi di sekitar Anda</p>
                </div>
              </div>
              
              {/* Tombol Kembali di Kanan */}
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari rumah sakit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 shadow-sm"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Hospital className="w-8 h-8" />
                  <div>
                    <p className="text-2xl font-bold">{hospitals.length}</p>
                    <p className="text-sm opacity-90">Rumah Sakit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Ambulance className="w-8 h-8" />
                  <div>
                    <p className="text-2xl font-bold">{hospitals.filter(h => h.emergency).length}</p>
                    <p className="text-sm opacity-90">IGD 24 Jam</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hospital Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {filteredHospitals.map((hospital) => (
              <Card 
                key={hospital.id}
                className={`overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                  selectedHospital === hospital.id ? 'border-red-500 shadow-xl' : 'border-red-100'
                }`}
                onClick={() => setSelectedHospital(selectedHospital === hospital.id ? null : hospital.id)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img 
                      src={hospital.image} 
                      alt={hospital.name}
                      className="w-full h-full object-cover"
                    />
                    {hospital.emergency && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                        IGD 24J
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{hospital.name}</h3>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{hospital.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>{hospital.openHours}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>{hospital.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Navigation className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>{hospital.distance}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hospital.specialty.map((spec, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-200"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {selectedHospital === hospital.id && (
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(hospital.website, '_blank');
                          }}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${hospital.phone}`, '_self');
                          }}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Telepon
                        </Button>
                      </div>
                    )}

                    {selectedHospital !== hospital.id && (
                      <p className="text-xs text-gray-500 text-center italic">
                        Klik untuk melihat detail & kontak
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredHospitals.length === 0 && (
            <div className="text-center py-12">
              <Hospital className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada rumah sakit yang sesuai pencarian</p>
            </div>
          )}
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