import React, { useState } from 'react';
import { 
  CheckIcon,
  XMarkIcon,
  BellIcon,
  ClockIcon,
  CameraIcon,
  WrenchIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoDetectionInterval, setAutoDetectionInterval] = useState('15');
  const [nightModeEnabled, setNightModeEnabled] = useState(false);
  const [imageQuality, setImageQuality] = useState('medium');
  const [detectionStartTime, setDetectionStartTime] = useState('08:00');
  const [detectionEndTime, setDetectionEndTime] = useState('18:00');
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [alertEmail, setAlertEmail] = useState('admin@example.com');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  
  const startEditingEmail = () => {
    setNewEmail(alertEmail);
    setIsEditingEmail(true);
  };
  
  const saveNewEmail = () => {
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setAlertEmail(newEmail);
      setIsEditingEmail(false);
    }
  };
  
  const cancelEditEmail = () => {
    setIsEditingEmail(false);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">设置</h1>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">检测设置</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {/* 自动检测间隔（检测频率） */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-start">
              <div className="mr-3 p-2 bg-primary/10 rounded-lg">
                <ClockIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">检测频率</h3>
                <p className="text-sm text-gray-500">控制系统自动进行叶病害检测的时间间隔</p>
              </div>
            </div>
            <div className="w-24">
              <select
                value={autoDetectionInterval}
                onChange={(e) => setAutoDetectionInterval(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
              >
                <option value="5">5分钟</option>
                <option value="15">15分钟</option>
                <option value="30">30分钟</option>
                <option value="60">1小时</option>
                <option value="120">2小时</option>
              </select>
            </div>
          </div>
          
          {/* 检测时间段设置 */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-start">
              <div className="mr-3 p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">检测时间段</h3>
                <p className="text-sm text-gray-500">设置每天进行检测的时间范围</p>
              </div>
            </div>
            <div className="flex space-x-2 items-center">
              <input
                type="time"
                value={detectionStartTime}
                onChange={(e) => setDetectionStartTime(e.target.value)}
                className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
              />
              <span className="text-gray-500">至</span>
              <input
                type="time"
                value={detectionEndTime}
                onChange={(e) => setDetectionEndTime(e.target.value)}
                className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          </div>
          
          {/* 报警置信度阈值 */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-start">
              <div className="mr-3 p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">报警置信度阈值</h3>
                <p className="text-sm text-gray-500">当病害检测置信度超过此值时触发报警</p>
              </div>
            </div>
            <div className="w-56">
              <div className="flex items-center">
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                  className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-3 w-10 text-sm font-medium text-gray-700">{confidenceThreshold}%</span>
              </div>
            </div>
          </div>
          
          
          {/* 通知 */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-start">
              <div className="mr-3 p-2 bg-yellow-100 rounded-lg">
                <BellIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">通知设置</h3>
                <p className="text-sm text-gray-500">当检测到病害时接收通知提醒</p>
              </div>
            </div>
            <div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  notificationsEnabled ? 'bg-primary' : 'bg-gray-200'
                }`}
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          {/* 报警邮箱设置 */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-start">
              <div className="mr-3 p-2 bg-indigo-100 rounded-lg">
                <EnvelopeIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">报警邮箱</h3>
                <p className="text-sm text-gray-500">接收病害报警通知的邮箱地址</p>
              </div>
            </div>
            {isEditingEmail ? (
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="block w-56 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  placeholder="请输入邮箱"
                />
                <button
                  onClick={saveNewEmail}
                  className="p-2 text-white bg-primary rounded-md hover:bg-green-600"
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={cancelEditEmail}
                  className="p-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">{alertEmail}</span>
                <button
                  onClick={startEditingEmail}
                  className="text-secondary hover:text-blue-700 text-sm"
                >
                  更改
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 系统设置 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">系统设置</h2>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="device-name" className="block text-sm font-medium text-gray-700 mb-1">
                设备名称
              </label>
              <input
                type="text"
                id="device-name"
                placeholder="叶病害检测设备"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                位置信息
              </label>
              <input
                type="text"
                id="location"
                placeholder="温室A区"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          </div>
          
          
          <div className="mt-4 flex space-x-3">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 flex items-center">
              <CheckIcon className="w-5 h-5 mr-2" />
              保存设置
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
              <XMarkIcon className="w-5 h-5 mr-2" />
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 