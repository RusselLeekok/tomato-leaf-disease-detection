from flask import Flask, Response, render_template
import threading
import socket
import numpy as np
import cv2

app = Flask(__name__)

# 用于保存最新帧
latest_frame = None
lock = threading.Lock()

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