from PIL import Image, ImageDraw, ImageChops

SRC = "Khanalens-Logo.png"
OUT = "Khanalens-Logo-round.png"
OUTPUT_SIZE = 512

src = Image.open(SRC).convert("RGBA")
w, h = src.size
px = src.load()

# Find the green ring: pixels that are clearly green (not black leaf, not cream)
xs, ys = [], []
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a > 200 and g > r + 15 and g > b + 5:
            xs.append(x)
            ys.append(y)

if not xs:
    raise SystemExit("Could not find the green ring in the image.")

left, right = min(xs), max(xs)
top, bottom = min(ys), max(ys)
cx = (left + right) / 2
cy = (top + bottom) / 2
radius = max(right - left, bottom - top) / 2 + 2

# Crop a square around the ring
box = (round(cx - radius), round(cy - radius), round(cx + radius), round(cy + radius))
img = src.crop(box)
size = img.size[0]

# Circular mask, drawn at 4x for smooth edges
big = size * 4
mask_big = Image.new("L", (big, big), 0)
ImageDraw.Draw(mask_big).ellipse((0, 0, big - 1, big - 1), fill=255)
mask = mask_big.resize((size, size), Image.LANCZOS)

img.putalpha(ImageChops.multiply(img.getchannel("A"), mask))
img = img.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.LANCZOS)

img.save(OUT)
print(f"Saved {OUT}")