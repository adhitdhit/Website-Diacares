import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // ← WAJIB!

const app = express();
app.use(cors({ origin: ['*'], credentials: true }));
app.use(express.json());

let db;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    db = mongoose.connection.db;
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

// === ROUTE: POST /api/predict (FIXED) ===
// === ROUTE: POST /api/predict ===
app.post('/api/predict', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, error: 'DB not connected' });

    const {
      Glucose, Age, BloodPressure, BMI, Insulin,
      Pregnancies, SkinThickness, DiabetesPedigreeFunction,
      patientName, patientGender, source
    } = req.body;

    // Format payload untuk Gradio API
    const gradioPayload = {
      data: [
        Pregnancies ?? 0,
        Glucose ?? 0,
        BloodPressure ?? 0,
        SkinThickness ?? 0,
        Insulin ?? 0,
        BMI ?? 0,
        DiabetesPedigreeFunction ?? 0,
        Age ?? 0,
        patientName || 'Anonim'
      ],
      fn_index: 0
    };

    const HF_SPACE_URL = 'https://dhitadhit-diacares-api.hf.space';
    
    const mlApiResponse = await axios.post(
      `${HF_SPACE_URL}/api/predict`, 
      gradioPayload, 
      { 
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    // Parse response Gradio (format array)
    const resultData = mlApiResponse.data.data;
    const prediction = resultData[0];
    const probability = resultData[1];
    const riskScore = resultData[2];
    const riskLevel = resultData[3];
    const recommendations = [
      probability < 0.5 
        ? "Pertahankan pola hidup sehat" 
        : "Segera konsultasi dokter"
    ];

    // Simpan ke MongoDB
    const saved = await db.collection('Dataset Hasil').insertOne({
      patientName: patientName || 'Tanpa Nama',
      patientGender: patientGender || 'Tidak Diketahui',
      Pregnancies: Pregnancies ?? null,
      Glucose: Glucose ?? null,
      BloodPressure: BloodPressure ?? null,
      SkinThickness: SkinThickness ?? null,
      Insulin: Insulin ?? null,
      BMI: BMI ?? null,
      DiabetesPedigreeFunction: DiabetesPedigreeFunction ?? null,
      Age: Age ?? null,
      Prediction_Result: prediction,
      Risk_Score: riskScore,
      Risk_Level: riskLevel,
      Probability: probability,
      Recommendations: recommendations,
      source: source || 'web_app',
      status: 'completed',
      createdAt: new Date()
    });

    res.json({
      success: true,
      savedId: saved.insertedId.toString(),
      prediction,
      probability,
      riskScore,
      riskLevel,
      recommendations,
      message: 'Prediksi berhasil!'
    });

  } catch (error) {
    console.error('❌ Predict error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.data 
    });
  }
});

