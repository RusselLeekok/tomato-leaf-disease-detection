import socket
import cv2
import numpy
import time

# 设置服务端 IP 和端口
address = ('192.168.31.61', 8002)

# 创建 socket 连接
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(address)

# 打开摄像头
capture = cv2.VideoCapture(0)
encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 95]  # 图像压缩质量

while True:
    time.sleep(0.01)
    ret, frame = capture.read()
    if ret == 0:
        break

    # 编码图像为 .jpg 格式
    result, data_encode = cv2.imencode('.jpg', frame, encode_param)
    if not result:
        continue

    # 转为 numpy 和字节流
    data = numpy.array(data_encode)
    types_data = data.tobytes()

    # 先发长度（16字节，左对齐）
    sock.send(str.encode(str(len(types_data)).ljust(16)))

    # 再发图像数据
    sock.send(types_data)

# 清理资源
capture.release()
sock.close()
