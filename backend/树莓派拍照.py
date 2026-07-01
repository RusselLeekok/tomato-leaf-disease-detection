from flask import Flask, jsonify
import cv2
import os
from detection_model import detect_disease  # 你写的检测函数

app = Flask(__name__)

@app.route('/capture', methods=['GET'])
def capture_image():
    # 打开摄像头
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()

    if not ret:
        return jsonify({'status': 'fail', 'message': 'Failed to capture image'})

    # 保存图像
    img_path = 'captured.jpg'
    cv2.imwrite(img_path, frame)

    return jsonify({
        'status': 'success',
        'message': 'Image captured and processed',
        'result': result  # 比如：'Tomato Leaf Mold'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
