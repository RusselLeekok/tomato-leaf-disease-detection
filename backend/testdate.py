from datetime import datetime
import os

# 设置图片存储的物理路径
IMAGE_FOLDER = 'tomoto_leaf/backend/static'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 当前 app.py 所在目录
STATIC_DIR = os.path.join(BASE_DIR, 'static')   

print(STATIC_DIR)