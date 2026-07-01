import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  CameraIcon, 
  ArrowPathIcon, 
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  ChartBarIcon, 
  SunIcon, 
  CloudIcon 
} from '@heroicons/react/24/solid';
import camera from '../assets/camera.jpg'; // 请确保添加这个图片
import leaf from '../assets/leaf.jpg'; // 请确保添加这个图片
// 导入Socket.io客户端
import io from 'socket.io-client';

// 创建socket连接
const socket = io('http://localhost:5000');

function Dashboard() {
  // const [autoDetection, setAutoDetection] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [detectionRecords, setDetectionRecords] = useState([]);
  // const [envData, setEnvData] = useState({
  //   temperature: null,
  //   humidity: null,
  //   light: null
  // });
  

  const [latestDisease, setLatestDisease] = useState([]);
  
  // 新增状态变量
  const [cameraOn, setCameraOn] = useState(false);
  const [showingCapturedFrame, setShowingCapturedFrame] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // 获取不同病害对应的建议
  const getDiseaseRecommendation = (diseaseType) => {
    const recommendations = {
      '早疫病': '适当增加通风，减少浇水频率，检查是否需要喷洒杀菌剂。',
      '晚疫病': '避免叶面浇水，加强通风，清除病株，使用合适的杀菌剂防治。',
      '褐斑病': '加强植株营养管理，改善栽培环境，合理密植，使用抗褐斑病品种。',
      '黑斑病': '减少浇水频率，增加通风，清除病叶，定期喷洒保护性杀菌剂。',
      '炭疽病': '控制田间湿度，清除病残体，轮作倒茬，选用抗病品种。',
      '白粉病': '避免过度施氮肥，适当增加钾肥，保持适当株距，施用保护性杀菌剂。',
      '锈病': '降低湿度，增加通风，清除病叶，使用系统性杀菌剂防治。',
      '灰霉病': '控制温室湿度，增加植株间距，去除病残体，使用广谱杀菌剂。',
      '根腐病': '改良土壤，控制灌溉，使用健康种苗，定期消毒土壤。',
      '病毒病': '及时清除病株，控制虫媒，使用无病毒种苗，注意工具消毒。'
    };
    
    return recommendations[diseaseType] || '建议联系专业农技人员进行诊断与处理。';
  };

  // 切换摄像头状态
  const toggleCamera = () => {
    setCameraOn(!cameraOn);
    setShowingCapturedFrame(false);
  };

  // 开始疾病检测
  const startDetection = () => {
    if (!cameraOn) return; // 如果摄像头未开启，不执行检测
    
    axios.post('http://localhost:5000/api/detect')
      .then(res => {
        // 显示捕获的帧
        setShowingCapturedFrame(true);
        setCapturedImage(`http://localhost:5000${res.data.image_url}`);
        
        // 更新最新病害信息-----------------------------||
        const newDetection = {
          date: res.data.timestamp,
          confidence: `${res.data.confidence}%`,
          status: res.data.confidence,
          image: `http://localhost:5000${res.data.image_url}`,
        };
        
        setLatestDisease({
          date: newDetection.date,
          type: newDetection.status,
          confidence: newDetection.confidence,
          image: newDetection.image,
          recommendation: getDiseaseRecommendation(newDetection.status)
        });
        
        // 更新检测记录
        setDetectionRecords(prev => {
          const updatedRecords = [newDetection, ...prev];
          return updatedRecords.slice(0, 3);
        });
        
        // 8秒后恢复视频流显示
        setTimeout(() => {
          setShowingCapturedFrame(false);
        }, 8000);
      })
      .catch(err => {
        console.error('疾病检测失败：', err);
      });
  };

  useEffect(() => {
    // 获取初始数据
    axios.get('http://localhost:5000/api/dashboard')
      .then(res => {
        console.log("返回的数据是：", res.data);
        setDetectionRecords(res.data.detection_records.slice(-3).reverse());
        // setEnvData(res.data.env_data);
        
        // 如果有检测记录，更新最新病害信息
        if (res.data.detection_records.length > 0) {
          const latest = res.data.detection_records[res.data.detection_records.length - 1];
          setLatestDisease({
            date: latest.timestamp,
            type: latest.result,
            confidence: latest.confidence,
            image:`http://localhost:5000${latest.image_url}`,
            recommendation: getDiseaseRecommendation(latest.status)
          });
        }
      })
      .catch(err => {
        console.error('获取数据失败：', err);
      });
    
    // 监听socket推送的新数据
    socket.on('new_data', (newRecord) => {
      setDetectionRecords(prev => {
        const updatedRecords = [newRecord, ...prev];
        return updatedRecords.slice(0, 3);
      });
      
      // 更新最新病害信息
      setLatestDisease({
        date: newRecord.date,
        type: newRecord.status,
        confidence: newRecord.confidence,
        image: newRecord.image,
        recommendation: getDiseaseRecommendation(newRecord.status)
      });
    });

    // 组件卸载时清理
    return () => {
      socket.off('new_data');
    };
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧区域 */}
        <div className="lg:col-span-2 space-y-5">
          {/* 摄像头模块 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex">
              {/* 摄像头画面区域 */}
              <div className="w-2/3">
                <div className="relative" style={{ aspectRatio: '4/3' }}>
                  {cameraOn && !showingCapturedFrame ? (
                    // 显示视频流
                    <img 
                      src="http://localhost:5000/api/stream/video_feed" 
                      alt="实时视频" 
                      className="w-full h-full object-cover object-center"
                    />
                  ) : showingCapturedFrame ? (
                    // 显示捕获的帧
                    <img 
                      src={capturedImage} 
                      alt="捕获的图像" 
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    // 显示默认图片（摄像头关闭状态）
                    <img 
                      src={camera} 
                      alt="摄像头关闭" 
                      className="w-full h-full object-cover object-center"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/800x800?text=摄像头关闭'; }}
                    />
                  )}
                  
                  {/* 没有图片时的占位符 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-0">
                    <CameraIcon className="h-16 w-16 text-gray-400" />
                    <p className="text-gray-500 mt-2">无法获取摄像头画面</p>
                  </div>
                </div>
              </div>
              
              {/* 控制面板区域 */}
              <div className="w-1/3 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">实时监控</h2>
                  <div className="text-sm text-gray-500 mt-2">设备编号: TL-2023001</div>
                  <div className="text-sm text-gray-500">位置: 温室A区</div>
                  <div className="flex items-center mt-4">
                    <span className={`h-2.5 w-2.5 rounded-full ${cameraOn ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className="text-sm text-gray-500 ml-2">{cameraOn ? '摄像头已开启' : '摄像头已关闭'}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={toggleCamera}
                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
                      cameraOn 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    <CameraIcon className="w-5 h-5 mr-2" />
                    {cameraOn ? '关闭摄像头' : '打开摄像头'}
                  </button>
                  
                  <button 
                    onClick={startDetection}
                    disabled={!cameraOn}
                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
                      cameraOn 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ArrowPathIcon className="w-5 h-5 mr-2" />
                    开始检测
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 最近检测记录 */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">最近检测记录</h2>
              <Link to="/history" className="text-secondary hover:text-blue-600 flex items-center text-sm">
                查看更多 <ChevronRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {detectionRecords.length > 0 ? (
                detectionRecords.map((record, index) => (
                  <div key={record.id || index} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{record.timestamp}</p>
                      <div className="flex items-center mt-1">
                        <span 
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            record.status === '健康' ? 'bg-green-500' : 'bg-red-500'
                          }`} 
                        />
                        <p className="font-medium">{record.result}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">置信度</p>
                      <p className="font-medium">{record.confidence}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">暂无检测记录</div>
              )}
            </div>
          </div>
        </div>
        
        {/* 右侧区域 */}
        <div className="space-y-5">
          {/* 环境信息 */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">环境信息</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                  <ChartBarIcon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">温度</p>
                  <p className="font-medium text-lg">17℃</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                  <CloudIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">湿度</p>
                  <p className="font-medium text-lg">38%</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mr-3">
                  <SunIcon className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">光照</p>
                  <p className="font-medium text-lg">217Lx</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 上次病害信息 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">上次病害检测</h2>
              <p className="text-sm text-gray-500">{latestDisease.date}</p>
            </div>
            {latestDisease.type ? (
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-red-500">{latestDisease.type}</p>
                    <p className="text-sm font-medium">置信度: {latestDisease.confidence}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${typeof latestDisease.confidence === 'string' ? 
                        parseInt(latestDisease.confidence) : latestDisease.confidence}%` }}
                    ></div>
                  </div>
                </div>
                <div className="relative cursor-pointer" style={{ aspectRatio: '4/3' }} onClick={() => setShowFullImage(true)}>
                  <img 
                    src={latestDisease.image} 
                    alt="病害图片" 
                    className="w-full h-full object-cover object-center rounded-lg"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=病害图片'; }}
                  />
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p>建议: {latestDisease.recommendation}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>暂无病害检测数据</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 全屏图片查看模态框 */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowFullImage(false)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setShowFullImage(false)}
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <img 
              src={latestDisease.image || leaf} 
              alt="病害图片" 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;