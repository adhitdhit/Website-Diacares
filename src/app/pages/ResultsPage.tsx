import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { AlertCircle, CheckCircle, Home, RefreshCw, Info, Printer, Activity, Phone, ArrowUp } from 'lucide-react';
import jsPDF from 'jspdf';

// ✅ TYPE: Allow null untuk field yang boleh kosong
interface DiabetesParameters {
  age: number | null;
  glucose: number | null;
  bloodPressure: number | null;
  bmi: number | null;
  insulin: number | null;
  pregnancies: number | null;
  skinThickness: number | null;
  diabetesPedigreeFunction: number | null;
}

// ✅ UPDATE INTERFACE SESUAI RESPONSE FLASK (tanpa _id & status)
interface PredictionResult {
  success: boolean;
  prediction: number;
  probability: number;
  riskScore: number;
  riskLevel: string;
  recommendations: string[];
  message: string;
}

// ✅ HARD-CODE API_URL (sesuaikan dengan backend lu)
const API_URL = "http://localhost:5000";

// Import Logo
// @ts-ignore
import logoImage from "@/assets/logoss.png";

// Helper: warna risk score
const getRiskColor = (score: number) => {
  if (score >= 70) return { bg: 'from-red-600 to-red-500', text: 'text-red-600', border: 'border-red-300', light: 'bg-red-50', badge: 'bg-red-600' };
  if (score >= 50) return { bg: 'from-orange-500 to-orange-400', text: 'text-orange-600', border: 'border-orange-300', light: 'bg-orange-50', badge: 'bg-orange-500' };
  if (score >= 30) return { bg: 'from-yellow-500 to-yellow-400', text: 'text-yellow-600', border: 'border-yellow-300', light: 'bg-yellow-50', badge: 'bg-yellow-500' };
  return { bg: 'from-green-500 to-green-400', text: 'text-green-600', border: 'border-green-300', light: 'bg-green-50', badge: 'bg-green-500' };
};

// ✅ Helper: status parameter (handle null)
const getParamStatus = (value: number | null, min: number, max: number) => {
  if (value === null) return { color: 'text-gray-400', bg: 'bg-gray-50 border-gray-200', label: 'Tidak diisi' };
  if (value < min || value > max) return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', label: 'Di luar rentang' };
  return { color: 'text-green-600', bg: 'bg-green-50 border-green-200', label: 'Normal' };
};

// ✅ Helper: format nilai untuk tampil (handle null)
const formatValue = (value: number | null, unit: string = '', decimals: number = 0): string => {
  if (value === null) return '-';
  if (decimals > 0) return `${value.toFixed(decimals)} ${unit}`.trim();
  return `${value} ${unit}`.trim();
};

