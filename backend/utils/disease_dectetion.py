import tensorflow as tf
import numpy as np
from PIL import Image
import os
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input

# 定义常量
IMAGE_SIZE = 224
CLASS_NAMES = [
    "Tomato_Bacterial_Spot",
    "Tomato_Early_Blight",
    "Tomato_Late_Blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_Leaf_Spot",
    "Tomato_Spider_Mites",
    "Tomato_Target_Spot",
    "Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato_mosaic_virus",
    "Tomato_Healthy"
]

# 获取当前文件所在目录
current_dir = os.path.dirname(os.path.abspath(__file__))
# 构建模型文件的完整路径
model_path = os.path.join(current_dir, '..', 'models', 'best_model.keras')

# 加载模型
model = tf.keras.models.load_model(model_path)

def preprocess_image(image_path, target_size=(IMAGE_SIZE, IMAGE_SIZE)):
    img = Image.open(image_path).convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict_tomato_disease(image_path):
    img_array = preprocess_image(image_path)
    predictions = model.predict(img_array)
    predicted_index = np.argmax(predictions, axis=1)[0]
    predicted_label = CLASS_NAMES[predicted_index]
    confidence = predictions[0][predicted_index]
    return predicted_label, confidence
