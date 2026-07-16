// File: api/predict.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      Glucose, Age, BloodPressure, BMI, Insulin,
      Pregnancies, SkinThickness, DiabetesPedigreeFunction,
      patientName, patientGender
    } = req.body;

    // Call ke PythonAnywhere
    const ML_API_URL = 'https://adhitdhit19.pythonanywhere.com';
    
    const response = await axios.post(
      `${ML_API_URL}/api/predict`,
      {
        Pregnancies: Pregnancies ?? 0,
        Glucose: Glucose ?? 0,
        BloodPressure: BloodPressure ?? 0,
        SkinThickness: SkinThickness ?? 0,
        Insulin: Insulin ?? 0,
        BMI: BMI ?? 0,
        DiabetesPedigreeFunction: DiabetesPedigreeFunction ?? 0,
        Age: Age ?? 0,
        patientName: patientName || 'Anonim',
        patientGender: patientGender || '-'
      },
      { timeout: 30000 }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      details: error.response?.data 
    });
  }
}