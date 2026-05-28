import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Heart, Activity, Apple, Dumbbell, Eye, Brain, 
  ChevronDown, ChevronUp, BookOpen, AlertCircle,
  CheckCircle, TrendingUp, Droplets, Moon, ArrowUp, Droplet, Scale,Shield,Calendar,Users,
  Clock as ClockIcon, Menu, Phone, ArrowLeft, Hospital
} from 'lucide-react';
// @ts-ignore
import logoImage from "@/assets/logoss.png";
    // @ts-ignore
import pregnancyImage from "@/assets/hamil.jpg";
 // @ts-ignore
import familyImage from "@/assets/family.jpg";
 // @ts-ignore
import skinImage from "@/assets/skin.jfif";
 // @ts-ignore
import glukosaImage from "@/assets/gula.jfif";
 // @ts-ignore
import diabetesImage from "@/assets/diabetes.jpg";

const educationData = {
  pengertian: {
    title: 'Apa itu Diabetes Mellitus?',
    content: 'Diabetes Mellitus adalah penyakit metabolik kronis yang ditandai dengan tingginya kadar gula (glukosa) dalam darah. Kondisi ini terjadi ketika tubuh tidak dapat memproduksi insulin yang cukup atau tidak dapat menggunakan insulin secara efektif.',
    image: diabetesImage,
    stats: [
      { label: 'Penderita di Dunia Menurut IDF', value: '588 Juta' },
      { label: 'Di Indonesia', value: '20,4 Juta' },
      { label: 'Tidak Menyadari', value: '50%' },
    ]
  },
  jenis: [
    {
      type: 'Diabetes Tipe 1',
      icon: AlertCircle,
      description: 'Tubuh tidak memproduksi insulin sama sekali. Biasanya terjadi pada anak-anak dan remaja.',
      symptoms: ['Sering buang air kecil', 'Sangat haus', 'Lapar berlebihan', 'Penurunan berat badan drastis'],
      color: 'from-red-500 to-red-600'
    },
    {
      type: 'Diabetes Tipe 2',
      icon: TrendingUp,
      description: 'Tubuh tidak menggunakan insulin dengan baik (resistensi insulin). Paling umum terjadi pada dewasa.',
      symptoms: ['Mudah lelah', 'Penglihatan kabur', 'Luka sulit sembuh', 'Kesemutan pada kaki'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      type: 'Diabetes Gestasional',
      icon: Heart,
      description: 'Terjadi pada ibu hamil yang sebelumnya tidak memiliki diabetes.',
      symptoms: ['Jarang bergejala', 'Terdeteksi via tes gula darah', 'Hilang setelah melahirkan'],
      color: 'from-pink-500 to-pink-600'
    }
  ],

 pencegahan: [
  {
    title: 'Pola Makan Sehat',
    icon: Apple,
    tips: [
      'Perbanyak konsumsi sayur dan buah',
      'Kurangi gula dan karbohidrat sederhana',
      'Pilih makanan berserat tinggi',
      'Hindari makanan olahan',
      'Kontrol porsi makan'
    ],
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop'
  },
  {
    title: 'Aktivitas Fisik',
    icon: Dumbbell,
    tips: [
      'Olahraga minimal 150 menit/minggu',
      'Jalan cepat 30 menit/hari',
      'Hindari duduk terlalu lama',
      'Lakukan peregangan rutin',
      'Pilih aktivitas yang menyenangkan'
    ],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop'
  },
  {
    title: 'Pola Hidup Sehat',
    icon: Moon,
    tips: [
      'Tidur cukup 7-8 jam/hari',
      'Kelola stres dengan baik',
      'Berhenti merokok',
      'Batasi konsumsi alkohol',
      'Jaga berat badan ideal'
    ],
    
   image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop'
  },
  {
    title: 'Pemeriksaan Rutin',
    icon: Activity,
    tips: [
      'Cek gula darah berkala',
      'Pemeriksaan kesehatan tahunan',
      'Monitor tekanan darah',
      'Cek kolesterol rutin',
      'Konsultasi dengan dokter'
    ],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop'
  }
],

  komplikasi: [
    { organ: 'Jantung', risk: 'Penyakit jantung & stroke', icon: Heart, color: 'text-red-600' },
    { organ: 'Ginjal', risk: 'Gagal ginjal', icon: Droplets, color: 'text-blue-600' },
    { organ: 'Mata', risk: 'Retinopati & kebutaan', icon: Eye, color: 'text-green-600' },
    { organ: 'Saraf', risk: 'Neuropati & mati rasa', icon: Brain, color: 'text-purple-600' },
    { organ: 'Kaki', risk: 'Luka & amputasi', icon: Activity, color: 'text-orange-600' },
  ],
  faq: [
    {
      q: 'Apakah diabetes bisa sembuh total?',
      a: 'Diabetes tipe 1 tidak bisa sembuh, tapi bisa dikelola. Diabetes tipe 2 bisa mencapai remisi (gula darah normal) dengan perubahan gaya hidup drastis, tapi tidak sembuh total.'
    },
    {
      q: 'Berapa kadar gula darah normal?',
      a: 'Gula darah puasa: 70-100 mg/dL. Gula darah 2 jam setelah makan: <140 mg/dL. HbA1c normal: <5.7%.'
    },
    {
      q: 'Apakah penderita diabetes tidak boleh makan manis sama sekali?',
      a: 'Boleh, tapi harus dibatasi dan diperhitungkan. Lebih baik pilih pemanis alami dan konsumsi dalam porsi kecil.'
    },
    {
      q: 'Kapan harus cek gula darah?',
      a: 'Penderita diabetes sebaiknya cek gula darah pagi (puasa) dan 2 jam setelah makan. Minimal 2-3 kali seminggu.'
    },
    {
      q: 'Apakah olahraga aman untuk penderita diabetes?',
      a: 'Sangat aman dan dianjurkan! Olahraga membantu menurunkan gula darah dan meningkatkan sensitivitas insulin.'
    }
  ]
};

export function EducationPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('pengertian');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      
      {/* SIDEBAR DENGAN LAYOUT FLEKSIBEL */}
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

        {/* 2. Navigation */}
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
          <Link to="/education" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium text-sm">Edukasi</span>
          </Link>
          <Link to="/about" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-medium text-sm">Tentang</span>
          </Link>
        </nav>

        {/* 3. Bottom Section */}
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
      <div className={`transition-all duration-300 flex flex-col min-h-screen ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        
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
        <div className="p-6 flex-1">
          {/* Header dengan Tombol Kembali */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Edukasi Diabetes</h1>
                  <p className="text-gray-600">Pelajari segala hal tentang diabetes & pencegahannya</p>
                </div>
              </div>
              
              {/* TOMBOL KEMBALI */}
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

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'pengertian', label: 'Pengertian', icon: BookOpen },
              { id: 'jenis', label: 'Jenis Diabetes', icon: AlertCircle },
              { id: 'pencegahan', label: 'Pencegahan', icon: CheckCircle },
              { id: 'komplikasi', label: 'Komplikasi', icon: Activity },
              { id: 'faq', label: 'FAQ', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-2 ${
                    activeSection === tab.id
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-red-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Content Sections */}
          {activeSection === 'pengertian' && (
            <div className="space-y-6 mb-16">
              <Card className="overflow-hidden border-2 border-red-100">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{educationData.pengertian.title}</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">{educationData.pengertian.content}</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {educationData.pengertian.stats.map((stat, idx) => (
                        <div key={idx} className="text-center p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                          <p className="text-2xl font-bold text-red-600">{stat.value}</p>
                          <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative h-64 md:h-auto">
                    <img 
                      src={educationData.pengertian.image} 
                      alt="Diabetes Awareness"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Card>

{/* ✅ NEW SECTION: Penjelasan Parameter Klinis Diabetes */}
<div className="space-y-8 mt-8">
  
  {/* Header Section */}
  <div className="text-center mb-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-3">Parameter Klinis Diabetes</h2>
    <p className="text-gray-600 max-w-3xl mx-auto">
      Memahami parameter-parameter penting dalam diagnosis dan pemantauan diabetes mellitus beserta nilai normalnya.
    </p>
  </div>

  {/* 8 Parameter Cards - MEDICAL EXPLANATION */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    
    {/* 1. Glukosa */}
    <Card className="border-2 border-red-100 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
      <div className="h-44 overflow-hidden">
        <img src={glukosaImage} alt="gula" className="w-full h-44 object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">Glukosa Darah</h3>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          Kadar gula dalam darah yang menjadi indikator utama diabetes. Diukur setelah puasa 8 jam.
        </p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Normal:</span>
            <span className="font-semibold text-green-600">&lt; 100 mg/dL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Prediabetes:</span>
            <span className="font-semibold text-yellow-600">100-125</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Diabetes:</span>
            <span className="font-semibold text-red-600">≥ 126</span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* 2. Tekanan Darah */}
    <Card className="border-2 border-red-100 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
      <div className="h-44 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=300&fit=crop" alt="Blood Pressure" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">Tekanan Darah</h3>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          Hipertensi sering menyertai diabetes dan meningkatkan risiko komplikasi kardiovaskular.
        </p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Normal:</span>
            <span className="font-semibold text-green-600">&lt; 120/80</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pre-HT:</span>
            <span className="font-semibold text-yellow-600">120-139</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hipertensi:</span>
            <span className="font-semibold text-red-600">≥ 140/90</span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* 3. BMI */}
    <Card className="border-2 border-red-100 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
      <div className="h-44 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop" alt="BMI Measurement" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">BMI (IMT)</h3>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          Indeks Massa Tubuh mengukur obesitas. Obesitas adalah faktor risiko utama diabetes tipe 2.
        </p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Normal:</span>
            <span className="font-semibold text-green-600">18.5-24.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Overweight:</span>
            <span className="font-semibold text-yellow-600">25-29.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Obesitas:</span>
            <span className="font-semibold text-red-600">≥ 30</span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* 4. Usia */}
    <Card className="border-2 border-red-100 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
      <div className="h-44 overflow-hidden">
       <img src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=400&h=300&fit=crop" alt="Age Factor" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">Usia</h3>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          Risiko diabetes meningkat seiring usia, terutama setelah usia 45 tahun karena penurunan fungsi pankreas.
        </p>
        <div className="bg-purple-50 p-2 rounded text-xs text-purple-800">
          <strong>Risiko Tinggi:</strong> Usia ≥ 45 tahun
        </div>
      </CardContent>
    </Card>

    {/* 5. Insulin */}
    <Card className="border-2 border-red-100 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
      <div className="h-44 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop" alt="Insulin" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">Kadar Insulin</h3>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          Hormon yang mengatur gula darah. Resistensi insulin adalah penyebab utama diabetes tipe 2.
        </p>
        <div className="bg-orange-50 p-2 rounded text-xs text-orange-800">
          <strong>Normal:</strong> 2.6-24.9 µU/mL
        </div>
      </CardContent>
    </Card>

    {/* 6. Ketebalan Kulit */}
    <Card className="border-2 border-red-100 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
      <div className="h-44 overflow-hidden">
        <img src={skinImage} alt="Skin" className="w-full h-44 object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">Ketebalan Kulit</h3>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          Ukuran lemak subkutan di trisep. Indikator cadangan energi dan status gizi.
        </p>
        <div className="bg-amber-50 p-2 rounded text-xs text-amber-800">
          <strong>Normal:</strong> Bervariasi sesuai usia & gender
        </div>
      </CardContent>
    </Card>

    {/* 7. Riwayat Keluarga */}
    <Card className="border-2 border-red-100 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
      <div className="h-44 overflow-hidden">
       <img src={familyImage} alt="Keluarga" className="w-full h-44 object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">Riwayat Keluarga</h3>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          Faktor genetik berperan penting. Memiliki orang tua dengan diabetes meningkatkan risiko.
        </p>
        <div className="bg-indigo-50 p-2 rounded text-xs text-indigo-800">
          <strong>Faktor Risiko:</strong> Genetik & lingkungan
        </div>
      </CardContent>
    </Card>

    {/* 8. Kehamilan */}
    <Card className="border-2 border-red-100 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
      <div className="h-44 overflow-hidden">
        <img src={pregnancyImage} alt="Kehamilan" className="w-full h-44 object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">Kehamilan</h3>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          Diabetes gestasional terjadi saat hamil. Wanita dengan riwayat ini berisiko tinggi diabetes tipe 2.
        </p>
        <div className="bg-pink-50 p-2 rounded text-xs text-pink-800">
          <strong>Risiko:</strong> Meningkat setelah kehamilan
        </div>
      </CardContent>
    </Card>

  </div>

  {/* Info Box Penting */}
  <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-2 text-lg">Penting untuk Diketahui</h4>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>Pemeriksaan parameter ini secara rutin membantu deteksi dini dan pencegahan komplikasi diabetes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>Nilai normal dapat bervariasi tergantung laboratorium dan kondisi individu</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>Konsultasikan hasil pemeriksaan Anda dengan dokter untuk diagnosis yang akurat</span>
            </li>
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
            </div>
          )}

          {activeSection === 'jenis' && (
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {educationData.jenis.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card key={idx} className="border-2 border-red-100 hover:shadow-xl transition-all">
                    <CardHeader>
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{item.type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-700">Gejala:</p>
                        {item.symptoms.map((symptom, sidx) => (
                          <div key={sidx} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="text-red-500">•</span>
                            <span>{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeSection === 'pencegahan' && (
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {educationData.pencegahan.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card key={idx} className="overflow-hidden border-2 border-red-100 hover:shadow-xl transition-all">
                    <div className="h-48 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {item.tips.map((tip, tidx) => (
                          <li key={tidx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeSection === 'komplikasi' && (
            <Card className="border-2 border-red-100 mb-16">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <AlertCircle className="w-7 h-7 text-red-600" />
                  Komplikasi Diabetes yang Berbahaya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {educationData.komplikasi.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-100">
                        <Icon className={`w-10 h-10 ${item.color} mx-auto mb-3`} />
                        <p className="font-bold text-gray-900 mb-1">{item.organ}</p>
                        <p className="text-xs text-gray-600">{item.risk}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                  <p className="text-sm text-amber-900">
                    <strong>Penting:</strong> Komplikasi diabetes dapat dicegah dengan mengontrol gula darah, 
                    pemeriksaan rutin, dan menjalani pola hidup sehat.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'faq' && (
  <div className="space-y-4 mb-16 px-2"> {/* ✅ TAMBAH px-2 */}
    {educationData.faq.map((faq, idx) => (
      <Card key={idx} className="border-2 border-red-100 overflow-hidden"> {/* ✅ TAMBAH overflow-hidden */}
        <button
          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0"> {/* ✅ TAMBAH flex-1 min-w-0 */}
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"> {/* ✅ TAMBAH flex-shrink-0 */}
              {idx + 1}
            </div>
            <span className="font-semibold text-gray-900 truncate">{faq.q}</span> {/* ✅ TAMBAH truncate */}
          </div>
          {openFaq === idx ? <ChevronUp className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />} {/* ✅ TAMBAH flex-shrink-0 ml-2 */}
        </button>
        {openFaq === idx && (
          <div className="px-4 pb-4 pl-16">
            <p className="text-gray-700 text-sm leading-relaxed">{faq.a}</p>
          </div>
        )}
      </Card>
    ))}
  </div>
)}
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 text-white py-12 px-4 mt-20">
          
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
        </footer>

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

// Helper component
function HelpCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <path d="M12 17h.01"/>
    </svg>
  );
}