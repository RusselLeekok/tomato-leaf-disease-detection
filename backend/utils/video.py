import socket
import cv2
import numpy
import time

class ReciveVideo:
    
    def __init__(self):
        
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM,0)
        address = ('0.0.0.0', 8002)
        self.s.bind(address)
        self.s.listen(127)
        
    def run(self):
        conn, addr = self.s.accept()
        print('connected by'+ str(addr))
        
        while True:
            start = time.time()
            length = self.receive_all(conn, 16)
            video_data = self.receive_all(conn, int(length))#根据图片文件长度获取图片文件
            data = numpy.frombuffer(video_data, dtype=numpy.uint8)
            video_image = cv2.imdecode(data,cv2.IMREAD_COLOR)
            cv2.imshow('video', video_image)
            
        end = time.time()
        seconds = end - start
        fps = 1 / seconds
        print("fps",fps)
        
        #按下ESC键退出
        k = cv2.waitKey(10) & 0xFF
        if k == 27:
            conn.close()
            self.close()
            
    def close(self):
        self.s.close()
        cv2.destroyAllWindows()
        
    @staticmethod
    def receive_all(sock, length):
        data = b''
        while len(data) < length:
            packet = sock.recv(length - len(data))
            if not packet:
                return None
            data += packet
        return data
if __name__ == '__main__':
    video = ReciveVideo()
    video.run()
        

        