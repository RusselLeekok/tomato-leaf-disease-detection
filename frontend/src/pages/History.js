import React, { useState ,useEffect} from 'react';
import { 
  CalendarIcon,
  MapPinIcon,
  BeakerIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import leaf from '../assets/leaf.jpg'; // 请确保添加这个图片
import axios from 'axios';
// 注册Chart.js组件
ChartJS.register(ArcElement, Tooltip, Legend);



function History() {
  const [dateFilter, setDateFilter] = useState('all');
  const [diseaseFilter, setDiseaseFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectionRecords, setDetectionRecords] = useState([]); // 用于存储从后端获取的检测记录

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard') 
      .then(res => {
        setDetectionRecords(res.data.detection_records.reverse()); // 反转数组以便最新的记录在上面
      })
      .catch(err => {
        console.error('获取数据失败:', err);
      });
  }, []);
  // 饼图数据计算
const totalRecords = detectionRecords.length;
const healthyCount = detectionRecords.filter(record => record.result === 'Leaf Mold').length;
const earlyBlightCount = detectionRecords.filter(record => record.result === 'Early Blight').length;
const lateBlightCount = detectionRecords.filter(record => record.result === 'Healthy').length;
const spotBlightCount = detectionRecords.filter(record => record.result === 'Late Blight').length;

const healthyPercent = Math.round((healthyCount / totalRecords) * 100);
const earlyBlightPercent = Math.round((earlyBlightCount / totalRecords) * 100);
const lateBlightPercent = Math.round((lateBlightCount / totalRecords) * 100);
const spotBlightPercent = Math.round((spotBlightCount / totalRecords) * 100);

const now = new Date();

// 获取本周开始时间（周一）
const startOfWeek = new Date(now);
startOfWeek.setDate(now.getDate() - now.getDay() + 1); // 设置为本周一
startOfWeek.setHours(0, 0, 0, 0);

// 获取本月开始时间
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
startOfMonth.setHours(0, 0, 0, 0);

// 饼图数据
const chartData = {
  labels: [`健康 (${healthyPercent}%)`, `早疫病 (${earlyBlightPercent}%)`, `晚疫病 (${lateBlightPercent}%)`, `斑点病 (${spotBlightPercent}%)`],
  datasets: [
    {
      data: [healthyCount, earlyBlightCount, lateBlightCount, spotBlightCount],
      backgroundColor: [
        '#22c55e', // 绿色 - 健康
        '#ef4444', // 红色 - 早疫病
        '#f97316', // 橙色 - 晚疫病
        '#eab308', // 黄色 - 斑点病
      ],
      borderColor: [
        '#ffffff',
        '#ffffff',
        '#ffffff',
        '#ffffff',
      ],
      borderWidth: 2,
      hoverOffset: 15,
    },
  ],
};

const chartOptions = {
  plugins: {
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 12,
        },
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    title: {
      display: true,
      text: '病害分布',
      font: {
        size: 16,
        weight: 'bold',
      },
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.raw || 0;
          const percentage = Math.round((value / totalRecords) * 100);
          return `${label.split(' ')[0]}: ${value}个 (${percentage}%)`;
        }
      }
    }
  },
  cutout: '65%',
  maintainAspectRatio: false,
  animation: {
    animateScale: true,
    animateRotate: true
  }
};

// 统计数据
const statsData = {
  healthRate: `${healthyPercent}%`,
  diseaseCount: totalRecords - healthyCount,
  todayDetections: detectionRecords.filter(record => {
    const recordDate = new Date(record.timestamp);
    const today = new Date();
    return recordDate.toDateString() === today.toDateString();
  }).length,
};
  
