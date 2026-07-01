import json
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
history_path = os.path.join(BASE_DIR, 'static', 'history.json')

def save_prediction_to_history(result, confidence, image_url, timestamp):


    # 创建新的记录
    new_record = {
        "result": result,
        "confidence": confidence,
        "image_url": image_url,
        "timestamp": timestamp
    }

    # 读取已有内容，如果没有就创建一个空列表
    if os.path.exists(history_path):
        with open(history_path, 'r', encoding='utf-8') as file:
            try:
                history_data = json.load(file)
            except json.JSONDecodeError:
                history_data = []
    else:
        history_data = []

    # 添加新记录
    history_data.append(new_record)

    # 写回 JSON 文件
    with open(history_path, 'w', encoding='utf-8') as file:
        json.dump(history_data, file, ensure_ascii=False, indent=4)

    print("✅ 预测结果已保存到 history.json")
    
# def test_save_prediction_to_history():
#     test_result = "Tomato_Early_Blight"
#     test_confidence = 0.9321
#     test_image_path = "test_images/test_leaf.jpg"
#     test_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

#     save_prediction_to_history(test_result, test_confidence, test_image_path, test_timestamp)

#     print("🧪 测试写入完成，请检查 static/history.json 文件是否包含此条记录。")

# # 调用测试函数
# if __name__ == "__main__":
#     test_save_prediction_to_history()