// === ROUTE 1: GET stats ===
app.get('/api/stats', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'Database not connected' });
    }
    
    const collection = db.collection('Database 4');
    
    const total = await collection.countDocuments({});
    const diabetes = await collection.countDocuments({ Outcome_Actual: 1 });
    const trainData = await collection.countDocuments({ Split: 'Train' });
    const testData = await collection.countDocuments({ Split: 'Test' });

    res.json({
      success: true,
      total,
      diabetes,
      nonDiabetes: total - diabetes,
      trainData,
      testData
    });
  } catch (error) {
    console.error('❌ Error GET /api/stats:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ROUTE 2: GET data ===
app.get('/api/data', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'Database not connected' });
    }
    
    const collection = db.collection('Dataset Hasil');
    const query = req.query.split ? { Split: req.query.split } : {};
    const data = await collection.find(query).toArray();
    
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('❌ Error GET /api/data:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ROUTE 3: GET feature-means ===
app.get('/api/feature-means', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'Database not connected' });
    }
    
    const collection = db.collection('Dataset Hasil');
    
    const stats = await collection.aggregate([
      {
        $group: {
          _id: null,
          meanGlucose: { $avg: '$Glucose' },
          meanBloodPressure: { $avg: '$BloodPressure' },
          meanBMI: { $avg: '$BMI' },
          meanInsulin: { $avg: '$Insulin' },
          meanPregnancies: { $avg: '$Pregnancies' },
          meanSkinThickness: { $avg: '$SkinThickness' },
          meanDPF: { $avg: '$DiabetesPedigreeFunction' },
          meanAge: { $avg: '$Age' }
        }
      }
    ]).toArray();

    const means = stats[0] || {};
    
    const fallbackMeans = {
      Glucose: 120.9,
      BloodPressure: 69.1,
      BMI: 31.9,
      Insulin: 79.8,
      Pregnancies: 3.8,
      SkinThickness: 20.5,
      DiabetesPedigreeFunction: 0.47,
      Age: 33.2
    };

    res.json({
      success: true,
      means: {
        Glucose: means.meanGlucose ?? fallbackMeans.Glucose,
        BloodPressure: means.meanBloodPressure ?? fallbackMeans.BloodPressure,
        BMI: means.meanBMI ?? fallbackMeans.BMI,
        Insulin: means.meanInsulin ?? fallbackMeans.Insulin,
        Pregnancies: means.meanPregnancies ?? fallbackMeans.Pregnancies,
        SkinThickness: means.meanSkinThickness ?? fallbackMeans.SkinThickness,
        DiabetesPedigreeFunction: means.meanDPF ?? fallbackMeans.DiabetesPedigreeFunction,
        Age: means.meanAge ?? fallbackMeans.Age
      }
    });
  } catch (error) {
    console.error('❌ Error calculating means:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ROUTE 4: POST predict ===
app.post('/api/predict', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, error: 'DB not connected' });

    const {
      Glucose, Age, BloodPressure, BMI, Insulin,
      Pregnancies, SkinThickness, DiabetesPedigreeFunction,
      patientName, patientGender, source
    } = req.body;

    // Format payload untuk Gradio API
    const gradioPayload = {
      data: [
        Pregnancies ?? 0,
        Glucose ?? 0,
        BloodPressure ?? 0,
        SkinThickness ?? 0,
        Insulin ?? 0,
        BMI ?? 0,
        DiabetesPedigreeFunction ?? 0,
        Age ?? 0,
        patientName || 'Anonim'
      ],
      fn_index: 0
    };

    const HF_SPACE_URL = 'https://dhitadhit-diacares-api.hf.space';
    
    const mlApiResponse = await axios.post(`${HF_SPACE_URL}/api/predict`, gradioPayload, {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });

    // Parse response Gradio
    const [prediction, probability, riskScore, riskLevel] = mlApiResponse.data.data;

    // Simpan ke MongoDB
    const saved = await db.collection('Dataset Hasil').insertOne({
      patientName: patientName || 'Tanpa Nama',
      patientGender: patientGender || 'Tidak Diketahui',
      Pregnancies, Glucose, BloodPressure, SkinThickness,
      Insulin, BMI, DiabetesPedigreeFunction, Age,
      Prediction_Result: prediction,
      Risk_Score: riskScore,
      Risk_Level: riskLevel,
      Probability: probability,
      source: source || 'web_app',
      status: 'completed',
      createdAt: new Date()
    });

    res.json({
      success: true,
      savedId: saved.insertedId.toString(),
      prediction,
      probability,
      riskScore,
      riskLevel,
      message: 'Prediksi berhasil!'
    });

  } catch (error) {
    console.error('❌ Predict error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ROUTE 5: GET prediction by ID ===
app.get('/api/prediction/:id', async (req, res) => {
  try {
    // ✅ CEK DB CONNECTION
    if (!db) {
      return res.status(500).json({ success: false, error: 'Database not connected' });
    }

    const { id } = req.params;
    const collection = db.collection('Dataset Normalisasi');
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    const result = await collection.findOne({ 
      _id: new mongoose.Types.ObjectId(id) 
    });
    
    if (!result) {
      return res.status(404).json({ success: false, error: 'Data not found' });
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('❌ Error GET /api/prediction/:id:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ROUTE 6: GET ALL HISTORY ===
app.get('/api/history', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'Database not connected' });
    }

    const PredictionCollection = db.collection('Dataset Hasil');
    
    const history = await PredictionCollection.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    
    const formattedHistory = history.map(doc => ({
      ...doc,
      _id: doc._id.toString()
    }));
    
    console.log(`✅ Fetched ${formattedHistory.length} history records`);
    
    res.json({
      success: true,
      count: formattedHistory.length,
      data: formattedHistory
    });
    
  } catch (error) {
    console.error('❌ Error fetching history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ROUTE 7: GET HISTORY BY PATIENT NAME ===
app.get('/api/history/:patientName', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'Database not connected' });
    }

    const { patientName } = req.params;
    const PredictionCollection = db.collection('Dataset Hasil');
    
    const history = await PredictionCollection.find({
      patientName: { $regex: patientName, $options: 'i' }
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    
    const formattedHistory = history.map(doc => ({
      ...doc,
      _id: doc._id.toString()
    }));
    
    console.log(`✅ Fetched ${formattedHistory.length} records for ${patientName}`);
    
    res.json({
      success: true,
      count: formattedHistory.length,
      data: formattedHistory
    });
    
  } catch (error) {
    console.error('❌ Error fetching patient history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ROUTE 8: CLEANUP DUPLICATES (Admin Only) ===
app.post('/api/admin/cleanup-duplicates', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, error: 'DB not connected' });

    const PredictionCollection = db.collection('Dataset Hasil');
    
    // Cari data dengan patientName + param sama, ambil yang terbaru
    const pipeline = [
      {
        $group: {
          _id: {
            patientName: '$patientName',
            Glucose: '$Glucose',
            Age: '$Age',
            BMI: '$BMI'
          },
          docs: { $push: { _id: '$_id', createdAt: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ];

    const duplicates = await PredictionCollection.aggregate(pipeline).toArray();
    let deleted = 0;

    for (const dup of duplicates) {
      // Urutkan by createdAt, hapus semua kecuali yang terbaru
      dup.docs.sort((a, b) => b.createdAt - a.createdAt);
      const toDelete = dup.docs.slice(1).map(d => d._id);
      
      if (toDelete.length > 0) {
        const result = await PredictionCollection.deleteMany({ _id: { $in: toDelete } });
        deleted += result.deletedCount;
      }
    }

    res.json({ success: true, message: `Deleted ${deleted} duplicates`, found: duplicates.length });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   GET  /api/stats`);
  console.log(`   GET  /api/data`);
  console.log(`   GET  /api/feature-means`);
  console.log(`   POST /api/predict`);
  console.log(`   GET  /api/prediction/:id`);
  console.log(`   GET  /api/history`);
});