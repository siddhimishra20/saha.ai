from PIL import Image
import sys

def remove_white_bg(input_path, output_path, tolerance=220):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Check if the pixel is mostly white
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            # Change to transparent
            new_data.append((255, 255, 255, 0))
        else:
            # Lighten the purple slightly so it's visible on dark background
            # Make it brighter by adding 120 to RGB
            r = min(255, item[0] + 120)
            g = min(255, item[1] + 120)
            b = min(255, item[2] + 120)
            new_data.append((r, g, b, item[3]))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Successfully processed the image at {output_path}.")

if __name__ == '__main__':
    target = "/Users/aarishsyed/Downloads/saha-ai/public/logo.png"
    remove_white_bg(target, target)
