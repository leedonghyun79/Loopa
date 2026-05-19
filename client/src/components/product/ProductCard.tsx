'use client';

import Link from 'next/link';
import { Heart, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type Product = {
  id: number;
  title: string;
  price: number;
  location: string;
  time: string;
  likes: number;
  badge: string | null;
  category: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const isFree = product.price === 0;

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200">
        {/* 썸네일 */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            🛍️
          </div>
          {product.badge && (
            <Badge
              className="absolute top-2 left-2 text-xs"
              variant={product.badge === '나눔' ? 'default' : 'secondary'}
            >
              {product.badge}
            </Badge>
          )}
          <button
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500 transition-colors" />
          </button>
        </div>

        <CardContent className="p-3">
          <p className="text-sm font-medium line-clamp-2 leading-[1.3] group-hover:text-primary transition-colors">
            {product.title}
          </p>
          <p className="mt-1.5 text-base font-bold">
            {isFree ? (
              <span className="text-green-600">무료나눔</span>
            ) : (
              `${product.price.toLocaleString()}원`
            )}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {product.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {product.time}
            </span>
          </div>
          {product.likes > 0 && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="h-3 w-3" />
              <span>{product.likes}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
