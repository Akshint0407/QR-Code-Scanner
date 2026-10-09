import os
import shutil
import cv2
import warnings
warnings.filterwarnings('ignore')
import zxingcpp
from pyzbar.pyzbar import decode as pyzbar_decode
from ultralytics import YOLO
import numpy as np

# ================= CONFIG =================
dataset    = r"C:\Users\akshint\Desktop\QR final\dataset"
model_path = r"C:\Users\akshint\Desktop\QR final\runs\detect\akshint-varma\train\weights\best.pt"

detected_folder = r"C:\Users\akshint\Desktop\QR final\beast\detected"
decoded_folder  = r"C:\Users\akshint\Desktop\QR final\beast\decoded"
not_decoded_folder = r"C:\Users\akshint\Desktop\QR final\beast\not_decoded"   # <-- NEW
not_detected_folder = r"C:\Users\akshint\Desktop\QR final\beast\not_detected" # <-- NEW (bonus)
output_file     = r"C:\Users\akshint\Desktop\QR final\beast\results.txt"

# WeChat model files (from opencv-contrib wechat_qrcode models)
wechat_detect_prototxt = r"C:\Users\akshint\Desktop\QR final\wechatfinal\detect.prototxt"
wechat_detect_caffemodel = r"C:\Users\akshint\Desktop\QR final\wechatfinal\detect.caffemodel"
wechat_sr_prototxt = r"C:\Users\akshint\Desktop\QR final\wechatfinal\sr.prototxt"
wechat_sr_caffemodel = r"C:\Users\akshint\Desktop\QR final\wechatfinal\sr.caffemodel"
# ==========================================

# Clear output folders
for folder in (detected_folder, decoded_folder, not_decoded_folder, not_detected_folder):
    if os.path.exists(folder):
        shutil.rmtree(folder)
    os.makedirs(folder, exist_ok=True)

extensions = (".jpg", ".png", ".jpeg")
img_paths = [os.path.join(dataset, f) for f in os.listdir(dataset) if f.lower().endswith(extensions)]
total_images = len(img_paths)
print(f"Total Images : {total_images}")

# ---- Load engines ----
model = YOLO(model_path)
wechat = cv2.wechat_qrcode_WeChatQRCode(
    wechat_detect_prototxt, wechat_detect_caffemodel,
    wechat_sr_prototxt, wechat_sr_caffemodel
)
qr_detector_cv = cv2.QRCodeDetectorAruco()

# ============ DECODERS (priority order: zxing > wechat > pyzbar > opencv) ============

def dec_zxing(gray):
    return [r.text for r in zxingcpp.read_barcodes(gray, zxingcpp.BarcodeFormat.QRCode,
            try_rotate=True, try_downscale=True) if r.text]

def dec_wechat(bgr):
    texts, _ = wechat.detectAndDecode(bgr)
    return [t for t in texts if t]

def dec_pyzbar(gray):
    return [o.data.decode("utf-8", "replace") for o in pyzbar_decode(gray) if o.data]

def dec_opencv(gray):
    # Validate input: reject None, empty, tiny, or wrong-format images
    if gray is None or gray.size == 0:
        return []
    if gray.ndim == 3:
        gray = cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY)
    if gray.dtype != np.uint8:
        gray = gray.astype(np.uint8)
    if gray.shape[0] < 50 or gray.shape[1] < 50:
        return []

    try:
        retval, decoded_info, _, _ = qr_detector_cv.detectAndDecodeMulti(gray)
        return [t for t in decoded_info if t] if retval else []
    except cv2.error:
        # detectAndDecodeMulti can crash on certain inputs (kmeans bug)
        # fall back to the more stable single-QR detector
        try:
            text, _, _ = qr_detector_cv.detectAndDecode(gray)
            return [text] if text else []
        except cv2.error:
            return []



def var_sharpen(gray):
    """Unsharp mask — fixes mild/general blur. Strongest cheap fix."""
    blur = cv2.GaussianBlur(gray, (0, 0), 2.0)
    return cv2.addWeighted(gray, 1.8, blur, -0.8, 0)

def var_sharpen_strong(gray):
    """Stronger unsharp — for heavier blur."""
    blur = cv2.GaussianBlur(gray, (0, 0), 4.0)
    return cv2.addWeighted(gray, 2.2, blur, -1.2, 0)

def var_sharpen2d(gray):
    """Classic sharpening kernel — crisper module edges than unsharp sometimes."""
    kernel = np.array([[-1, -1, -1],
                    [-1,  9, -1],
                    [-1, -1, -1]])
    return cv2.filter2D(gray, -1, kernel)

def var_clahe(gray):
    """Low contrast / washed out images (helps when blur + bad lighting mix)."""
    return cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8)).apply(gray)

def var_clahe_boost(gray):
    """CLAHE with extra brightness lift."""
    clahe = cv2.createCLAHE(clipLimit=5.0)
    return np.clip(clahe.apply(gray) + 30, 0, 255).astype(np.uint8)

def var_threshold(gray):
    """Fixed binary threshold — for high-contrast/faint-print cases."""
    _, th = cv2.threshold(gray, 155, 255, cv2.THRESH_BINARY)
    return th


