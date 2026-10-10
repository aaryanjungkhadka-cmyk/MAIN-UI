import sys, os, glob
from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join('src', 'assets', 'avatars')

COLS, ROWS = 4, 8
BASE_W, BASE_H = 601, 1104
X0, X1 = 138, 462
Y0, Y1 = 305, 950
HALF = 44

os.makedirs(OUT, exist_ok=True)
for old in glob.glob(os.path.join(OUT, 'person-*.png')):
    os.remove(old)

img = Image.open(SRC).convert('RGBA')
sx = img.width / BASE_W
sy = img.height / BASE_H

n = 0
for r in range(ROWS):
    for c in range(COLS):
        cx = X0 + (X1 - X0) * c / (COLS - 1)
        cy = Y0 + (Y1 - Y0) * r / (ROWS - 1)
        box = (round((cx - HALF) * sx), round((cy - HALF) * sy),
               round((cx + HALF) * sx), round((cy + HALF) * sy))
        n += 1
        img.crop(box).save(os.path.join(OUT, f'person-{n:02d}.png'))

print(f'Saved {n} avatars to {OUT}')
