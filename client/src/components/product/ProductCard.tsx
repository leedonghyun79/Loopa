'use client';

import Link from 'next/link';
import { Heart, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type Product = {
  // Support both standard Next.js dummy data and actual DB fields
  id?: number | string;
  pid?: string;
  title?: string;
  name?: string;
  price: number;
  location?: string;
  time?: string;
  createdBefore?: string;
  updatedBefore?: string;
  likes?: number;
  favoriteCount?: number;
  badge?: string | null;
  status?: number;
  imageUrl?: string;
  isAd?: boolean;
  category?: string;
  keyword?: string;
  chatCount?: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const isFree = product.price === 0;
  
  // Normalize fields
  const productId = product.pid || String(product.id || '');
  const title = product.name || product.title || '이름 없음';
  const location = product.location || '위치 정보 없음';
  
  // Calculate relative time
  let timeStr = product.time || product.updatedBefore || product.createdBefore || '';
  // If timestamp, convert to readable format if numeric
  if (timeStr && /^\d+$/.test(timeStr)) {
    // BunJang timestamps can be in seconds
    const ts = parseInt(timeStr) * 1000;
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 60) timeStr = `${Math.max(1, mins)}분 전`;
    else if (hours < 24) timeStr = `${hours}시간 전`;
    else timeStr = `${days}일 전`;
  }
  if (!timeStr) timeStr = '최근';

  const likesCount = product.favoriteCount !== undefined ? product.favoriteCount : (product.likes || 0);
  
  // Determine badge
  let badgeText = product.badge;
  let badgeVariant: 'default' | 'secondary' | 'destructive' = 'secondary';
  
  if (product.isAd) {
    badgeText = '광고';
    badgeVariant = 'secondary';
  } else if (product.status === 1) {
    badgeText = '예약중';
    badgeVariant = 'default';
  } else if (product.status === 2) {
    badgeText = '거래완료';
    badgeVariant = 'destructive';
  }

  return (
    <Link href={`/products/${productId}`}>
      <Card className="group overflow-hidden border border-border/80 hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col h-full bg-card">
        {/* 썸네일 */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl bg-muted/10">
              🛍️
            </div>
          )}
          {badgeText && (
            <Badge
              className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 shadow-sm rounded-md"
              variant={badgeVariant}
            >
              {badgeText}
            </Badge>
          )}
          <button
            className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 hover:bg-background backdrop-blur-md shadow-sm transition-all hover:scale-105"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
          </button>
        </div>

        <CardContent className="p-3.5 flex flex-col justify-between flex-grow">
          <div>
            <p className="text-sm font-semibold line-clamp-2 leading-[1.4] text-foreground group-hover:text-primary transition-colors">
              {title}
            </p>
            <p className="mt-1.5 text-base font-bold text-foreground">
              {isFree ? (
                <span className="text-emerald-500 font-bold">무료나눔</span>
              ) : (
                `${product.price.toLocaleString()}원`
              )}
            </p>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2.5">
              <span className="flex items-center gap-1 min-w-0">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{location}</span>
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <Clock className="h-3.5 w-3.5" />
                <span>{timeStr}</span>
              </span>
            </div>
            {likesCount > 0 && (
              <div className="mt-2 flex items-center gap-1 text-[11px] text-red-500/80 font-medium">
                <Heart className="h-3.5 w-3.5 fill-red-500/10 text-red-500" />
                <span>{likesCount}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
