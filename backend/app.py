from flask import Flask, Response, jsonify, request,send_from_directory
from flask_cors import CORS
# from utils.video_stream import generate_mjpeg, receive_frames
from utils.read_result import read_detection_results
from utils.save_result import save_prediction_to_history
from utils.disease_dectetion import predict_tomato_disease
import time
import cv2
import numpy as np
import os
import threading
from datetime import datetime
import socket



app = Flask(__name__)
CORS(app)

# 创建线程锁
lock = threading.Lock()

#----------------------------------------

# 用于保存最新帧
latest_frame = None

# Socket 接收线程
def receive_frames():
    global latest_frame
    server_socket = socket.socket()
    server_socket.bind(('0.0.0.0', 8000))
    server_socket.listen(0)
    print('[接收线程] 等待连接中...')
    connection, addr = server_socket.accept()
    conn = connection.makefile('rb')
    print('[接收线程] 已连接:', addr)

    try:
        while True:
            # 读取长度
            length_bytes = conn.read(4)
            if not length_bytes:
                break
            length = int.from_bytes(length_bytes, 'big')
            # 读取 JPEG 数据
            jpeg_data = conn.read(length)
            frame = cv2.imdecode(np.frombuffer(jpeg_data, dtype=np.uint8), cv2.IMREAD_COLOR)
            if frame is not None:
                # 更新最新帧
                with lock:
                    latest_frame = frame
                    # print(f"[接收线程] 收到帧: {frame.shape}")
    finally:
        print('[接收线程] 连接关闭')
        conn.close()
        connection.close()
        server_socket.close()

# MJPEG 流生成函数
def generate_mjpeg():
    global latest_frame
    while True:
        with lock:
            if latest_frame is None:
                continue
            # 编码为 JPEG
            ret, jpeg = cv2.imencode('.jpg', latest_frame)
            if not ret:
                continue
            frame_bytes = jpeg.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


#----------------------------------------------------------------------------------
# 全局变量
latest_frame = None

# 设置图片存储的物理路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 当前 app.py 所在目录
STATIC_DIR = os.path.join(BASE_DIR, 'static')    
IMAGE_FOLDER = STATIC_DIR  # 统一使用同一个路径




# 路由来提供图片文件
@app.route('/static/<path:filename>')
def serve_image(filename):
    return send_from_directory(IMAGE_FOLDER, filename)


@app.route('/api/dashboard', methods=['GET'])
def get_results():
    records = read_detection_results()
    response = {
        "detection_records": records
    }
    return jsonify(response)


@app.route('/api/detect', methods=['POST'])
def detect_disease():
    global latest_frame
    print('[后端] 收到检测请求！')  
    with lock:
        if latest_frame is None:
            print('[后端] 错误：没有可用的视频帧')
            return jsonify({'success': False, 'message': '没有可用的视频帧'}), 400

        # 保存当前帧为图片（带时间戳）
        timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        filename = f"captured_{timestamp}.jpg"
        save_path = os.path.join(STATIC_DIR, filename)
        print(f'[后端] 尝试保存图片到: {save_path}')
        
        os.makedirs(STATIC_DIR, exist_ok=True) 
        success = cv2.imwrite(save_path, latest_frame)
        if not success:
            print(f'[后端] 错误：保存图片失败')
            return jsonify({'success': False, 'message': '保存图片失败'}), 500
            
        print(f'[后端] 图片保存成功')
        image_url = f'/static/{filename}'

        result, confidence = predict_tomato_disease(save_path)
        print(confidence)
        print(result)
        confidence = int(float(confidence) * 100)
        save_prediction_to_history(result, confidence, image_url, timestamp)

        return jsonify({
            'result': result,
            'confidence': confidence,
            'timestamp': timestamp,
            'image_url': f'/static/{filename}'
        })
        

@app.route('/api/stream/video_feed')
def video_feed():
    return Response(generate_mjpeg(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


# 启动接收线程并运行 Flask
if __name__ == '__main__':
    # 启动 socket 接收线程
    t = threading.Thread(target=receive_frames, daemon=True)
    t.start()

    # 启动 Flask
    app.run(host='0.0.0.0', port=5000, threaded=True)