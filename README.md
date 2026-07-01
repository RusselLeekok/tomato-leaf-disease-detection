# Tomato Leaf Disease Detection

一个基于 Flask、React 和 TensorFlow 的番茄叶片病害识别系统。项目包含 Web 管理界面、实时视频流展示、病害检测接口、历史记录展示，以及用于树莓派摄像头采集画面的示例脚本。

## 功能特性

- 实时摄像头画面展示
- 番茄叶片病害识别
- 检测结果置信度展示
- 历史检测记录查询
- 检测图片静态访问
- 树莓派摄像头采集脚本示例

## 技术栈

后端：

- Python
- Flask
- Flask-CORS
- OpenCV
- TensorFlow / Keras
- Pillow

前端：

- React 18
- React Router
- Axios
- Tailwind CSS
- Chart.js
- Heroicons

## 项目结构

```text
tomato_leaf/
├── backend/
│   ├── app.py                    # Flask 后端入口
│   ├── requirements.txt          # 后端依赖
│   ├── models/                   # Keras 模型文件
│   ├── static/                   # 检测图片和历史记录
│   ├── utils/                    # 识别、读写记录、视频相关工具
│   ├── 树莓派客户端.py             # 树莓派视频推流示例
│   └── 树莓派拍照.py               # 树莓派拍照示例
└── frontend/
    ├── package.json              # 前端依赖和脚本
    ├── public/
    └── src/
        ├── components/           # 页面布局组件
        ├── pages/                # Dashboard、History、Settings 页面
        └── assets/               # 前端图片资源
```

## 环境要求

建议环境：

- Python 3.10
- Node.js 18 或更高版本
- npm

说明：当前后端依赖中包含较老版本的 `numpy` 和 OpenCV，建议优先使用 Python 3.10 创建虚拟环境。

## 后端启动

进入后端目录：

```powershell
cd D:\tomato_leaf\backend
```

创建并激活虚拟环境：

```powershell
py -3.10 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

安装依赖：

```powershell
python -m pip install -r requirements.txt
python -m pip install tensorflow
```

启动后端服务：

```powershell
python app.py
```

后端默认地址：

```text
http://localhost:5000
```

后端启动后会同时监听：

- `5000`：Flask API 服务
- `8000`：摄像头视频帧 socket 接收端口

## 前端启动

进入前端目录：

```powershell
cd D:\tomato_leaf\frontend
```

安装依赖：

```powershell
npm.cmd install
```

启动开发服务器：

```powershell
npm.cmd start
```

前端默认地址：

```text
http://localhost:3000
```

如果在 PowerShell 中直接运行 `npm` 报执行策略错误，可以使用 `npm.cmd`。

## API 简介

### 获取检测记录

```http
GET /api/dashboard
```

返回 `static/history.json` 中保存的检测记录。

### 执行病害检测

```http
POST /api/detect
```

使用当前接收到的视频帧进行识别，保存图片，并写入历史记录。

### 获取实时视频流

```http
GET /api/stream/video_feed
```

返回 MJPEG 视频流，供前端摄像头区域展示。

### 访问静态图片

```http
GET /static/<filename>
```

访问检测过程中保存的图片。

## 树莓派摄像头联调

项目中包含树莓派采集脚本：

```text
backend/树莓派客户端.py
```

该脚本用于从摄像头读取画面，并通过 socket 发送给后端。

注意：当前后端 `app.py` 中的视频接收逻辑监听 `8000`，并按 4 字节 big-endian 读取图片长度；而示例树莓派客户端中使用的是 `8002`，并发送 16 字节文本长度。真实联调前需要统一端口和传输协议，否则后端无法正确接收视频帧。


## 生产构建

前端生产构建：

```powershell
cd D:\tomato_leaf\frontend
npm.cmd run build
```

构建产物会输出到：

```text
frontend/build/
```

后端生产部署可以使用 Gunicorn 等 WSGI 服务。不过 Windows 本地开发时，直接使用 `python app.py` 即可。

## 备注

- 模型文件位于 `backend/models/`。
- 检测历史记录保存在 `backend/static/history.json`。
- 新检测图片会保存到 `backend/static/`。
- 前端 API 地址目前写死为 `http://localhost:5000`，如需部署到服务器，需同步修改前端接口地址。
