# from flask import Flask, request, jsonify
# import random

# app = Flask(__name__)

# @app.route('/api/operation/ndvi', methods=['GET'])
# def calculate_ndvi():
#     # 从请求中获取参数
#     red_band_id = request.args.get('redBandId')
#     nir_band_id = request.args.get('nirBandId')

#     # 参数检查
#     if not red_band_id or not nir_band_id:
#         return jsonify({"error": "参数 redBandId 和 nirBandId 是必须的"}), 400

#     try:
#         red_band_id = int(red_band_id)
#         nir_band_id = int(nir_band_id)
#     except ValueError:
#         return jsonify({"error": "参数必须是整数"}), 400

#     # 假设我们使用假数据做 NDVI 计算（真实计算应用图像数据）
#     # NDVI = (NIR - RED) / (NIR + RED)
#     RED = random.uniform(0.1, 0.9)  # 模拟 RED 波段反射率
#     NIR = random.uniform(0.1, 0.9)  # 模拟 NIR 波段反射率
#     ndvi = (NIR - RED) / (NIR + RED)

#     return jsonify({
#         "redBandId": red_band_id,
#         "nirBandId": nir_band_id,
#         "RED": round(RED, 3),
#         "NIR": round(NIR, 3),
#         "NDVI": round(ndvi, 3)
#     })

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)
