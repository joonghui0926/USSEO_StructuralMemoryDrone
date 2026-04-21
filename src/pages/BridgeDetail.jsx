import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Camera, Layers, ChevronRight, TrendingUp, Thermometer, Droplets, Gauge, FileText, Loader2, Sparkles } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { app, db, storage } from '../firebase'; 
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';

const BridgeDetail = () => {
  const { id } = useParams();
  const { userRole } = useAuth(); 

  const [uploadedImage, setUploadedImage] = useState(null);
  const [vibrationData, setVibrationData] = useState([]);
  const [crackAnalysis, setCrackAnalysis] = useState(null);
  const [graphInterpretation, setGraphInterpretation] = useState(null);
  const [envData, setEnvData] = useState({ temp: '18.5', humidity: '64', pressure: '1013' });

  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isAnalyzingCsv, setIsAnalyzingCsv] = useState(false);

  useEffect(() => {
    const fetchSavedData = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'bridges', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.uploadedImage) setUploadedImage(data.uploadedImage);
          if (data.crackAnalysis) setCrackAnalysis(data.crackAnalysis);
          if (data.vibrationData) setVibrationData(data.vibrationData);
          if (data.graphInterpretation) setGraphInterpretation(data.graphInterpretation);
          if (data.envData) setEnvData(data.envData);
        }
      } catch (error) {
        console.error("Firebase에서 데이터를 불러오는데 실패했습니다:", error);
      }
    };
    fetchSavedData();
  }, [id]);

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const functions = getFunctions(app);
    const analyzeData = httpsCallable(functions, 'analyzeStructuralData');

    if (type === 'image') {
      setIsAnalyzingImage(true);
      
      try {
        const storageRef = ref(storage, `bridges/${id}/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadResult.ref);
        setUploadedImage(downloadURL);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64Image = reader.result;
          const result = await analyzeData({ type: 'image', payload: base64Image });
          setCrackAnalysis(result.data); 
          
          await setDoc(doc(db, 'bridges', id), {
            uploadedImage: downloadURL,
            crackAnalysis: result.data,
            lastUpdated: new Date()
          }, { merge: true });
        };
      } catch (error) {
        console.error("AI Image Analysis or Storage Upload Failed", error);
        alert("이미지 업로드 및 분석 중 오류가 발생했습니다.");
      } finally {
        setIsAnalyzingImage(false);
      }
      
    } else if (type === 'csv') {
      setIsAnalyzingCsv(true);

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(), 
        complete: async (results) => {
          const data = results.data;
          
          const validData = data.filter(row => row.time !== undefined && row.accel_x !== undefined);
          setVibrationData(validData);
          
          let currentEnvData = { temp: '18.5', humidity: '64', pressure: '1013' }; 

          if (validData.length > 0) {
            const lastRow = validData[validData.length - 1]; 
            
            const tempVal = parseFloat(lastRow.temp);
            const humidityVal = parseFloat(lastRow.humidity);
            const pressureVal = parseFloat(lastRow.pressure);

            currentEnvData = {
              temp: !isNaN(tempVal) ? tempVal.toFixed(1) : '18.5',
              humidity: !isNaN(humidityVal) ? Math.round(humidityVal).toString() : '64',
              pressure: !isNaN(pressureVal) ? Math.round(pressureVal).toString() : '1013'
            };
            setEnvData(currentEnvData);
          }
          
          try {
            const summaryData = validData.slice(0, 15); 
            const result = await analyzeData({ type: 'csv', payload: summaryData });
            setGraphInterpretation(result.data);

            await setDoc(doc(db, 'bridges', id), {
                vibrationData: validData,
                graphInterpretation: result.data,
                envData: currentEnvData,
                lastUpdated: new Date()
            }, { merge: true });

          } catch (error) {
             console.error("AI CSV Analysis Failed", error);
             alert("센서 데이터 분석 중 오류가 발생했습니다.");
          } finally {
             setIsAnalyzingCsv(false);
          }
        },
      });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col mb-10 pb-6 border-b border-slate-200/60">
         <div className="flex items-center gap-2 text-slate-400 text-sm mb-2 font-medium">
             <span className="hover:text-slate-600 cursor-pointer transition-colors">Infrastructure</span>
             <ChevronRight size={14} />
             <span className="text-brand-900 font-semibold tracking-tight">Beta Overpass</span>
         </div>
         <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Structural Memory Inspector</h1>
         <p className="text-slate-500 mt-2 text-sm">Upload visual and sensor logs to run AI structural analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 h-full">
        
        
        <div className="flex flex-col gap-8">
            <div>
              <div className="flex justify-between items-end mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Visual Memory</h2>
                  <FileUploadButton type="image" handleFileUpload={handleFileUpload} disabled={isAnalyzingImage} />
              </div>
              
              <div className="bg-slate-900 rounded-2xl aspect-[16/10] relative overflow-hidden group shadow-inner">
                  {uploadedImage ? (
                      <img src={uploadedImage} alt="Bridge Inspected" className="w-full h-full object-cover" />
                  ) : (
                      <>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="text-center opacity-40">
                                  <Layers className="mx-auto text-white mb-4" size={48} />
                                  <p className="text-white font-light tracking-widest uppercase text-xs">3D Point Cloud visualization</p>
                              </div>
                          </div>
                      </>
                  )}

                  <div className="absolute top-1/2 left-1/3">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse"></div>
                  </div>
                  <div className="absolute top-1/3 left-2/3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)]"></div>
                  </div>
                  
                  <div className="absolute bottom-5 left-5">
                       <div className="flex items-center gap-2 text-[10px] font-medium text-white/80 uppercase tracking-wider bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          Live Feed Active
                      </div>
                  </div>
              </div>
            </div>

            <div className="min-h-[200px]">
                {isAnalyzingImage ? (
                    <div className="flex flex-col items-center justify-center h-full text-brand-900 opacity-70 bg-slate-50 rounded-2xl p-8">
                        <Loader2 className="animate-spin mb-3" size={32} />
                        <p className="text-sm font-medium">Running GPT Analysis...</p>
                    </div>
                ) : crackAnalysis ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={18} className="text-brand-600" />
                            <h3 className="text-lg font-bold text-slate-800">Visual Analysis Advisory</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {Object.entries(crackAnalysis).map(([key, value]) => (
                                <div key={key} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col md:flex-row md:items-start md:justify-between gap-2 group hover:border-brand-200 hover:bg-white transition-all shadow-sm">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3 shrink-0 pt-0.5">
                                        {key.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-sm font-medium text-slate-800 leading-relaxed md:text-right w-full">
                                        {typeof value === 'object' && value !== null 
                                            ? JSON.stringify(value) 
                                            : value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full border border-dashed border-slate-200 rounded-2xl">
                        <p className="text-sm text-slate-400 font-medium">Upload an image to view AI analysis.</p>
                    </div>
                )}
            </div>
        </div>

        <div className="flex flex-col gap-8">
            <div>
              <div className="flex justify-between items-end mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Sensor Trend Analysis</h2>
                  <FileUploadButton type="csv" handleFileUpload={handleFileUpload} disabled={isAnalyzingCsv} />
              </div>

              <div className="w-full aspect-[16/10] bg-slate-50/50 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-100/50 p-4">
                {vibrationData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vibrationData}>
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} width={40} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="accel_x" stroke="#047857" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="accel_y" stroke="#f97316" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="accel_z" stroke="#3b82f6" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center z-10">
                      <TrendingUp className="mx-auto text-slate-300 mb-2" size={32} />
                      <p className="text-sm font-medium text-slate-500">Vibration Amplitude (15s Window)</p>
                      <p className="text-xs text-slate-400 mt-1">Waiting for CSV Data...</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-6 px-4 py-4 bg-white border-y border-slate-100">
                <EnvironmentStat icon={<Thermometer size={18} className="text-rose-500" />} label="Temp" value={envData.temp} unit="°C" />
                <div className="w-px h-8 bg-slate-200"></div>
                <EnvironmentStat icon={<Droplets size={18} className="text-blue-500" />} label="Humidity" value={envData.humidity} unit="%" />
                <div className="w-px h-8 bg-slate-200"></div>
                <EnvironmentStat icon={<Gauge size={18} className="text-amber-500" />} label="Pressure" value={envData.pressure} unit="hPa" />
              </div>
            </div>

            <div className="min-h-[200px]">
                {isAnalyzingCsv ? (
                     <div className="flex flex-col items-center justify-center h-full text-brand-900 opacity-70">
                        <Loader2 className="animate-spin mb-3" size={28} />
                        <p className="text-sm font-medium">Running Time-Series Analysis...</p>
                    </div>
                ) : graphInterpretation ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={18} className="text-brand-600" />
                            <h3 className="text-lg font-bold text-slate-800">Telemetry Advisory</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {Object.entries(graphInterpretation).map(([key, value]) => (
                                <div key={key} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col md:flex-row md:items-start md:justify-between gap-2 group hover:border-brand-200 hover:bg-white transition-all shadow-sm">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3 shrink-0 pt-0.5">
                                        {key.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-sm text-slate-800 font-medium text-right w-2/3 leading-relaxed">
                                        {typeof value === 'object' && value !== null 
                                            ? JSON.stringify(value) 
                                            : value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full border border-dashed border-slate-200 rounded-2xl">
                        <p className="text-sm text-slate-400 font-medium">Upload a CSV to view telemetry insights.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </Layout>
  );
};

const FileUploadButton = ({ type, handleFileUpload, disabled }) => (
    <div className={`flex items-center ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <label className="text-xs text-brand-900 font-bold bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors duration-200">
            {disabled ? <Loader2 size={14} className="animate-spin" /> : (type === 'image' ? <Camera size={14} /> : <FileText size={14} />)}
            Upload {type === 'image' ? 'Image' : 'CSV'}
            <input
                type="file"
                accept={type === 'image' ? "image/*" : ".csv"}
                onChange={(event) => handleFileUpload(event, type)}
                className="hidden"
                disabled={disabled}
            />
        </label>
    </div>
);

const EnvironmentStat = ({ icon, label, value, unit }) => (
    <div className="flex flex-col items-center sm:flex-row sm:gap-3 w-1/3 justify-center">
        <div className="hidden sm:block p-2 bg-slate-50 rounded-full">
            {icon}
        </div>
        <div className="text-center sm:text-left">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</span>
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
                <span className="text-xl font-bold text-slate-800 tracking-tight">{value}</span>
                <span className="text-xs font-semibold text-slate-400">{unit}</span>
            </div>
        </div>
    </div>
);

export default BridgeDetail;