const filteredRecords = detectionRecords.filter(record => {
  // 将时间戳转换为日期对象
  const recordDate = new Date(record.timestamp);
  recordDate.setHours(0, 0, 0, 0);

  const matchDisease = diseaseFilter === 'all' || record.result === diseaseFilter;
  const matchArea = areaFilter === 'all' || record.location.includes(areaFilter.slice(-1));

  let matchDate = true;
  if (dateFilter === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    matchDate = recordDate.getTime() === today.getTime();
  } else if (dateFilter === 'week') {
    matchDate = recordDate >= startOfWeek;
  } else if (dateFilter === 'month') {
    matchDate = recordDate >= startOfMonth;
  }

  return matchDisease && matchArea && matchDate;
});

  
  // 处理图片点击
  const handleImageClick = (image, status) => {
    setSelectedImage({ image, status });
  };

  // 关闭图片预览
  const closeImagePreview = () => {
    setSelectedImage(null);
  };
  
  return (
    <div className="space-y-4">
      {/* 主要内容区域 - 左右布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧 - 历史记录表格 */}
        <div className="lg:col-span-2">
          {/* 筛选控件 - 放置到检测记录上方 */}
          <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
            <div className="flex flex-wrap gap-3">
              {/* 日期筛选 */}
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="all">全部</option>
                  <option value="today">本日</option>
                  <option value="week">本周</option>
                  <option value="month">本月</option>
                </select>
              </div>
              
              {/* 病害筛选 */}
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">病害类型</label>
                <select
                  value={diseaseFilter}
                  onChange={(e) => setDiseaseFilter(e.target.value)}
                  className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="all">所有病害</option>
                  <option value="健康">健康</option>
                  <option value="早疫病">早疫病</option>
                  <option value="晚疫病">晚疫病</option>
                  <option value="斑点病">斑点病</option>
                </select>
              </div>
              
              {/* 区域筛选 */}
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">区域</label>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="all">所有区域</option>
                  <option value="区域A">A区</option>
                  <option value="区域B">B区</option>
                  <option value="区域C">C区</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm h-full">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">检测记录</h2>
            </div>
            <div className="overflow-x-auto max-h-[calc(100vh-230px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">区域</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">检测结果</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">置信度</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">图片</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">A区</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${record.result === '健康' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}`}
                        >
                          {record.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.confidence}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="h-12 w-12 rounded-md overflow-hidden cursor-pointer hover:opacity-80 hover:shadow-md transition-all"
                          onClick={() => handleImageClick(`http://localhost:5000${record.image_url}`, record.result)}
                        >
                          <img 
                            src={`http://localhost:5000${record.image_url}`} 
                            alt={`${record.status}图片`} 
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=叶片'; }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* 右侧 - 统计信息和图表 */}
        <div>
          <div className="space-y-4">
            {/* 上部分 - 统计卡片，使用flex改为一行三列 */}
            <div className="grid grid-cols-3 gap-3">
              {/* 健康率 */}
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-green-100 mb-1">
                    <BeakerIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-xs font-medium text-gray-500 text-center">健康率</h3>
                  <p className="text-xl font-bold text-gray-900">{statsData.healthRate}</p>
                </div>
              </div>
              
              {/* 病害数 */}
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-red-100 mb-1">
                    <CalendarIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-xs font-medium text-gray-500 text-center">病害数</h3>
                  <p className="text-xl font-bold text-gray-900">{statsData.diseaseCount}</p>
                </div>
              </div>
              
              {/* 今日检测数 */}
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-blue-100 mb-1">
                    <MapPinIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xs font-medium text-gray-500 text-center">今日检测</h3>
                  <p className="text-xl font-bold text-gray-900">{statsData.todayDetections}</p>
                </div>
              </div>
            </div>
            
            {/* 下部分 - 病害分布饼图 */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="h-80">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
              <div className="mt-3 text-xs text-center text-gray-500">
                总检测样本: {totalRecords}个
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图片预览模态框 */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-3xl w-full">
            <div className="absolute top-0 right-0 m-4">
              <button 
                onClick={closeImagePreview}
                className="bg-white rounded-full p-2 hover:bg-gray-200 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6 text-gray-800" />
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="mb-2 text-lg font-medium">{selectedImage.status} 图片</div>
              <div className="overflow-hidden rounded-lg">
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.status} 
                  className="w-full h-auto object-contain max-h-[70vh]"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=无法加载图片'; }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History; 