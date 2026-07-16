import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());
   
// ✅ SIMPAN DB INSTANCE DI VARIABLE GLOBAL
let db;

 
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then((connection) => {
    console.log('✅ Connected to MongoDB');
    console.log('📂 Database: Database');
    // ✅ SIMPAN DB INSTANCE
    db = connection.connection.db;
    console.log('🗄️ Database instance ready');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// === ROUTE 1: GET stats ===
app.get('/api/stats', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'Database not connected' });
    }
    
    const collection = db.collection('Dataset Normalisasi');
    
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
    
    const collection = db.collection('Dataset Normalisasi');
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
    
    const collection = db.collection('Dataset Normalisasi');
    
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
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ HAPUS MONGODB CONNECTION (gak perlu lagi)

// === ROUTE: POST /api/predict → PROXY KE FLASK ===
app.post('/api/predict', async (req, res) => {
  try {
    // Forward request ke Flask backend
    const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5000';
    
    const response = await axios.post(
      `${FLASK_URL}/api/predict`,
      req.body,
      { timeout: 30000 }
    );

    res.json(response.data);
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Backend Flask tidak tersedia' 
    });
  }
});

// === ROUTE LAINNYA → RETURN PESAN FRIENDLY ===
app.get('/api/history', (req, res) => {
  res.json({ 
    success: true, 
    data: [], 
    message: 'History tersedia di file CSV lokal (data_prediksi_diabetes.csv)' 
  });
});

app.get('/api/stats', (req, res) => {
  res.json({ 
    success: true, 
    total: 0, 
    message: 'Stats tersedia di file CSV lokal' 
  });
});

app.get('/api/data', (req, res) => {
  res.json({ 
    success: true, 
    data: [], 
    message: 'Data tersedia di file CSV lokal' 
  });
});

app.get('/api/feature-means', (req, res) => {
  res.json({ 
    success: true, 
    means: {}, 
    message: 'Stats tersedia di file CSV lokal' 
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server ready' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Vercel proxy running on port ${PORT}`);
  console.log(`📡 Proxying to Flask at ${process.env.FLASK_URL || 'http://localhost:5000'}`);
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