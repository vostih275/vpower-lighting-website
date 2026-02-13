#!/usr/bin/env python3
"""
VPOWER Image Optimization Script
Converts all PNG/JPG images to WebP format for better performance
"""

import os
import sys
from PIL import Image
import glob

def optimize_images():
    """Convert PNG/JPG images to WebP format"""
    
    # Define paths
    images_dir = "assets/images"
    
    if not os.path.exists(images_dir):
        print(f"Error: {images_dir} directory not found!")
        return
    
    print("🏮 VPOWER Image Optimization Started...")
    print("=" * 50)
    
    # Find all PNG and JPG files
    image_files = []
    for ext in ['*.png', '*.jpg', '*.jpeg']:
        image_files.extend(glob.glob(os.path.join(images_dir, '**', ext), recursive=True))
    
    if not image_files:
        print("No PNG/JPG images found to optimize!")
        return
    
    print(f"Found {len(image_files)} images to optimize...")
    print()
    
    converted_count = 0
    total_size_saved = 0
    
    for img_path in image_files:
        try:
            # Skip if already WebP
            if img_path.endswith('.webp'):
                print(f"⏭️  Skipping (already WebP): {img_path}")
                continue
            
            # Get original file size
            original_size = os.path.getsize(img_path)
            
            # Open image
            with Image.open(img_path) as img:
                # Convert to RGB if necessary (for PNG with transparency)
                if img.mode in ('RGBA', 'LA', 'P'):
                    # Create white background for transparent images
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
                
                # Create WebP filename
                webp_path = img_path.rsplit('.', 1)[0] + '.webp'
                
                # Save as WebP with good quality (85%)
                img.save(webp_path, 'WEBP', quality=85, optimize=True)
                
                # Get new file size
                new_size = os.path.getsize(webp_path)
                size_saved = original_size - new_size
                total_size_saved += size_saved
                
                # Calculate compression percentage
                compression_pct = (size_saved / original_size) * 100
                
                print(f"✅ Converted: {os.path.basename(img_path)}")
                print(f"   📊 Size: {format_size(original_size)} → {format_size(new_size)}")
                print(f"   💾 Saved: {format_size(size_saved)} ({compression_pct:.1f}% smaller)")
                print()
                
                converted_count += 1
                
        except Exception as e:
            print(f"❌ Error converting {img_path}: {e}")
            print()
    
    print("=" * 50)
    print(f"🎉 Optimization Complete!")
    print(f"📈 Converted: {converted_count} images")
    print(f"💾 Total Space Saved: {format_size(total_size_saved)}")
    print()
    print("📝 Next Steps:")
    print("1. Test your website to ensure images display correctly")
    print("2. Update HTML to reference .webp files if needed")
    print("3. Consider removing original PNG/JPG files after testing")

def format_size(size_bytes):
    """Format bytes to human readable format"""
    if size_bytes == 0:
        return "0B"
    size_names = ["B", "KB", "MB", "GB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    return f"{size_bytes:.1f}{size_names[i]}"

if __name__ == "__main__":
    try:
        optimize_images()
    except KeyboardInterrupt:
        print("\n⚠️  Optimization cancelled by user")
    except Exception as e:
        print(f"❌ Error: {e}")
