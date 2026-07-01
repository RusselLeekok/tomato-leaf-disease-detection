#采用http与树莓派通信
import requests
from requests.exceptions import RequestException

class ApiHelper:
    def __init__(self,base_url):
        self.base_url = base_url
        
    #开启视频流
    def start_stream(self):
        try:
            response = requests.get(f"{self.base_url}/start_stream")
            response.raise_for_status() 
            return response.json()  # 返回 JSON 响应
        except RequestException as e:
            raise Exception(f"Error starting stream: {e}")
    #停止视频流
    def stop_stream(self):
        try:
            response = requests.get(f"{self.base_url}/stop_stream")
            response.raise_for_status() 
            return response.json()  
        except RequestException as e:
            raise Exception(f"Error stopping stream: {e}")
    #拍照
    def capture_image(self):
        try:
            response = requests.get(f"{self.base_url}/capture")
            response.raise_for_status() 
            return response.content # 返回图片二进制数据
        except RequestException as e:
            raise Exception(f"Error capturing image: {e}")
  
        