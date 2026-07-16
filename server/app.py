from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Izinkan React akses

# Load Model
try:
    with open('diabetes_model.pkl', 'rb') as f:
        model = pickle.load(f)
        pipeline = model['pipeline']
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"⚠️ Error loading model: {e}")
    pipeline = None

# File CSV untuk nyimpen data
CSV_FILE = 'data_prediksi_diabetes.csv'

# Fungsi buat nyimpen ke CSV
def save_to_csv(data):
    df = pd.DataFrame([data])
    
    # Kalau file belum ada, bikin baru + header
    if not os.path.exists(CSV_FILE):
        df.to_csv(CSV_FILE, index=False)
    else:
        # Append ke file yang udah ada
        df.to_csv(CSV_FILE, mode='a', header=False, index=False)
    
    print(f"✅ Data saved to {CSV_FILE}")

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if pipeline is None:
            return jsonify({'success': False, 'error': 'Model not loaded'}), 500

        data = request.json
        
        # Ambil data dari request
        pregnancies = float(data.get('Pregnancies', 0) or 0)
        glucose = float(data.get('Glucose', 0) or 0)
        blood_pressure = float(data.get('BloodPressure', 0) or 0)
        skin_thickness = float(data.get('SkinThickness', 0) or 0)
        insulin = float(data.get('Insulin', 0) or 0)
        bmi = float(data.get('BMI', 0) or 0)
        dpf = float(data.get('DiabetesPedigreeFunction', 0) or 0)
        age = float(data.get('Age', 0) or 0)
        patient_name = data.get('patientName', 'Anonim')
        patient_gender = data.get('patientGender', '-')

        # Prediksi
        features = np.array([[pregnancies, glucose, blood_pressure,
                             skin_thickness, insulin, bmi, dpf, age]])
        
        prediction = int(pipeline.predict(features)[0])
        probability = float(pipeline.predict_proba(features)[0][1])
        risk_score = round(probability * 100)

        # Tentukan risk level
        if probability < 0.25:
            risk_level = "RENDAH"
            recommendations = "Pertahankan pola hidup sehat; Olahraga rutin"
        elif probability < 0.50:
            risk_level = "SEDANG"
            recommendations = "Kurangi gula & karbohidrat; Olahraga 3x seminggu"
        elif probability < 0.75:
            risk_level = "TINGGI"
            recommendations = "Segera konsultasi dokter; Tes HbA1c"
        else:
            risk_level = "SANGAT TINGGI"
            recommendations = "Wajib konsultasi dokter segera; Pemeriksaan lengkap"

        # Data yang mau disimpan ke CSV
        csv_data = {
            'Timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'PatientName': patient_name,
            'PatientGender': patient_gender,
            'Pregnancies': pregnancies,
            'Glucose': glucose,
            'BloodPressure': blood_pressure,
            'SkinThickness': skin_thickness,
            'Insulin': insulin,
            'BMI': bmi,
            'DiabetesPedigreeFunction': dpf,
            'Age': age,
            'Prediction_Result': prediction,
            'Probability': probability,
            'Risk_Score': risk_score,
            'Risk_Level': risk_level,
            'Recommendations': recommendations
        }

        # Simpan ke CSV
        save_to_csv(csv_data)

        return jsonify({
            'success': True,
            'prediction': prediction,
            'probability': probability,
            'riskScore': risk_score,
            'riskLevel': risk_level,
            'recommendations': recommendations.split('; '),
            'message': 'Prediksi berhasil! Data tersimpan.'
        })

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Ambil semua data dari CSV"""
    try:
        if os.path.exists(CSV_FILE):
            df = pd.read_csv(CSV_FILE)
            # Balik urutan (yang terbaru di atas)
            df = df.iloc[::-1].reset_index(drop=True)
            # Convert ke JSON
            history = df.to_dict('records')
            return jsonify({'success': True, 'data': history})
        else:
            return jsonify({'success': True, 'data': []})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/download-csv', methods=['GET'])
def download_csv():
    """Download file CSV"""
    try:
        if os.path.exists(CSV_FILE):
            return send_file(
                CSV_FILE,
                mimetype='text/csv',
                as_attachment=True,
                download_name='data_prediksi_diabetes.csv'
            )
        else:
            return jsonify({'error': 'File belum ada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Cek apakah server jalan"""
    return jsonify({
        'status': 'ok',
        'message': 'Server berjalan!',
        'data_file': CSV_FILE
    })

if __name__ == '__main__':
    print("🚀 DiaCARES Server starting...")
    print(f"📁 Data akan disimpan ke: {os.path.abspath(CSV_FILE)}")
    print("✅ Server ready!")
    app.run(host='0.0.0.0', port=5000, debug=True)