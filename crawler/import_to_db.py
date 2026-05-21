import json
import os
import sys
import io
import requests

# Windows 콘솔 인코딩 에러 방지
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SERVER_URL = "http://localhost:5000/products/bulk"

def sanitize_data(data):
    sanitized = []
    for idx, item in enumerate(data):
        pid = item.get("pid")
        name = item.get("name")
        price = item.get("price")
        status = item.get("status")
        
        # 필수 값 체크
        if not pid or not name:
            continue
            
        # 문자열 및 숫자 보정
        pid = str(pid).strip()
        name = str(name).strip()
        
        if not pid or not name:
            continue
            
        try:
            price = int(price) if price is not None else 0
        except (ValueError, TypeError):
            price = 0
            
        try:
            status = int(status) if status is not None else 0
        except (ValueError, TypeError):
            status = 0
            
        sanitized_item = {
            "pid": pid,
            "name": name,
            "price": price,
            "status": status,
            "location": str(item.get("location") or "").strip(),
            "image_url": str(item.get("image_url") or "").strip(),
            "favorite_count": int(item.get("favorite_count") or 0),
            "chat_count": int(item.get("chat_count") or 0),
            "updated_before": str(item.get("updated_before") or "").strip(),
            "created_before": str(item.get("created_before") or "").strip(),
            "seller_uid": str(item.get("seller_uid") or "").strip(),
            "is_ad": bool(item.get("is_ad") or False),
            "keyword": str(item.get("keyword") or "").strip(),
            "crawled_at": str(item.get("crawled_at") or "").strip(),
        }
        sanitized.append(sanitized_item)
    return sanitized

def import_file(filepath):
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return
    
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    print(f"\n⚙️ Sanitizing data from {filepath}...")
    sanitized_data = sanitize_data(data)
    total_items = len(sanitized_data)
    print(f"📊 Sanitized: {total_items} items (from {len(data)} raw items)")
    
    # 100개씩 청크 분할하여 전송 (서버 부담 최소화 및 안전)
    chunk_size = 100
    success_count = 0
    
    for i in range(0, total_items, chunk_size):
        chunk = sanitized_data[i:i + chunk_size]
        print(f"📤 Sending chunk {i//chunk_size + 1} ({len(chunk)} items)...")
        try:
            resp = requests.post(SERVER_URL, json=chunk, timeout=30)
            resp.raise_for_status()
            success_count += len(chunk)
        except Exception as e:
            print(f"❌ Error sending chunk {i//chunk_size + 1}: {e}")
            if 'resp' in locals() and resp is not None:
                print(f"   Response: {resp.text}")
                
    print(f"✅ Import complete: {success_count}/{total_items} items successfully imported.")

if __name__ == "__main__":
    print("=" * 50)
    print("  Importing Crawled Data to Database via NestJS API")
    print("=" * 50)
    
    import_file("output/home_feed.json")
    import_file("output/search_results.json")
