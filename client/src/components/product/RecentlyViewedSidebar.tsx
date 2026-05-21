'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ChevronUp, Trash2 } from 'lucide-react';

interface RecentProduct {
  pid: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function RecentlyViewedSidebar() {
  const [items, setItems] = useState<RecentProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadItems = () => {
    try {
      const key = 'loopa-recent-products';
      const stored = localStorage.getItem(key);
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error('Failed to load recent products in sidebar:', e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadItems();

    // 커스텀 이벤트 및 스토리지 변화 이벤트 수신
    window.addEventListener('loopa-recent-products-updated', loadItems);
    window.addEventListener('storage', loadItems);

    return () => {
      window.removeEventListener('loopa-recent-products-updated', loadItems);
      window.removeEventListener('storage', loadItems);
    };
  }, []);

  const handleDelete = (e: React.MouseEvent, pid: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const key = 'loopa-recent-products';
      const filtered = items.filter((item) => item.pid !== pid);
      localStorage.setItem(key, JSON.stringify(filtered));
      setItems(filtered);
      window.dispatchEvent(new Event('loopa-recent-products-updated'));
    } catch (err) {
      console.error('Failed to delete recent product:', err);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const key = 'loopa-recent-products';
      localStorage.removeItem(key);
      setItems([]);
      window.dispatchEvent(new Event('loopa-recent-products-updated'));
    } catch (err) {
      console.error('Failed to clear recent products:', err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) return null;
  if (items.length === 0) return null;

  // 사이드바에는 최근에 본 가장 최신의 3개 상품만 세로로 노출합니다.
  const displayItems = items.slice(0, 3);

  return (
    <div className="fixed right-6 top-[18%] z-40 hidden xl:flex flex-col w-[115px] bg-background/95 backdrop-blur-md border border-border rounded-3xl shadow-2xl p-3.5 items-center select-none hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:border-primary/25 transition-all duration-300 animate-in fade-in slide-in-from-right-4">
      {/* 타이틀 및 뱃지 */}
      <div className="flex flex-col items-center text-center space-y-1.5 pb-2.5 border-b border-border/60 w-full">
        <span className="text-[11px] font-bold text-muted-foreground leading-tight tracking-tight">최근 본 상품</span>
        <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-extrabold bg-primary/10 text-primary rounded-full min-w-[22px] h-5">
          {items.length}
        </span>
      </div>

      {/* 상품 썸네일 리스트 */}
      <div className="flex flex-col space-y-4 py-4 w-full items-center">
        {displayItems.map((item) => (
          <Link
            key={item.pid}
            href={`/products/${item.pid}`}
            className="group relative flex flex-col items-center w-20 h-20 rounded-2xl border border-border bg-muted overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-200"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                NO IMAGE
              </div>
            )}
            
            {/* 개별 삭제 버튼 (마우스 오버 시 표시) */}
            <button
              onClick={(e) => handleDelete(e, item.pid)}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-destructive text-muted-foreground hover:text-destructive-foreground border border-border shadow-md rounded-full w-5 h-5 flex items-center justify-center z-10 cursor-pointer"
              title="삭제"
            >
              <X className="h-3 w-3" />
            </button>

            {/* 미니 툴팁/가격정보 오버레이 */}
            <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-[9px] text-white text-center font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis">
              {item.price ? `${item.price.toLocaleString()}원` : '무료'}
            </div>
          </Link>
        ))}
      </div>

      {/* 액션 버튼 영역 */}
      <div className="flex flex-col items-center w-full space-y-2.5 pt-2.5 border-t border-border/60">
        {/* 전체 삭제 */}
        <button
          onClick={handleClearAll}
          className="flex items-center justify-center p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          title="전체 삭제"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>

        {/* TOP 스크롤 버튼 */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center w-full py-1.5 hover:bg-primary/5 rounded-xl text-muted-foreground hover:text-primary transition-all cursor-pointer group"
          title="맨 위로 이동"
        >
          <ChevronUp className="h-4.5 w-4.5 animate-bounce group-hover:translate-y-[-1px] transition-transform" />
          <span className="text-[9px] font-extrabold uppercase tracking-wider">TOP</span>
        </button>
      </div>
    </div>
  );
}
