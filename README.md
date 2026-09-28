# 🔍 The Beast — QR Code Detection & Decoding Pipeline

A high-accuracy, fault-tolerant batch QR code scanner that combines a
custom-trained **YOLOv8 detector** with a **multi-engine decoder cascade**
and an **image-repair variant tier** — designed to squeeze maximum decode
rate out of real-world, damaged, blurry, and low-quality QR images.

---

## 📊 Results (on 3,686-image dataset)

| Metric | Baseline | With Variant Tier |
|---|---|---|
| Total images | 3,686 | 3,686 |
| Detected (YOLO + fallback) | 3,675 | 3,675 |
| **Detector accuracy** | **99.70%** | **99.70%** |
| Decoded | 2,049 | **2,285** |
| **Decoder accuracy** | ~55.6% | **62.18%** |
| **Overall decode rate** | 55.60% | **61.99%** |
| Fallback saves | 23 | 23 |
| Variant saves | — | 221 |

> The image-repair variant tier rescued **+236 images (+6.5 accuracy points)**
> over the baseline decoder cascade.

---

## 🏗️ Architecture

```
                        ┌─────────────────────┐
  Input image ────────► │  Stage 1: YOLOv8    │  custom-trained QR detector
                        │  conf=0.60, sz=640  │
                        └─────────┬───────────┘
                                  │ ROI crop + 25% padding (white)
                                  ▼
                        ┌─────────────────────┐
                        │  Decoder Cascade    │  zxing-cpp → WeChat QR
                        │  (Tier 1: original) │  → pyzbar → OpenCV
                        └─────────┬───────────┘
                                  │ fail
                                  ▼
                        ┌─────────────────────┐
                        │  Variant Tier       │  sharpen / CLAHE /
                        │  (Tier 2: repaired) │  upscale — cascade retried
                        └─────────┬───────────┘  per variant
                                  │ fail
                                  ▼
                        ┌─────────────────────┐
                        │  Full-image         │  decodes entire image,
                        │  fallback           │  catches YOLO misses
                        └─────────┬───────────┘
                                  ▼
                    detected/ | decoded/ | not_decoded/ | not_detected/
```

### Why the cascade works

No single decoder wins everywhere. zxing-cpp is the strongest general
decoder, but WeChat's CNN-based detector excels on small/distorted codes,
pyzbar handles some edge orientations, and OpenCV's detector occasionally
succeeds where all others fail. Running all four in priority order —
stopping at the first hit — maximizes coverage at minimal cost.

---

## 🛠️ Image-Repair Variants (Tier 2)

Applied only after all four decoders fail on the original ROI:

| Variant | Purpose |
|---|---|
| Unsharp mask (`σ=2.0`, 1.8/-0.8) | Mild/general blur — primary workhorse |
| Strong unsharp (`σ=4.0`, 2.2/-1.2) | Heavy blur |
| Classic sharpen kernel (9-point) | Crisper module edges |
| CLAHE (clip 3.0) | Low contrast / bad lighting |
| CLAHE boost (clip 5.0, +30 brightness) | Dark images |
| 3× upscale → sharpen (ROIs < 300 px) | Tiny QR codes — upscale **before** sharpening |

Each repaired image is re-run through the full 4-decoder cascade.

### Quiet-zone padding

YOLO boxes frequently crop the QR's mandatory white border (quiet zone),
which is a top cause of decode failure. Every ROI is expanded by
**25% padding** (white, value 255) before decoding.

---

## 📁 Output Structure

```
beast/
├── detected/        # every image where a QR was found (YOLO or decoder)
├── decoded/         # successfully decoded (subset of detected/)
├── not_decoded/     # QR found but unreadable — saved WITH YOLO boxes
│                    # drawn in red for visual failure analysis
├── not_detected/    # YOLO missed it AND decoders found nothing
└── results.txt      # full statistics summary
```

Console output logs each image's verdict and decoded content in real time.

---

## ⚙️ Configuration

