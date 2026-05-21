'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RecentProduct {
  pid: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function RecentlyViewedCarousel() {
  const [items, setItems] = useState<RecentProduct[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 로컬스토리지에서 최근 본 상품 로드
  useEffect(() => {
    setHasMounted(true);
    try {
      const key = 'loopa-recent-products';
      const existing = localStorage.getItem(key);
      if (existing) {
        setItems(JSON.parse(existing));
      }
    } catch (e) {
      console.error('Failed to parse recently viewed items:', e);
    }
  }, []);

  // 전체 기록 삭제
  const clearAll = () => {
    try {
      localStorage.removeItem('loopa-recent-products');
      setItems([]);
    } catch (e) {
      console.error(e);
    }
  };

  // 개별 아이템 삭제
  const deleteItem = (pid: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const updated = items.filter((item) => item.pid !== pid);
      setItems(updated);
      localStorage.setItem('loopa-recent-products', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // 캐러셀 슬라이드 이동
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
  };

  // 클라이언트 사이드 마운트 전에는 아무것도 렌더링하지 않음 (SSR 수화 에러 방지)
  if (!hasMounted || items.length === 0) {
    return null;
  }

  const showCarousel = items.length >= 2;

  return (
    <section className="mx-auto w-full max-w-screen-xl px-4 py-8 border-b border-border/40">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Eye className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
            최근 본 상품
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </h2>
        </div>
        <button 
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          전체 삭제
        </button>
      </div>

      <div className="relative group">
        {/* 왼쪽 이동 버튼 (캐러셀 기능 작동 시 표시) */}
        {showCarousel && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-[-15px] top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
            aria-label="이전 상품 보기"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
        )}

        {/* 상품 슬라이더 */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none py-1.5 px-0.5"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item) => (
            <div
              key={item.pid}
              className="flex-shrink-0 w-[140px] sm:w-[170px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Link href={`/products/${item.pid}`}>
                <Card className="group/item relative overflow-hidden border border-border/80 hover:border-primary/40 hover:shadow-md transition-all duration-300 rounded-xl bg-card flex flex-col h-full">
                  
                  {/* 썸네일 이미지 */}
                  <div className="relative aspect-square w-full bg-muted/20 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">
                        🛍️
                      </div>
                    )}

                    {/* 상품 지우기 X 버튼 */}
                    <button
                      onClick={(e) => deleteItem(item.pid, e)}
                      className="absolute top-1.5 right-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover/item:opacity-100 transition-opacity"
                      title="최근 본 상품에서 삭제"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="p-2.5 flex-grow flex flex-col justify-between">
                    <p className="text-xs font-semibold line-clamp-1 text-foreground leading-[1.3] group-hover/item:text-primary transition-colors">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs font-bold text-foreground">
                      {item.price === 0 ? (
                        <span className="text-emerald-500">무료나눔</span>
                      ) : (
                        `${item.price.toLocaleString()}원`
                      )}
                    </p>
                  </div>

                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* 오른쪽 이동 버튼 (캐러셀 기능 작동 시 표시) */}
        {showCarousel && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-[-15px] top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
            aria-label="다음 상품 보기"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        )}
      </div>
    </section>
  );
}