def decode_image(bgr):
    """Run the decoder cascade on an image. Returns list of decoded texts (deduped, order preserved).
    Stops at the first decoder that produces a result."""
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)        
    texts = dec_zxing(gray)
    if texts: return texts, "original"
    texts = dec_wechat(bgr)
    if texts: return texts, "original"
    texts = dec_pyzbar(gray)
    if texts: return texts, "original"
    texts = dec_opencv(gray)
    if texts: return texts, "original"


    # --- Tier 2: variants, ONLY because everything above failed ---
    h, w = gray.shape

    variants = [
        var_sharpen(gray),
        var_sharpen2d(gray),
        var_sharpen_strong(gray),
        var_clahe(gray),
        var_clahe_boost(gray),      # new
        var_threshold(gray), 
    ]
    if max(h, w) < 300:
        big = cv2.resize(gray, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
        variants.insert(0, var_sharpen(big))   # upscale THEN sharpen

    for variant in variants:
        texts = dec_zxing(variant)
        if texts:
            return texts, "variant"
        texts = dec_pyzbar(variant)
        if texts:
            return texts, "variant"
        texts = dec_opencv(variant)
        if texts:
            return texts, "variant"
        texts = dec_wechat(cv2.cvtColor(variant, cv2.COLOR_GRAY2BGR))
        if texts:
            return texts, "variant"
    return [], "none"


# NEW: draw YOLO boxes on the image so you can see exactly what failed to decode
def save_with_boxes(img, boxes_xyxy, save_path, tag="NOT-DECODED"):
    vis = img.copy()
    for box in boxes_xyxy:
        x1, y1, x2, y2 = map(int, box)
        cv2.rectangle(vis, (x1, y1), (x2, y2), (0, 0, 255), 3)
        cv2.putText(vis, tag, (x1, max(25, y1 - 8)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
    cv2.imwrite(save_path, vis)

# ============ MAIN LOOP ============

detected = 0
not_detected = 0
decoded = 0
not_decoded = 0

decoder_hits = {"zxing": 0, "wechat": 0, "pyzbar": 0, "opencv": 0}
fallback_saves = 0  # images decoded only via the full-image fallback
variant_saves = 0   # add next to fallback_saves


for img_path in img_paths:
    img = cv2.imread(img_path)
    img_name = os.path.basename(img_path)
    if img is None:
        continue

    # ---- Stage 1: YOLO detection ----
    results = model.predict(img, imgsz=640, conf=0.60, verbose=False, max_det = 61, iou = 0.6)
    boxes = results[0].boxes

    decoded_texts = []
    decoded_source = "none"
    found_qr = False
    used_decoder = None

    if boxes is not None and len(boxes) > 0:
        found_qr = True
        h, w = img.shape[:2]

        for box in boxes.xyxy:
            x1, y1, x2, y2 = map(int, box)
            pad = int(0.25 * max(x2 - x1, y2 - y1))
            x1, y1 = max(0, x1 - pad), max(0, y1 - pad)
            x2, y2 = min(w, x2 + pad), min(h, y2 + pad)

            roi = img[y1:y2, x1:x2]
            texts, source = decode_image(roi)
            if texts:
                decoded_texts = texts
                decoded_source = source
                break

    # ---- Stage 2: fallback cascade on the full image ----
    if not decoded_texts:
        texts, source = decode_image(img)
        decoded_source = None
        if texts:
            decoded_texts = texts
            decoded_source = source
            if found_qr:
                fallback_saves += 1   # YOLO saw it, but only the full image decoded
            else:
                found_qr = True       # decoder found the QR even though YOLO missed it

    # ---- Bookkeeping ----
    if found_qr:
        detected += 1
        shutil.copy(img_path, os.path.join(detected_folder, img_name))

        if decoded_texts:
            decoded += 1
            shutil.copy(img_path, os.path.join(decoded_folder, img_name))
            if decoded_source == "variant":
                variant_saves += 1
            print(f"[{img_name}] Decoded: {decoded_texts[0]}")
        else:
            not_decoded += 1
            boxes_xyxy = boxes.xyxy.cpu().numpy() if (boxes is not None and len(boxes)) else []
            save_with_boxes(img, boxes_xyxy, os.path.join(not_decoded_folder, img_name))
            print(f"[{img_name}] NOT DECODED -> saved to not_decoded/")


    else:
        not_detected += 1
        # NEW: also save these so you can check if YOLO genuinely missed a visible QR
        shutil.copy(img_path, os.path.join(not_detected_folder, img_name))
        print(f"[{img_name}] NOT DETECTED -> saved to not_detected/")

detected_accuracy = (detected / total_images) * 100
decoded_accuracy  = (decoded / detected) * 100 if detected else 0
overall_decode    = (decoded / total_images) * 100

print("\n========== BEAST RESULTS ==========")
print(f"Total Images        : {total_images}")
print(f"Detected            : {detected}")
print(f"Not Detected        : {not_detected}")
print(f"Decoded             : {decoded}")
print(f"Not Decoded         : {not_decoded}")
print(f"Detector Accuracy   : {detected_accuracy:.2f}%")
print(f"Decoder Accuracy    : {decoded_accuracy:.2f}%")
print(f"Overall Decode Rate : {overall_decode:.2f}%")
print(f"Fallback saves      : {fallback_saves}")
print(f"Variant saves       : {variant_saves}")

with open(output_file, "w") as f:
    f.write("Results for THE BEAST (YOLO + zxing > wechat > pyzbar > opencv cascade)\n")
    f.write("----------------------\n")
    f.write(f"Total Images        : {total_images}\n")
    f.write(f"Detected            : {detected}\n")
    f.write(f"Not Detected        : {not_detected}\n")
    f.write(f"Decoded             : {decoded}\n")
    f.write(f"Not Decoded         : {not_decoded}\n")
    f.write(f"Detector Accuracy   : {detected_accuracy:.2f}%\n")
    f.write(f"Decoder Accuracy    : {decoded_accuracy:.2f}%\n")
    f.write(f"Overall Decode Rate : {overall_decode:.2f}%\n")
    f.write(f"Fallback saves      : {fallback_saves}\n")
    f.write(f"Variant saves       : {variant_saves}\n")