All paths and thresholds are at the top of `QR scanner.py`:

| Setting | Value | Notes |
|---|---|---|
| `dataset` | `...\QR final\dataset` | input images (.jpg/.png/.jpeg) |
| `model_path` | `...\runs\detect\...\best.pt` | custom YOLO weights |
| WeChat model files | `detect.prototxt/.caffemodel`, `sr.prototxt/.caffemodel` | from opencv-contrib `wechat_qrcode` |
| YOLO params | `conf=0.60, imgsz=640, max_det=61, iou=0.6` | tuned for this dataset |
| Padding | `0.25 * max(box_w, box_h)` | quiet-zone restoration |

---

## 💻 Installation

**Requirements:** Python 3.9, Windows (pyzbar), Visual C++ Redistributable

```powershell
pip install -r requirements.txt
```

`requirements.txt`:

```text
opencv-contrib-python==4.10.0.84
numpy==1.26.4
pyzbar==0.1.9
zxing-cpp==2.2.2
ultralytics==8.3.40
torch==2.1.2
torchvision==0.16.2
```

> ⚠️ Use **`opencv-contrib-python` only** — it includes base OpenCV plus the
> `wechat_qrcode` module. Installing both `opencv-python` and
> `opencv-contrib-python` can cause `cv2` conflicts.
>
> ⚠️ NumPy is pinned to **1.26.4** — NumPy 2.x breaks older OpenCV/torch wheels.

Download the WeChat QR model files (detect.prototxt, detect.caffemodel,
sr.prototxt, sr.caffemodel) from the
[opencv_3rdparty wechat_qrcode branch](https://github.com/WeChatCV/opencv_3rdparty/tree/wechat_qrcode)
and place them in the configured `wechatfinal/` folder.

---

## 🚀 Usage

```powershell
python "QR scanner.py"
```

The script clears and recreates the output folders on every run, processes
all images in the dataset folder, prints live per-image results, and writes
final statistics to `results.txt`.

**Expected runtime:** slow on low-core CPUs (2 cores) — the variant tier
multiplies decode attempts per failure. Budget accordingly for full runs.

---

## 📈 Performance Notes & Tuning Lessons

- **Detection is solved** (99.70%); decoding is the bottleneck.
- **Upscale before sharpen** for small ROIs — not the reverse.
- **Padding ~25%** recovers most quiet-zone failures; going higher (35%)
  shrinks the QR's relative size and can hurt small codes — A/B test it.
- **Fallback saves are rare but real** (~0.6%) — the full-image pass catches
  YOLO localization failures cheaply; keep it.
- **Trim variants that never fire** to reclaim runtime on weak hardware.
- On 2-core machines, **adaptive variant selection** (score blur/contrast,
  apply only 2 relevant variants) beats multiprocessing (~1.7× cap).

---

## 🐞 Known Limitations

1. **Tilted QRs** (mild rotation + blur) are the largest remaining recoverable
   failure class — rotation variants are implemented but disabled pending
   stabilization.
2. **Genuinely damaged codes** (torn, missing corners) are an unreachable
   ceiling — expect a hard floor on decode rate.
3. `not_detected/` images (≈0.3%) are YOLO edge cases; augmentation-driven
   retraining could close the gap.

---

## 🗺️ Roadmap

- [ ] Stabilize + re-enable rotation variants (±15°/±30°, rotate+sharpen)
- [ ] A/B test padding 0.25 vs 0.35 on the not_decoded set
- [ ] Adaptive variant selection by image quality metrics
- [ ] Fine-tune YOLO on not_detected failures
- [ ] Parallelize decoding across available cores

---

## 📜 License & Credits

Built with: [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics),
[zxing-cpp](https://github.com/zxing-cpp/zxing-cpp),
[WeChat QR Code](https://github.com/WeChatCV/opencv_3rdparty) (via OpenCV contrib),
[pyzbar](https://github.com/NaturalHistoryMuseum/pyzbar), OpenCV.
