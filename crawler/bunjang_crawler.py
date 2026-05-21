import requests
import json
import time
import os
import sys
import io
from datetime import datetime

# Windows 콘솔 인코딩 에러 방지 (한글 및 이모지)
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')



# ── 설정 ───────────────────────────────────────────────────────────
BASE_URL = "https://api.bunjang.co.kr"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Referer": "https://www.bunjang.co.kr/",
    "Accept": "application/json",
}


# ── API 함수 ───────────────────────────────────────────────────────

def fetch_home_feed(size: int = 48, cursor: str = None) -> dict:
    """오늘의 추천 상품 피드 조회"""
    params = {
        "device_type": "w",
        "size": size,
    }
    if cursor:
        params["cursor"] = cursor

    resp = requests.get(
        f"{BASE_URL}/api/rec/web/v1/home/feed",
        headers=HEADERS,
        params=params,
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


def fetch_search(keyword: str, page: int = 0, per_page: int = 100) -> dict:
    """키워드 검색"""
    params = {
        "q": keyword,
        "page": page,
        "n": per_page,
        "device_type": "w",
    }
    resp = requests.get(
        f"{BASE_URL}/api/1/find_v2.json",
        headers=HEADERS,
        params=params,
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


def fetch_product_detail(pid: str) -> dict:
    """상품 상세 조회"""
    resp = requests.get(
        f"{BASE_URL}/api/1/products/{pid}.json",
        headers=HEADERS,
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


# ── 데이터 가공 ────────────────────────────────────────────────────

def parse_product(raw: dict, keyword: str = "") -> dict:
    """API 응답에서 필요한 필드만 추출 (추천 피드와 검색결과 통합 지원)"""
    name = raw.get("productName") or raw.get("name")
    
    raw_image = raw.get("productImage") or raw.get("product_image") or ""
    image_url = raw_image.replace("{res}", "384") if raw_image else ""
    
    favorite_count = raw.get("favoriteCount") or raw.get("num_faved") or 0
    try:
        favorite_count = int(favorite_count)
    except (ValueError, TypeError):
        favorite_count = 0
        
    chat_count = raw.get("buntalkCount") or raw.get("buntalk_count") or 0
    try:
        chat_count = int(chat_count)
    except (ValueError, TypeError):
        chat_count = 0
        
    status = raw.get("status", 0)
    try:
        status = int(status)
    except (ValueError, TypeError):
        status = 0

    return {
        "pid": str(raw.get("pid", "")),
        "name": name,
        "price": raw.get("price"),
        "status": status,
        "location": raw.get("location", ""),
        "image_url": image_url,
        "favorite_count": favorite_count,
        "chat_count": chat_count,
        "updated_before": str(raw.get("updatedBefore") or raw.get("update_time") or ""),
        "created_before": str(raw.get("createdBefore") or ""),
        "seller_uid": str(raw.get("uid", "")),
        "is_ad": bool(raw.get("ad", False) or raw.get("is_ad", False)),
        "keyword": keyword,
        "crawled_at": datetime.now().isoformat(),
    }


# ── 저장 ──────────────────────────────────────────────────────────

def save_to_json(data: list[dict], filename: str):
    """JSON 파일로 저장"""
    os.makedirs("output", exist_ok=True)
    path = os.path.join("output", filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ 저장 완료: {path} ({len(data)}개)")


# ── 크롤러 ────────────────────────────────────────────────────────

def crawl_home_feed(max_pages: int = 3) -> list[dict]:
    """추천 피드 크롤링 (cursor 기반 페이지네이션)"""
    all_products = []
    cursor = None

    for page in range(max_pages):
        print(f"📦 피드 페이지 {page + 1} 수집 중...")
        try:
            data = fetch_home_feed(size=48, cursor=cursor)
            items = data.get("data", [])

            for item in items:
                if item.get("type") == "PRODUCT":
                    all_products.append(parse_product(item, keyword="추천"))

            cursor = data.get("cursor")
            if not cursor:
                print("마지막 페이지 도달")
                break

            time.sleep(1)  # 요청 간격 (서버 부담 최소화)

        except requests.RequestException as e:
            print(f"❌ 오류 발생: {e}")
            break

    return all_products


def crawl_search(keywords: list[str], max_pages: int = 3) -> list[dict]:
    """키워드 검색 크롤링"""
    all_products = []

    for keyword in keywords:
        print(f"\n🔍 '{keyword}' 검색 중...")

        for page in range(max_pages):
            print(f"  페이지 {page + 1} 수집 중...")
            try:
                data = fetch_search(keyword=keyword, page=page)
                items = data.get("list", [])

                if not items:
                    print(f"  결과 없음 (페이지 {page + 1})")
                    break

                for item in items:
                    all_products.append(parse_product(item, keyword=keyword))

                print(f"  {len(items)}개 수집")
                time.sleep(1)

            except requests.RequestException as e:
                print(f"  ❌ 오류: {e}")
                break

    return all_products


# ── 메인 ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 50)
    print("  번장 크롤러 시작")
    print("=" * 50)

    # 1. 추천 피드 수집
    print("\n[1] 오늘의 추천 상품 수집")
    feed_products = crawl_home_feed(max_pages=2)
    save_to_json(feed_products, "home_feed.json")

    # 2. 키워드 검색 수집
    print("\n[2] 키워드 검색 수집")
    keywords = ["맥북", "아이폰", "닌텐도"]
    search_products = crawl_search(keywords=keywords, max_pages=2)
    save_to_json(search_products, "search_results.json")

    print("\n✨ 크롤링 완료!")
    print(f"  - 추천 피드: {len(feed_products)}개")
    print(f"  - 검색 결과: {len(search_products)}개")
