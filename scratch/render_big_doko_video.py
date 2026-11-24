import cv2
import numpy as np
import os
import subprocess
import imageio_ffmpeg
import shutil

def process_video():
    src_video = 'client/public/Bird_weaving_bamboo_basket_513ca55f_t0-8_1080p.mp4'
    cap = cv2.VideoCapture(src_video)
    if not cap.isOpened():
        raise FileNotFoundError(f"Cannot open {src_video}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Processing {total_frames} frames at {fps} fps...")

    # We want Doko to be GOOD AND BIG.
    # The original 1920x1080 has Doko situated between X: 250..1450, Y: 40..1040.
    # Let's crop X: 240..1440 (width 1200), Y: 40..1040 (height 1000).
    # Then resize to crisp 960x800 or 1080x900 for fast loading and ultra-sharp 1080p mobile rendering!
    out_w, out_h = 1080, 900

    # Target background gradient matching the landing page:
    # Top: #FBF8F0 (BGR: 240, 248, 251)
    # Bottom: #F2EADA (BGR: 218, 234, 242)
    bg = np.zeros((out_h, out_w, 3), dtype=np.float32)
    for y in range(out_h):
        t = y / float(out_h)
        col = np.array([240, 248, 251], dtype=np.float32) * (1.0 - t) + np.array([218, 234, 242], dtype=np.float32) * t
        bg[y, :] = col

    temp_dir = 'scratch/big_doko_frames'
    os.makedirs(temp_dir, exist_ok=True)

    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Crop tight around Doko and the doko basket
        crop = frame[40:1040, 240:1440]
        # Resize to out_w x out_h
        resized = cv2.resize(crop, (out_w, out_h), interpolation=cv2.INTER_LANCZOS4)

        # Composite using multiply blend on the exact landing background:
        # In the original video, the background is white [253..255].
        # In multiply blend: (resized / 255.0) * bg
        # This replaces the white background with the exact landing page gradient,
        # while keeping the ground contact shadows and vibrant colors of Doko!
        composited = ((resized.astype(np.float32) / 255.0) * bg).astype(np.uint8)

        # Save first frame as high-res poster
        if frame_idx == 0:
            cv2.imwrite('client/public/doko-landing-hero-poster.jpg', composited)
            cv2.imwrite('client/src/assets/images/doko-landing-hero-poster.jpg', composited)

        cv2.imwrite(f"{temp_dir}/frame_{frame_idx:04d}.png", composited)
        frame_idx += 1

    cap.release()
    print(f"Rendered {frame_idx} frames! Encoding to MP4 & WebM with FFmpeg...")

    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    out_mp4 = 'client/public/doko-landing-hero.mp4'
    out_src_mp4 = 'client/src/assets/videos/doko-landing-hero.mp4'

    # Encode MP4 (H.264, yuv420p, high quality, +faststart)
    cmd_mp4 = [
        ffmpeg_exe, '-y',
        '-framerate', str(fps),
        '-i', f"{temp_dir}/frame_%04d.png",
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '19',
        '-preset', 'slow',
        '-movflags', '+faststart',
        out_mp4
    ]
    subprocess.run(cmd_mp4, check=True)
    shutil.copy2(out_mp4, out_src_mp4)
    print(f"MP4 created: {os.path.getsize(out_mp4)} bytes")

    # Encode WebM (VP9)
    out_webm = 'client/public/doko-landing-hero.webm'
    out_src_webm = 'client/src/assets/videos/doko-landing-hero.webm'
    cmd_webm = [
        ffmpeg_exe, '-y',
        '-framerate', str(fps),
        '-i', f"{temp_dir}/frame_%04d.png",
        '-c:v', 'libvpx-vp9',
        '-crf', '26',
        '-b:v', '0',
        out_webm
    ]
    subprocess.run(cmd_webm, check=True)
    shutil.copy2(out_webm, out_src_webm)
    print(f"WebM created: {os.path.getsize(out_webm)} bytes")

    # Clean up frames
    shutil.rmtree(temp_dir)
    print("Done! High-resolution matched-background video ready!")

if __name__ == '__main__':
    process_video()
