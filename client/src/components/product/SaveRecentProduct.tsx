'use client';

import { useEffect } from 'react';

interface RecentProduct {
  pid: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function SaveRecentProduct({ product }: { product: any }) {
  useEffect(() => {
    if (!product || !product.pid) return;

    try {
      const key = 'loopa-recent-products';
      const existing = localStorage.getItem(key);
      let list: RecentProduct[] = existing ? JSON.parse(existing) : [];

      // 중복 제거 및 최신 상품을 리스트 맨 앞으로 이동
      list = list.filter((p) => p.pid !== product.pid);
      
      list.unshift({
        pid: product.pid,
        name: product.name || product.title || '이름 없음',
        price: product.price,
        imageUrl: product.imageUrl || '',
      });

      // 최대 10개만 유지
      list = list.slice(0, 10);
      localStorage.setItem(key, JSON.stringify(list));
      
      // 커스텀 이벤트를 발행하여 사이드바 등 다른 컴포넌트들이 실시간으로 상태를 공유하게 합니다.
      window.dispatchEvent(new Event('loopa-recent-products-updated'));
    } catch (e) {
      console.error('Failed to save to recently viewed:', e);
    }
  }, [product]);

  return null;
}
