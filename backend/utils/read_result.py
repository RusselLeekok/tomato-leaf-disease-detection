# utils/read_result.py
import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(BASE_DIR, 'static', 'history.json')

def read_detection_results():
    """读取检测结果数据，返回所有结果记录"""
    if not os.path.exists(DATA_FILE):
        print(f"Data file {DATA_FILE} does not exist.")
        return []
    
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data 
    except Exception as e:
        print(f"Error reading detection results: {str(e)}")
        return []

    
# def test_read_results():
#     results = read_detection_results()
    
#     for result in results:
#         print(result)

# if __name__ == "__main__":
#     test_read_results()
    
    