export function ResultsPage() {
  const navigate = useNavigate();
  
  const [patientName, setPatientName] = useState<string>('');
  const [patientGender, setPatientGender] = useState<string>('');
  const [parameters, setParameters] = useState<DiabetesParameters | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ INIT: LOAD DATA DARI SESSION STORAGE (BUKAN API POLLING)
  useEffect(() => {
    const initPage = () => {
      try {
        const name = sessionStorage.getItem('patientName');
        const gender = sessionStorage.getItem('patientGender');
        const paramsStr = sessionStorage.getItem('parameters');
        const resultStr = sessionStorage.getItem('predictionResult');  // ✅ DARI ParametersPage

        // Validasi data pasien
        if (!name || !paramsStr) {
          console.warn('⚠️ No patient data, redirecting to assessment');
          navigate('/assessment', { replace: true });
          return;
        }

        console.log('✅ Loading patient:', name, gender);
        setPatientName(name);
        setPatientGender(gender || 'laki-laki');
        
        // Parse parameters
        const parsedParams = JSON.parse(paramsStr) as DiabetesParameters;
        setParameters(parsedParams);

        // ✅ LOAD HASIL PREDIKSI DARI SESSION STORAGE
        if (resultStr) {
          const result: PredictionResult = JSON.parse(resultStr);
          console.log('📥 Loaded prediction result:', result);
          setPrediction(result);
        } else {
          // ❌ Tidak ada hasil = redirect balik
          console.warn('⚠️ No prediction result found. Redirecting...');
          navigate('/assessment', { replace: true });
          return;
        }

      } catch (err) {
        console.error('❌ Init error:', err);
        navigate('/assessment', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    initPage();
  }, [navigate]);

  // ✅ PDF Export
  const handlePrintPDF = () => {
    if (!prediction || !parameters) {
      alert('Data belum tersedia untuk dicetak');
      return;
    }

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // === HELPER: Konversi Tailwind color ke RGB ===
    const tailwindToRGB = (colorClass: string): [number, number, number] => {
      const colors: Record<string, [number, number, number]> = {
        'red-600': [220, 38, 38], 'red-500': [239, 68, 68],
        'orange-500': [234, 88, 12], 'orange-400': [251, 146, 60],
        'yellow-500': [234, 179, 8], 'yellow-400': [250, 204, 21],
        'green-600': [22, 163, 74], 'green-500': [34, 197, 94],
        'gray-400': [156, 163, 175], 'gray-600': [75, 85, 99],
        'blue-600': [37, 99, 235],
      };
      const key = colorClass.replace('text-', '');
      return colors[key] || [0, 0, 0];
    };

    // === HELPER: Escape special chars untuk PDF ===
    const escapePDFText = (text: string): string => {
      return text.replace(/μ/g, 'u').replace(/²/g, '^2').replace(/[✅⚠️🔴🚨]/g, '');
    };

    // === HEADER ===
    pdf.setFillColor(220, 38, 38);
    pdf.rect(margin, yPos, pageWidth - margin * 2, 15, 'FD');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HASIL PREDIKSI DIABETES', pageWidth / 2, yPos + 10, { align: 'center' });
    yPos += 25;

    // === INFORMASI PASIEN ===
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('INFORMASI PASIEN', margin, yPos);
    yPos += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Nama: ${escapePDFText(patientName)}`, margin, yPos);
    pdf.text(`Jenis Kelamin: ${escapePDFText(patientGender)}`, margin + 60, yPos);
    yPos += 7;
    const reportDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    pdf.text(`Tanggal: ${reportDate}`, margin, yPos);
    yPos += 10;

    // === SKOR RISIKO ===
    const colors = getRiskColor(prediction.riskScore);
    let boxColor: [number, number, number];
    if (prediction.riskScore >= 70) boxColor = [220, 38, 38];
    else if (prediction.riskScore >= 50) boxColor = [234, 88, 12];
    else if (prediction.riskScore >= 30) boxColor = [234, 179, 8];
    else boxColor = [22, 163, 74];
    
    pdf.setFillColor(boxColor[0], boxColor[1], boxColor[2]);
    pdf.rect(margin, yPos, pageWidth - margin * 2, 20, 'FD');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`SKOR RISIKO: ${prediction.riskScore}%`, pageWidth / 2, yPos + 8, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const riskLevelClean = escapePDFText(prediction.riskLevel);
    pdf.text(`Kategori: ${riskLevelClean}`, pageWidth / 2, yPos + 16, { align: 'center' });
    yPos += 25;

    // === STATUS ===
    pdf.setDrawColor(220, 38, 38);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('STATUS:', margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const statusText = prediction.prediction === 1 
      ? 'RISIKO TINGGI DIABETES - Diperlukan evaluasi medis' 
      : 'RISIKO RENDAH DIABETES - Pertahankan pola hidup sehat';
    pdf.text(statusText, margin + 20, yPos);
    yPos += 12;

    // === PARAMETER KLINIS ===
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(220, 38, 38);
    pdf.text('PARAMETER KLINIS', margin, yPos);
    yPos += 8;

    // Table header
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, yPos - 2, pageWidth - margin * 2, 6, 'F');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Parameter', margin + 3, yPos + 2);
    pdf.text('Nilai', margin + 70, yPos + 2);
    pdf.text('Satuan', margin + 110, yPos + 2);
    pdf.text('Status', margin + 145, yPos + 2);
    yPos += 7;

    // Data parameter
    const clinicalData = [
      { label: 'Glukosa Darah (OGTT)', value: parameters.glucose, unit: 'mg/dL', range: [0, 140] as [number, number] },
      { label: 'Tekanan Darah (Diastolik)', value: parameters.bloodPressure, unit: 'mmHg', range: [60, 80] as [number, number] }, 
      { label: 'BMI', value: parameters.bmi, unit: 'kg/m^2', range: [18.5, 22.9] as [number, number], decimals: 1 },
      { label: 'Insulin', value: parameters.insulin, unit: 'uU/mL', range: [2, 20] as [number, number] },
      { label: 'Usia', value: parameters.age, unit: 'tahun', range: [0, 35] as [number, number] },
      { label: 'Jumlah Kehamilan', value: parameters.pregnancies, unit: 'kali', range: [0, 3] as [number, number] },
      { label: 'Ketebalan Kulit', value: parameters.skinThickness, unit: 'mm', range: [10, 22] as [number, number] },
      { label: 'Riwayat Keluarga', value: parameters.diabetesPedigreeFunction, unit: '', range: [0, 0.5] as [number, number], decimals: 1 },
    ];

    clinicalData.forEach((item, index) => {
      if (index > 0) {
        pdf.setDrawColor(230, 230, 230);
        pdf.setLineWidth(0.1);
        pdf.line(margin, yPos - 1, pageWidth - margin, yPos - 1);
      }
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(50, 50, 50);
      pdf.text(item.label, margin + 3, yPos + 3);
      const displayValue = formatValue(item.value, item.unit, item.decimals);
      pdf.text(displayValue, margin + 70, yPos + 3);
      pdf.text(item.unit, margin + 110, yPos + 3);
      const status = item.range ? getParamStatus(item.value, item.range[0], item.range[1]) : { color: 'text-gray-400', label: '-' };
      const [r, g, b] = tailwindToRGB(status.color);
      pdf.setTextColor(r, g, b);
      pdf.text(status.label, margin + 145, yPos + 3);
      pdf.setTextColor(50, 50, 50);
      yPos += 6;
    });

    yPos += 8;

    // === REKOMENDASI MEDIS ===
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(220, 38, 38);
    pdf.text('REKOMENDASI MEDIS', margin, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);

    if (prediction.recommendations && prediction.recommendations.length > 0) {
      prediction.recommendations.forEach((rec, index) => {
        if (yPos + 10 > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
        }
        const cleanRec = escapePDFText(rec).replace(/^\d+\.\s*/, '').trim();
        const numberedRec = `${index + 1}. ${cleanRec}`;
        const lines = pdf.splitTextToSize(numberedRec, pageWidth - margin * 2 - 5);
        pdf.text(lines, margin, yPos + 3);
        yPos += lines.length * 5 + 3;
      });
    }

    // === FOOTER ===
    pdf.setDrawColor(220, 38, 38);
    pdf.setLineWidth(0.3);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(120, 120, 120);
    pdf.text('Hasil ini untuk tujuan skrining. Konsultasikan dengan tenaga medis.', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    pdf.text('DiaCARES - Diabetes Care & Risk Evaluation System', pageWidth / 2, yPos, { align: 'center' });
    pdf.setFontSize(7);
    pdf.text(`ID: DIA-${Date.now().toString().slice(-8).toUpperCase()}`, margin, pageHeight - 10);
    pdf.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, pageWidth - margin, pageHeight - 10, { align: 'right' });

    // Save PDF
    const safeName = patientName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20);
    pdf.save(`DiaCARES-Laporan-${safeName}-${Date.now()}.pdf`);
  };

  const handleNewAssessment = () => {
    sessionStorage.removeItem('parameters');
    sessionStorage.removeItem('predictionResult');
    navigate('/assessment');
  };

  const handleReset = () => {
    sessionStorage.clear();
    navigate('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4 border-4 border-red-200 border-t-red-600 rounded-full"></div>
          <p className="text-red-600 text-lg font-medium">Memuat hasil prediksi...</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4 border-4 border-red-200 border-t-red-600 rounded-full"></div>
          <p className="text-red-600 text-lg font-medium">Menyiapkan hasil...</p>
        </div>
      </div>
    );
  }

  const colors = getRiskColor(prediction.riskScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col">
      
      {/* HEADER / NAVIGATION BAR */}
      <nav className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-3">
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
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link to="/history" className="w-full sm:w-auto">
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto py-2">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Riwayat
                </Button>
              </Link>
              <Link to="/assessment" className="w-full sm:w-auto">
                <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg w-full sm:w-auto py-2">
                  <Activity className="w-4 h-4 mr-2" />
                  Asesmen Baru
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT - HASIL PREDIKSI */}
      <main className="flex-1 p-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Status Banner */}
          <div className="flex items-center gap-3 p-4 rounded-xl border-2 bg-green-50 border-green-300 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <div className="flex-1">
              <p className="font-semibold">✅ Prediksi Selesai!</p>
            </div>
          </div>

          <Card className="border-2 border-red-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 border-b border-red-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                    patientGender.toLowerCase() === 'laki-laki' 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
                      : 'bg-gradient-to-br from-pink-500 to-rose-500'
                  }`}>
                    <span className="text-xl text-white font-bold">
                      {patientGender.toLowerCase() === 'laki-laki' ? 'L' : patientGender.toLowerCase() === 'perempuan' ? 'P' : '?'}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      Hasil Prediksi
                    </CardTitle>
                    <CardDescription className="text-white/90 text-base">
                      Pasien: {patientName} • {patientGender}
                    </CardDescription>
                  </div>
                </div>
                {prediction.prediction === 1 ? (
                  <AlertCircle className="w-12 h-12 text-white/90 animate-pulse" />
                ) : (
                  <CheckCircle className="w-12 h-12 text-white/90" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              
              {/* Risk Score */}
              <div className={`text-center p-6 ${colors.light} rounded-2xl border-2 ${colors.border}`}>
                <p className="text-gray-700 mb-2 font-semibold">Diabetes Risk Score</p>
                <div className={`text-6xl font-bold mb-4 bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`}>
                  {prediction.riskScore}%
                </div>
                <div className={`inline-block px-6 py-3 rounded-full text-base font-bold ${colors.badge} text-white`}>
                  Risiko {prediction.riskLevel}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-700">Progress Risiko</span>
                  <span className={colors.text}>{prediction.riskScore}/100</span>
                </div>
                <Progress value={prediction.riskScore} className="h-4 bg-gray-200" />
              </div>

              {/* Parameter yang Diinput */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                  <Info className="w-5 h-5 text-red-600" />
                  Parameter yang Diinput:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {parameters && Object.entries(parameters).map(([key, value]: [string, any]) => {
                    const labels: Record<string, string> = {
                      age: 'Usia', glucose: 'Glukosa', bloodPressure: 'Tekanan Darah (Diastolik/Nilai Bawah)',
                      bmi: 'BMI', insulin: 'Insulin', pregnancies: 'Jumlah Kehamilan',
                      skinThickness: 'Ketebalan Kulit', diabetesPedigreeFunction: 'Riwayat Keluarga'
                    };
                    const units: Record<string, string> = {
                      glucose: 'mg/dL', bloodPressure: 'mmHg', bmi: '', insulin: 'uU/mL',
                      age: 'tahun', pregnancies: 'kali', skinThickness: 'mm', diabetesPedigreeFunction: ''
                    };
                    const ranges: Record<string, [number, number]> = {
                      glucose: [0, 140], bloodPressure: [60, 80], bmi: [18.5, 22.9],
                      insulin: [2, 20], age: [0, 35], pregnancies: [0, 3],
                      skinThickness: [10, 22], diabetesPedigreeFunction: [0, 0.5]
                    };
                    const decimals: Record<string, number> = { bmi: 1, diabetesPedigreeFunction: 1 };

                    const label = labels[key] || key;
                    const unit = units[key] || '';
                    const range = ranges[key];
                    const dec = decimals[key] || 0;
                    
                    const status = range ? getParamStatus(value, range[0], range[1]) : { color: 'text-gray-400', bg: 'bg-gray-50 border-gray-200', label: '-' };
                    const displayValue = formatValue(value, unit, dec);

                    return (
                      <div key={key} className={`p-3 rounded-lg border-2 ${status.bg}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-700">{label}</span>
                          <span className={`text-xs font-bold ${status.color}`}>{displayValue}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {value === null ? 'Tidak diisi' : range ? `Ideal: ${range[0]}-${range[1]} ${unit}`.trim() : '-'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rekomendasi */}
              {prediction.recommendations && prediction.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Rekomendasi Medis:
                  </h4>
                  {prediction.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white-50 rounded-lg border border-white-100 hover:border-white-200 transition-all">
                      <span className="text-red-600 font-bold text-lg">{i + 1}.</span>
                      <p className="text-gray-700 text-sm flex-1">{rec}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t-2 border-red-100 space-y-3">
                <Button 
                  onClick={handlePrintPDF} 
                  className="w-full h-12 text-base font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-300 flex items-center justify-center gap-2" 
                  variant="outline"
                >
                  <Printer className="w-5 h-5" />
                  Cetak Laporan PDF
                </Button>

                <Button 
                  onClick={handleNewAssessment} 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-700 hover:via-red-600 hover:to-orange-700 text-white shadow-lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Asesmen Pasien Baru
                </Button>

                <Button 
                  onClick={handleReset} 
                  variant="ghost" 
                  className="w-full h-12 text-base text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Kembali ke Beranda
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="text-center text-xs text-gray-600 p-4 bg-red-50 rounded-xl border-2 border-red-200">
            <p className="font-medium">⚠️ Hasil ini hanya untuk tujuan skrining dan edukasi.</p>
            <p>Konsultasikan dengan tenaga medis profesional untuk diagnosis dan penanganan yang tepat.</p>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 backdrop-blur-sm p-4 rounded-xl text-center shadow-md border-2 border-green-300">
              <div className="flex justify-center mb-1"><CheckCircle className="w-8 h-8 text-green-600" /></div>
              <div className="text-sm font-semibold text-green-700">Data Pasien</div>
            </div>
            <div className="bg-green-50 backdrop-blur-sm p-4 rounded-xl text-center shadow-md border-2 border-green-300">
              <div className="flex justify-center mb-1"><CheckCircle className="w-8 h-8 text-green-600" /></div>
              <div className="text-sm font-semibold text-green-700">Parameter</div>
            </div>
            <div className="bg-green-50 backdrop-blur-sm p-4 rounded-xl text-center shadow-lg border-2 border-green-300">
              <div className="flex justify-center mb-1"><CheckCircle className="w-8 h-8 text-green-600" /></div>
              <div className="text-sm font-semibold text-green-700">Hasil</div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 text-white py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
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
            <div>
              <h4 className="font-bold mb-2">Tautan Cepat</h4>
              <div className="space-y-1 text-sm text-red-200">
                <Link to="/" className="block hover:text-white transition-colors">Beranda</Link>
                <Link to="/assessment" className="block hover:text-white transition-colors">Asesmen Baru</Link>
                <Link to="/history" className="block hover:text-white transition-colors">Riwayat</Link>
                <Link to="/education" className="block hover:text-white transition-colors">Edukasi</Link>
              </div>
            </div>
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