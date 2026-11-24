import cv2
import numpy as np
import math
import os
import subprocess
import imageio_ffmpeg

def create_doko_animation():
    src_path = r'C:\Users\Asus Tuf\.gemini\antigravity\brain\96f2f8aa-39f1-4e96-ac17-56157d89f072\.user_uploaded\media_1793776895481_178d5b3d.png'
    raw_img = cv2.imread(src_path, cv2.IMREAD_UNCHANGED)
    if raw_img is None:
        raise FileNotFoundError(f"Cannot load {src_path}")
    
    # Base image dimensions
    H, W = raw_img.shape[:2]
    print(f"Loaded raw image: {W}x{H}")

    # Ensure 3-channel BGR for rendering
    if raw_img.shape[2] == 4:
        # Check alpha
        alpha = raw_img[:, :, 3].astype(np.float32) / 255.0
        rgb = raw_img[:, :, :3].astype(np.float32)
        base_bgr = (rgb * alpha[:, :, None] + 255.0 * (1.0 - alpha[:, :, None])).astype(np.uint8)
    else:
        base_bgr = raw_img[:, :, :3].copy()

    # Crop and frame Doko nicely:
    # Original is 1024x571.
    # Content is roughly X: 30..830, Y: 30..550.
    # Center around Doko and the doko basket: X_center ~ 470, Y_center ~ 290.
    # Let's keep the full 1024x576 (standard 16:9 720p/576p aspect ratio) by padding 5px on bottom.
    target_W, target_H = 1024, 576
    base_frame = np.full((target_H, target_W, 3), 255, dtype=np.uint8)
    # Paste base_bgr into base_frame (vertical center)
    y_offset = (target_H - H) // 2
    base_frame[y_offset:y_offset+H, 0:W] = base_bgr

    # Adjust feature centers for the new Y offset
    # Left eye center: (495, 198 + y_offset)
    # Right eye center: (576, 200 + y_offset)
    leye_cx, leye_cy = 495, 198 + y_offset
    reye_cx, reye_cy = 576, 200 + y_offset
    
    # Body center for breathing:
    body_cx, body_cy = 485, 320 + y_offset
    # Head center for bob:
    head_cx, head_cy = 520, 160 + y_offset
    # Dhaka Topi tip:
    topi_cx, topi_cy = 540, 45 + y_offset
    # Weaving hands & bamboo:
    hand_cx, hand_cy = 540, 310 + y_offset
    bamboo_cx, bamboo_cy = 520, 320 + y_offset
    # Tail feathers:
    tail_cx, tail_cy = 310, 400 + y_offset

    # Precompute static coordinates
    grid_y, grid_x = np.mgrid[0:target_H, 0:target_W].astype(np.float32)

    # Precompute Gaussian influence weights for fast per-frame warping
    # 1. Body breathing weight
    dist_body = ((grid_x - body_cx)/170.0)**2 + ((grid_y - body_cy)/135.0)**2
    w_body = np.exp(-dist_body).astype(np.float32)
    # Feather to zero near floor contact
    floor_factor = np.clip((470 + y_offset - grid_y) / 150.0, 0.0, 1.0)
    w_body *= floor_factor

    # 2. Head & Topi bob weight
    dist_head = ((grid_x - head_cx)/105.0)**2 + ((grid_y - head_cy)/115.0)**2
    w_head = np.exp(-dist_head).astype(np.float32)

    # 3. Dhaka Topi sway weight
    dist_topi = ((grid_x - topi_cx)/60.0)**2 + ((grid_y - topi_cy)/65.0)**2
    w_topi = np.exp(-dist_topi).astype(np.float32)

    # 4. Weaving wings & bamboo weight
    dist_hand = ((grid_x - hand_cx)/95.0)**2 + ((grid_y - hand_cy)/65.0)**2
    w_hand = np.exp(-dist_hand).astype(np.float32)

    dist_bamboo = ((grid_x - bamboo_cx)/180.0)**2 + ((grid_y - bamboo_cy)/45.0)**2
    w_bamboo = np.exp(-dist_bamboo).astype(np.float32)

    # 5. Tail twitch weight
    dist_tail = ((grid_x - tail_cx)/55.0)**2 + ((grid_y - tail_cy)/35.0)**2
    w_tail = np.exp(-dist_tail).astype(np.float32)

    # 6. Eye blinking helper
    def apply_eye_blink(frame, cx, cy, rx, ry, progress):
        if progress <= 0.01:
            return
        x0, x1 = max(0, cx - rx - 12), min(target_W, cx + rx + 12)
        y0, y1 = max(0, cy - ry - 16), min(target_H, cy + ry + 12)
        
        py, px = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        edx = (px - cx) / float(rx)
        edy = (py - cy) / float(ry)
        dist_sq = edx**2 + edy**2
        mask = dist_sq <= 1.0
        
        valid_x = np.abs(edx) < 0.99
        top_rim = np.zeros_like(py)
        bot_rim = np.zeros_like(py)
        top_rim[valid_x] = cy - ry * np.sqrt(np.maximum(0, 1 - edx[valid_x]**2))
        bot_rim[valid_x] = cy + ry * np.sqrt(np.maximum(0, 1 - edx[valid_x]**2))
        
        lid_y = top_rim + progress * (bot_rim - top_rim)
        covered = mask & (py <= lid_y)
        
        remap_y = py.copy()
        remap_y[covered] = top_rim[covered] - (lid_y[covered] - py[covered]) * 0.3 - 3.0
        
        patch = cv2.remap(frame, px, remap_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        
        # Add delicate dark eyelid crease line when closed
        if progress > 0.5:
            crease_alpha = (progress - 0.5) / 0.5
            for c in range(x0, x1):
                if valid_x[0, c - x0]:
                    cur_lid = int(round(lid_y[0, c - x0]))
                    if y0 <= cur_lid < y1:
                        iy = cur_lid - y0
                        ix = c - x0
                        orig_c = patch[iy, ix].astype(np.float32)
                        crease_c = np.array([28, 24, 18], dtype=np.float32)
                        patch[iy, ix] = (orig_c * (1 - 0.75 * crease_alpha) + crease_c * (0.75 * crease_alpha)).astype(np.uint8)
                        if iy + 1 < patch.shape[0]:
                            patch[iy+1, ix] = (patch[iy+1, ix].astype(np.float32) * 0.65 + crease_c * 0.35).astype(np.uint8)
        
        soft_mask = np.clip((1.08 - dist_sq) * 5.0, 0, 1)
        soft_mask = cv2.GaussianBlur(soft_mask.astype(np.float32), (5, 5), 0)[:, :, np.newaxis]
        frame[y0:y1, x0:x1] = (patch * soft_mask + frame[y0:y1, x0:x1] * (1.0 - soft_mask)).astype(np.uint8)

    # Floating particles setup (16 particles, perfectly looping)
    np.random.seed(42)
    num_particles = 16
    particles = []
    for i in range(num_particles):
        particles.append({
            'base_x': np.random.uniform(180, 820),
            'base_y': np.random.uniform(60, 480),
            'speed_y': np.random.uniform(35, 75),
            'drift_amp': np.random.uniform(8, 22),
            'drift_phase': np.random.uniform(0, math.tau),
            'radius': np.random.uniform(1.8, 4.2),
            'color': [
                (210, 240, 180), # soft mint BGR
                (140, 215, 180), # fresh mint
                (170, 225, 250), # warm golden BGR
                (130, 195, 245), # honey gold
            ][i % 4],
            'max_alpha': np.random.uniform(0.35, 0.75),
        })

    # Animation configuration:
    # Total duration = 4.0 seconds at 30 fps = 120 frames
    FPS = 30
    DURATION_SEC = 4.0
    TOTAL_FRAMES = int(FPS * DURATION_SEC)
    print(f"Generating {TOTAL_FRAMES} frames ({DURATION_SEC}s @ {FPS}fps)...")

    # Temp frame directory
    os.makedirs('scratch/anim_frames', exist_ok=True)

    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx / float(FPS)
        phase = (frame_idx / float(TOTAL_FRAMES)) * math.tau # 0 to 2*pi seamless

        # 1. Breathing motion (1 full breath per 4s loop: t in [0, 4])
        # Inhale lift and chest expansion
        b_sin = math.sin(phase)
        b_cos = math.cos(phase)
        dy_breath = -3.8 * b_sin * w_body
        dx_breath = 1.6 * b_sin * w_body * np.sign(grid_x - body_cx)

        # 2. Head nod & tilt (synced with breath + slight delay)
        h_phase = phase - 0.4
        dy_head = 2.2 * math.sin(h_phase) * w_head
        dx_head = 1.2 * math.cos(h_phase) * w_head

        # 3. Dhaka Topi sway (secondary physics with lag)
        t_phase = phase - 0.8
        dx_topi = 2.4 * math.sin(t_phase) * w_topi
        dy_topi = 1.0 * math.cos(t_phase) * w_topi

        # 4. Weaving action: 2 weaving strokes per 4s loop
        w_phase = 2.0 * phase
        w_sin = math.sin(w_phase)
        w_cos = math.cos(w_phase)
        dx_hand = 3.6 * w_sin * w_hand
        dy_hand = 2.0 * w_cos * w_hand
        
        # Bamboo ripple along the strip
        dy_bamboo = 2.8 * np.sin(w_phase + (grid_x - bamboo_cx) * 0.035) * w_bamboo

        # 5. Tail twitch (peaks around t = 1.5s and t = 3.5s)
        tail_twitch = math.sin(4.0 * phase) * math.exp(-((math.sin(phase))**2) * 4.0)
        dy_tail = 3.2 * tail_twitch * w_tail

        # Combine all vector displacements
        total_dx = dx_breath + dx_head + dx_topi + dx_hand
        total_dy = dy_breath + dy_head + dy_topi + dy_hand + dy_bamboo + dy_tail

        # Target remap coordinates
        map_x = np.clip(grid_x - total_dx, 0, target_W - 1).astype(np.float32)
        map_y = np.clip(grid_y - total_dy, 0, target_H - 1).astype(np.float32)

        # Warp base image
        warped = cv2.remap(base_frame, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

        # 6. Eye blinking logic:
        # Blink #1 at t ~ 1.1s (frames 30..38)
        # Blink #2 at t ~ 2.9s (frames 84..92)
        blink_p = 0.0
        # Check blink 1:
        if 29 <= frame_idx <= 38:
            b_frame = frame_idx - 29
            if b_frame <= 4:
                blink_p = b_frame / 4.0 # closing
            else:
                blink_p = (9 - b_frame) / 5.0 # opening
        # Check blink 2:
        elif 83 <= frame_idx <= 92:
            b_frame = frame_idx - 83
            if b_frame <= 4:
                blink_p = b_frame / 4.0
            else:
                blink_p = (9 - b_frame) / 5.0
        
        if blink_p > 0.0:
            # Smooth ease
            blink_ease = 0.5 - 0.5 * math.cos(blink_p * math.pi)
            apply_eye_blink(warped, leye_cx, leye_cy, 24, 22, blink_ease)
            apply_eye_blink(warped, reye_cx, reye_cy, 20, 20, blink_ease)

        # 7. Eye sparkle glint when eyes open fully
        if frame_idx in [39, 40, 93, 94]:
            glint_alpha = 0.85 if frame_idx in [39, 93] else 0.4
            for g_cx, g_cy in [(leye_cx + 4, leye_cy - 7), (reye_cx + 3, reye_cy - 6)]:
                cv2.circle(warped, (g_cx, g_cy), 3, (255, 255, 255), -1, cv2.LINE_AA)
                cv2.circle(warped, (g_cx, g_cy), 5, (255, 250, 220), 1, cv2.LINE_AA)

        # 8. Render floating ambient particles
        particle_overlay = np.zeros_like(warped)
        particle_mask = np.zeros((target_H, target_W), dtype=np.float32)

        for p in particles:
            # Seamless vertical loop:
            y_prog = (p['base_y'] - p['speed_y'] * (frame_idx / float(TOTAL_FRAMES))) % target_H
            x_curr = int(p['base_x'] + p['drift_amp'] * math.sin(phase + p['drift_phase']))
            y_curr = int(y_prog)
            
            # Subtle alpha pulse
            alpha_pulse = p['max_alpha'] * (0.6 + 0.4 * math.sin(phase * 2 + p['drift_phase']))
            r = int(round(p['radius']))
            
            cv2.circle(particle_overlay, (x_curr, y_curr), r, p['color'], -1, cv2.LINE_AA)
            cv2.circle(particle_mask, (x_curr, y_curr), r, alpha_pulse, -1, cv2.LINE_AA)
            # Soft outer glow
            cv2.circle(particle_mask, (x_curr, y_curr), r * 2, alpha_pulse * 0.35, -1, cv2.LINE_AA)

        # Blend particles
        p_mask_3c = np.clip(particle_mask[:, :, None], 0.0, 1.0)
        warped = (particle_overlay * p_mask_3c + warped * (1.0 - p_mask_3c)).astype(np.uint8)

        # 9. Subtle 2.5D Camera breathe (zoom 1.000 to 1.015 and back)
        cam_zoom = 1.0 + 0.012 * (0.5 - 0.5 * math.cos(phase))
        if cam_zoom > 1.0005:
            cam_M = cv2.getRotationMatrix2D((float(head_cx), float(head_cy)), 0.0, cam_zoom)
            warped = cv2.warpAffine(warped, cam_M, (target_W, target_H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

        # Save frame
        frame_filename = f'scratch/anim_frames/frame_{frame_idx:04d}.png'
        cv2.imwrite(frame_filename, warped)

    print("All frames rendered! Encoding with FFmpeg...")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

    # Destination directories
    os.makedirs('client/public', exist_ok=True)
    os.makedirs('client/src/assets/videos', exist_ok=True)

    dest_mp4_public = 'client/public/doko-animated.mp4'
    dest_mp4_src = 'client/src/assets/videos/doko-animated.mp4'
    dest_webm_public = 'client/public/doko-animated.webm'
    dest_webm_src = 'client/src/assets/videos/doko-animated.webm'

    # Encode MP4 (H.264, yuv420p, high quality crf 18, faststart)
    mp4_cmd = [
        ffmpeg_exe, '-y',
        '-framerate', str(FPS),
        '-i', 'scratch/anim_frames/frame_%04d.png',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '18',
        '-preset', 'slow',
        '-movflags', '+faststart',
        dest_mp4_public
    ]
    subprocess.run(mp4_cmd, check=True)
    # Copy to src
    import shutil
    shutil.copy2(dest_mp4_public, dest_mp4_src)
    print(f"MP4 encoded successfully: {os.path.getsize(dest_mp4_public)} bytes")

    # Encode WebM (VP9, web optimized)
    webm_cmd = [
        ffmpeg_exe, '-y',
        '-framerate', str(FPS),
        '-i', 'scratch/anim_frames/frame_%04d.png',
        '-c:v', 'libvpx-vp9',
        '-crf', '24',
        '-b:v', '0',
        dest_webm_public
    ]
    subprocess.run(webm_cmd, check=True)
    shutil.copy2(dest_webm_public, dest_webm_src)
    print(f"WebM encoded successfully: {os.path.getsize(dest_webm_public)} bytes")

    # Also extract transparent cutouts of the new Doko mascot
    # 1. Full mascot transparent image to replace client/src/assets/images/mascot-doko.png
    print("Creating transparent mascot cutout for mascot-doko.png...")
    # Cutout Doko on transparent background:
    # Since background is white, remove background cleanly with soft feathering
    raw_bgr = base_bgr.copy()
    # Compute brightness / distance from pure white (255, 255, 255)
    diff = 255.0 - np.maximum(raw_bgr[:, :, 0], np.maximum(raw_bgr[:, :, 1], raw_bgr[:, :, 2])).astype(np.float32)
    # Background threshold
    alpha_cut = np.clip(diff * 8.0, 0, 255).astype(np.uint8)
    
    # Ground shadow retention:
    # Ground shadow is grey (diff ~ 10..80, saturation low)
    # Let's keep soft alpha for the shadow
    cutout = np.dstack([raw_bgr, alpha_cut])
    
    # Crop to content bounds
    mask_idx = np.where(alpha_cut > 15)
    if len(mask_idx[0]) > 0:
        ymin, ymax = mask_idx[0].min(), mask_idx[0].max()
        xmin, xmax = mask_idx[1].min(), mask_idx[1].max()
        cropped_cutout = cutout[max(0, ymin-10):min(H, ymax+10), max(0, xmin-10):min(W, xmax+10)]
    else:
        cropped_cutout = cutout

    # Save to client/src/assets/images/mascot-doko.png
    cv2.imwrite('client/src/assets/images/mascot-doko.png', cropped_cutout)
    print(f"Updated client/src/assets/images/mascot-doko.png ({cropped_cutout.shape[1]}x{cropped_cutout.shape[0]})")

    # Also create a circular portrait avatar for avatars / picker
    avatar_size = 256
    head_crop = raw_bgr[25:310, 410:650]
    head_resized = cv2.resize(head_crop, (avatar_size, avatar_size), interpolation=cv2.INTER_LANCZOS4)
    # Create circular mask
    circle_mask = np.zeros((avatar_size, avatar_size), dtype=np.uint8)
    cv2.circle(circle_mask, (avatar_size//2, avatar_size//2), avatar_size//2 - 2, 255, -1, cv2.LINE_AA)
    avatar_rgba = np.dstack([head_resized, circle_mask])
    cv2.imwrite('client/src/assets/avatars/person-01.png', avatar_rgba)
    print("Updated client/src/assets/avatars/person-01.png with new Doko portrait")

    print("ALL ASSETS CREATED SUCCESSFULLY!")

if __name__ == '__main__':
    create_doko_animation()
