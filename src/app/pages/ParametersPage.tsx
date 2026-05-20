import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { Activity, ArrowLeft, CheckCircle, User, AlertCircle } from "lucide-react";

// ✅ TYPE: Allow null untuk field yang boleh kosong
export interface DiabetesParameters {
  age: number | null;
  glucose: number | null;
  bloodPressure: number | null;
  bmi: number | null;
  insulin: number | null;
  pregnancies: number | null;
  skinThickness: number | null;
  diabetesPedigreeFunction: number | null;
}

export function ParametersPage() {
  const navigate = useNavigate();
  
  // REFS untuk prevent double submit
  const hasSubmittedRef = useRef(false);
  const isProcessingRef = useRef(false);
  
  const [patientName, setPatientName] = useState<string>('');
  const [patientGender, setPatientGender] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);


  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // ✅ INITIAL STATE: Semua null (belum diisi)
  const [parameters, setParameters] = useState<DiabetesParameters>({
    age: null,
    glucose: null,
    bloodPressure: null,
    bmi: null,
    insulin: null,
    pregnancies: null,
    skinThickness: null,
    diabetesPedigreeFunction: null,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  

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

    // ✅ AUTO-RESET: Kalau gender laki-laki, pregnancies auto jadi 0/null
  useEffect(() => {
    const isMale = patientGender === 'laki-laki';
    
    if (isMale && parameters.pregnancies !== null && parameters.pregnancies !== 0) {
      console.log('🔒 Auto-reset pregnancies untuk pasien laki-laki');
      setParameters((prev) => ({ ...prev, pregnancies: 0 }));
    }
  }, [patientGender]);

  // ✅ HELPER: Cek apakah pasien laki-laki
  const isMalePatient = patientGender === 'laki-laki';

  // ✅ HANDLE CHANGE: Set null jika kosong, number jika ada nilai
  const handleChange = (field: keyof DiabetesParameters, value: string) => {
    setErrorMessage(''); // Clear error saat user mulai mengetik
    
    if (value === "" || value === "-") {
      setParameters((prev) => ({ ...prev, [field]: null }));
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setParameters((prev) => ({ ...prev, [field]: numValue }));
      }
    }
  };

  // Fungsi simpan data ke MongoDB
  const saveToMongoDB = async (params: DiabetesParameters, transactionId: string) => {
    if (isSaving) return false;
    
    try {
      setIsSaving(true);
      
      // ✅ PAYLOAD: Kirim SEMUA field (null juga dikirim)
      const payload = {
        Pregnancies: params.pregnancies,
        Glucose: params.glucose,
        BloodPressure: params.bloodPressure,
        SkinThickness: params.skinThickness,
        Insulin: params.insulin,
        BMI: params.bmi,
        DiabetesPedigreeFunction: params.diabetesPedigreeFunction,
        Age: params.age,
        patientName: patientName,
        patientGender: patientGender.toLowerCase(),
        source: 'web_app',
        transactionId: transactionId
      };

      console.log('📡 Sending to backend:', payload);

      const response = await axios.post(`${API_URL}/predict`, payload);
      
      if (response.data.success) {
        console.log('✅ Saved to MongoDB:', response.data.savedId);
        setSaveStatus('success');
        return response.data.savedId;
      } else {
        throw new Error(response.data.error || 'Unknown error');
      }
    } catch (error: any) {
      console.error('❌ Gagal simpan ke MongoDB:', error);
      setSaveStatus('error');
      setErrorMessage(error.response?.data?.error || 'Gagal menyimpan data');
      return false;
    } finally {
      isProcessingRef.current = false;
      setIsSaving(false);
    }
  };

  // ✅ SUBMIT: TANPA VALIDASI - Boleh kosong semua!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Cek sudah submit (prevent double call di Strict Mode)
    if (hasSubmittedRef.current) {
      console.log('⏭️ Already submitted, skipping...');
      return;
    }
    
    // ✅ TIDAK ADA VALIDASI - Langsung submit walaupun semua null!
    const filledFields = Object.values(parameters).filter(v => v !== null && v !== undefined).length;
    const totalFields = Object.keys(parameters).length;
    
    console.log(`📦 Submitting: ${filledFields}/${totalFields} fields filled`);
    console.log('Parameters:', parameters);
    
    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // ✅ Simpan parameters ke sessionStorage (dengan nilai null)
    sessionStorage.setItem('parameters', JSON.stringify(parameters));
    
    // Set flag sudah submit
    hasSubmittedRef.current = true;
    
    // Simpan ke MongoDB (null akan diproses oleh Rough Set model)
    const savedId = await saveToMongoDB(parameters, transactionId);
    
    if (savedId) {
      // ✅ Simpan predictionId ke sessionStorage untuk ResultsPage
      sessionStorage.setItem('predictionId', savedId);
      
      // Navigate ke results page
      console.log('🚀 Navigating to /results');
      navigate('/results');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8">
        <div className="text-red-600 text-xl animate-pulse">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 py-8">
      <div className="max-w-3xl mx-auto">
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

                {/* Glucose - NO LONGER REQUIRED */}
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
                    // ✅ HAPUS required - Boleh kosong
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
                    placeholder="0.5"
                    value={parameters.diabetesPedigreeFunction ?? ""}
                    onChange={(e) => handleChange("diabetesPedigreeFunction", e.target.value)}
                    className="h-12 border-2 border-red-200 focus:border-red-500 rounded-xl"
                  />
                </div>

                {/* Age - NO LONGER REQUIRED */}
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
                    // ✅ HAPUS required - Boleh kosong
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
                    Lanjutkan ke Hasil Prediksi
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 backdrop-blur-sm p-4 rounded-xl text-center shadow-lg border-2 border-green-300">
            <div className="flex justify-center mb-1"><CheckCircle className="w-8 h-8 text-green-600" /></div>
            <div className="text-sm font-semibold text-green-700">Data Pasien</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl text-center shadow-lg border-2 border-red-300">
            <div className="text-3xl font-bold text-red-600 mb-1">2</div>
            <div className="text-sm font-medium text-gray-700">Parameter</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl text-center shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-gray-400 mb-1">3</div>
            <div className="text-sm text-gray-500">Hasil</div>
          </div>
        </div>
      </div>
    </div>
  );
}
