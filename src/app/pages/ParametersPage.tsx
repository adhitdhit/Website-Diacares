import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import {
  Activity,
  ArrowLeft,
  CheckCircle,
  User,
  AlertCircle,
  Clock as ClockIcon,
  Phone,
  ArrowUp,
} from "lucide-react";

// @ts-ignore
import logoImage from "@/assets/logoss.png";

// ✅ TYPE: Allow null untuk field yang boleh kosong
export interface DiabetesParameters {
  pregnancies: number | null;
  glucose: number | null;
  bloodPressure: number | null;
  skinThickness: number | null;
  insulin: number | null;
  bmi: number | null;
  diabetesPedigreeFunction: number | null;
  age: number | null;
}


export function ParametersPage() {
  const navigate = useNavigate();

  const hasSubmittedRef = useRef(false);
  const isProcessingRef = useRef(false);

  const [patientName, setPatientName] = useState("");
  const [patientGender, setPatientGender] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const [parameters, setParameters] =
    useState<DiabetesParameters>({
      pregnancies: null,
      glucose: null,
      bloodPressure: null,
      skinThickness: null,
      insulin: null,
      bmi: null,
      diabetesPedigreeFunction: null,
      age: null,
    });

  const API_URL =
    import.meta.env.VITE_API_URL ||
    '/api';

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  // Load data pasien dari sessionStorage
  useEffect(() => {
    const savedName = sessionStorage.getItem('patientName');
    const savedGender = sessionStorage.getItem('patientGender');

    if (!savedName) {
      console.warn('⚠️ No patientName found, redirecting to /assessment');
      navigate('/assessment', { replace: true });
      return;
    }

    console.log('✅ ParametersPage loaded:', { name: savedName, gender: savedGender });
    setPatientName(savedName);

    if (savedGender) {
      const normalizedGender = savedGender.toLowerCase();
      setPatientGender(normalizedGender);
    }

    // ✅ Clear predictionId lama agar tidak bentrok
    sessionStorage.removeItem('predictionId');

    setIsLoaded(true);
  }, [navigate]);

  // ✅ AUTO-RESET: Kalau gender laki-laki, pregnancies auto jadi 0
  useEffect(() => {
    const isMale = patientGender === 'laki-laki';

    if (isMale && parameters.pregnancies !== 0) {
      console.log('🔒 Auto-reset pregnancies 0 untuk pasien laki-laki');
      setParameters((prev) => ({ ...prev, pregnancies: 0 }));
    }
  }, [patientGender]);

  // ✅ HELPER: Cek apakah pasien laki-laki
  const isMalePatient =
    patientGender === "laki-laki";

  // ✅ HANDLE CHANGE: Set null jika kosong, number jika ada nilai
  const handleChange = (
    field: keyof DiabetesParameters,
    value: string
  ) => {
    setErrorMessage("");

    if (value === "" || value === "-") {
      setParameters((prev) => ({
        ...prev,
        [field]: null,
      }));

      return;
    }

    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      setParameters((prev) => ({
        ...prev,
        [field]: parsedValue,
      }));
    }
  };
  // Fungsi simpan data ke MongoDB
  // ==========================================
  // 📌 SIMPAN DATA KE MONGODB
  // ==========================================
  // ==========================================
  // 📌 SIMPAN DATA KE MONGODB (SESUAI FORMAT GRADIO API)
  // ==========================================
  const saveToMongoDB = async (
    params: DiabetesParameters,
    transactionId: string
  ) => {
    if (isSaving) return false;

    try {
      setIsSaving(true);

      // 1. Ubah Payload menjadi format Array sesuai ekspektasi Gradio API
      const payload = {
        data: [
          isMalePatient ? 0 : Number(params.pregnancies || 0),
          Number(params.glucose || 120),
          Number(params.bloodPressure || 70),
          Number(params.skinThickness || 20),
          Number(params.insulin || 80),
          Number(params.bmi || 30),
          Number(params.diabetesPedigreeFunction || 0.5),
          Number(params.age || 30),
          patientName || "Anonim"
        ]
      };

      // 2. Tembak ke endpoint resmi Gradio Space kamu
      // Pastikan VITE_API_URL bernilai: https://dhitadhit-diacares-api.hf.space
      const response = await axios.post(
        `${API_URL}/call/predict_diabetes_api`,
        payload
      );

      // 3. Gradio mengembalikan status 200 dengan event_id jika berhasil masuk antrean
      if (response.status !== 200 || !response.data || !response.data.event_id) {
        throw new Error("Gagal memproses prediksi di server.");
      }

      setSaveStatus("success");
      
      // Kembalikan ID transaksi unik buatan kita sebagai pengganti savedId lama
      return transactionId; 
    } catch (error: any) {
      console.error(error);

      setSaveStatus("error");

      // Pastikan error yang diset berupa String agar tidak memicu crash React #31
      const errMsg = error.response?.data?.error || error.message || "Gagal menyimpan data.";
      setErrorMessage(errMsg);

      return false;
    } finally {
      isProcessingRef.current = false;
      setIsSaving(false);
    }
  };
  // ==========================================
  // 📌 SUBMIT
  // ==========================================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setErrorMessage("");

    // Cegah double submit
     if (hasSubmittedRef.current || isSaving) {
    console.log('⛔ BLOCKED: Duplicate submission prevented!');
    return;
  }

    // Hitung jumlah parameter yang telah diisi
    const totalParameters =
      Object.keys(parameters).length;

    const filledParameters =
      Object.values(parameters).filter(
        (value) => value !== null
      ).length;

    // Minimal 3 parameter
    if (filledParameters < 3) {
      await Swal.fire({
        icon: "warning",

        title: "Data Belum Mencukupi",

        html: `
        <div style="text-align:center">

          <p style="font-size:15px;line-height:1.6">
            Untuk memperoleh hasil prediksi yang lebih representatif,
            silakan isi
            <b>minimal 3 dari ${totalParameters} parameter klinis.</b>
          </p>

          <div style="
            margin-top:18px;
            padding:15px;
            border-radius:14px;
            background:#FEF2F2;
            border:1px solid #FCA5A5;
          ">

            <div style="
              font-size:32px;
              font-weight:bold;
              color:#DC2626;
            ">
              ${filledParameters}/${totalParameters}
            </div>

            <div style="
              font-size:14px;
              color:#7F1D1D;
            ">
              Parameter Telah Diisi
            </div>

          </div>

          <p style="
            margin-top:18px;
            color:#6B7280;
            font-size:13px;
          ">
            Semakin banyak parameter yang diisi,
            hasil prediksi akan semakin representatif.
          </p>

        </div>
      `,

        confirmButtonText: "Baik, Saya Mengerti",

        confirmButtonColor: "#DC2626",

        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      return;
    }

    console.log(
      `📦 ${filledParameters}/${totalParameters} parameter`
    );

    const transactionId = `TXN-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    sessionStorage.setItem(
      "parameters",
      JSON.stringify(parameters)
    );

    hasSubmittedRef.current = true;

    const savedId =
      await saveToMongoDB(
        parameters,
        transactionId
      );

    if (!savedId) {
      hasSubmittedRef.current = false;
      return;
    }

    sessionStorage.setItem(
      "predictionId",
      savedId
    );

    navigate("/results");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8">
        <div className="text-red-600 text-xl animate-pulse">Memuat data...</div>
      </div>
    );
  }

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
      {/* 📌 MAIN CONTENT - FORM PARAMETERS */}
      {/* ============================================ */}
      <main className="flex-1 p-4 py-8">
        <div className="max-w-3xl mx-auto">

          {/* Tombol Kembali */}
          <Button
            variant="ghost"
            onClick={() => navigate('/assessment')}
            className="mb-4 hover:bg-white/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <Card className="shadow-2xl border-2 border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 border-b border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Parameter Klinis</CardTitle>
                  <CardDescription className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Pasien: {patientName}
                    {patientGender && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full ml-2 capitalize">
                        {patientGender}
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pregnancies */}
                  <div className="space-y-2">
                    <Label htmlFor="pregnancies" className="text-base font-semibold">
                      Jumlah Kehamilan
                      {isMalePatient && (
                        <span className="text-xs text-gray-500 ml-2">(Tidak berlaku)</span>
                      )}
                    </Label>
                    <Input
                      id="pregnancies"
                      type="number"
                      min="0"
                      step="1"
                      placeholder={isMalePatient ? "Tidak berlaku" : "Contoh: 2"}
                      disabled={isMalePatient}
                      value={parameters.pregnancies ?? ""}
                      onChange={(e) => handleChange("pregnancies", e.target.value)}
                      className={`h-12 border-2 rounded-xl transition-all
                        ${isMalePatient
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                          : 'border-red-200 focus:border-red-500'
                        }`}
                    />
                    {isMalePatient && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Parameter ini hanya untuk pasien perempuan
                      </p>
                    )}
                  </div>

                  {/* Glucose */}
                  <div className="space-y-2">
                    <Label htmlFor="glucose" className="text-base font-semibold">
                      Kadar Glukosa (mg/dL)
                    </Label>
                    <Input
                      id="glucose"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Contoh: 120"
                      value={parameters.glucose ?? ""}
                      onChange={(e) => handleChange("glucose", e.target.value)}
                      className="h-12 border-2 border-red-200 focus:border-red-500 rounded-xl"
                    />
                  </div>

                  {/* Blood Pressure */}
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure" className="text-base font-semibold">Tekanan Darah Diastolik (Nilai Bawah/mmHg)</Label>
                    <Input
                      id="bloodPressure"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Contoh: 80"
                      value={parameters.bloodPressure ?? ""}
                      onChange={(e) => handleChange("bloodPressure", e.target.value)}
                      className="h-12 border-2 border-red-200 focus:border-red-500 rounded-xl"
                    />
                  </div>

                  {/* Skin Thickness */}
                  <div className="space-y-2">
                    <Label htmlFor="skinThickness" className="text-base font-semibold">Ketebalan Kulit (mm)</Label>
                    <Input
                      id="skinThickness"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={parameters.skinThickness ?? ""}
                      onChange={(e) => handleChange("skinThickness", e.target.value)}
                      className="h-12 border-2 border-red-200 focus:border-red-500 rounded-xl"
                    />
                  </div>

                  {/* Insulin */}
                  <div className="space-y-2">
                    <Label htmlFor="insulin" className="text-base font-semibold">Kadar Insulin (μU/mL)</Label>
                    <Input
                      id="insulin"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={parameters.insulin ?? ""}
                      onChange={(e) => handleChange("insulin", e.target.value)}
                      className="h-12 border-2 border-red-200 focus:border-red-500 rounded-xl"
                    />
                  </div>

                  {/* BMI */}
                  <div className="space-y-2">
                    <Label htmlFor="bmi" className="text-base font-semibold">BMI (Body Mass Index)</Label>
                    <Input
                      id="bmi"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Contoh: 23.5"
                      value={parameters.bmi ?? ""}
                      onChange={(e) => handleChange("bmi", e.target.value)}
                      className="h-12 border-2 border-red-200 focus:border-red-500 rounded-xl"
                    />
                  </div>

                  {/* Diabetes Pedigree Function */}
                  <div className="space-y-2">
                    <Label htmlFor="diabetesPedigreeFunction" className="text-base font-semibold">Riwayat Keluarga Diabetes</Label>
                    <Input
                      id="diabetesPedigreeFunction"
                      type="number"
                      min="0"
                      step="0.001"
                      placeholder="0"
                      value={parameters.diabetesPedigreeFunction ?? ""}
                      onChange={(e) => handleChange("diabetesPedigreeFunction", e.target.value)}
                      className="h-12 border-2 border-red-200 focus:border-red-500 rounded-xl"
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-base font-semibold">
                      Usia (tahun)
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Contoh: 35"
                      value={parameters.age ?? ""}
                      onChange={(e) => handleChange("age", e.target.value)}
                      className="h-12 border-2 border-red-200 focus:border-red-500 rounded-xl"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border-2 border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Save Status Message */}
                {saveStatus === 'success' && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    Data tersimpan ke database
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-14 text-lg bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-700 hover:via-red-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5 mr-2" />
                      Prediksi Risiko Diabetes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700">
              💡 <strong>Informasi:</strong> Untuk memperoleh hasil prediksi yang lebih
              representatif, silakan isi minimal{" "}
              <strong>3 dari 8 parameter klinis</strong>.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-xl text-center shadow-lg border-2 border-green-300">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div className="text-sm font-semibold text-green-700">
                Data Pasien
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl text-center shadow-lg border-2 border-red-300">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {Object.values(parameters).filter((v) => v !== null).length}
              </div>

              <div className="text-sm font-medium text-gray-700">
                Parameter Terisi
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl text-center shadow-md border border-gray-200">
              <div className="text-3xl font-bold text-gray-400 mb-1">
                3
              </div>

              <div className="text-sm text-gray-500">
                Hasil
              </div>
            </div>
          </div>

          {/* PENUTUP div max-w-3xl */}
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
          className="fixed bottom-6 right-6 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

    </div>
  );
}

export default ParametersPage;
