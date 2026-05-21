import Link from 'next/link';
import { ChevronLeft, MapPin, Clock, Heart, MessageCircle, Shield, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard, { type Product } from '@/components/product/ProductCard';
import SaveRecentProduct from '@/components/product/SaveRecentProduct';

interface PageProps {
  params: Promise<{ pid: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { pid } = await params;

  // 1. 상세 상품 가져오기
  let product: Product | null = null;
  try {
    const res = await fetch(`http://localhost:5000/products/${pid}`, { next: { revalidate: 5 } });
    if (res.ok) {
      product = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch product details:', error);
  }

  // 상품이 없을 때의 폴백 화면
  if (!product) {
    return (
      <div className="mx-auto max-w-screen-md px-4 py-24 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold">존재하지 않거나 삭제된 상품입니다.</h2>
        <p className="text-muted-foreground mt-2">입력하신 상품 ID를 다시 한번 확인해 주세요.</p>
        <Link href="/" className="mt-8 inline-block">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  // 2. 관련 상품(동일 키워드) 가져오기
  let relatedProducts: Product[] = [];
  if (product.keyword) {
    try {
      const res = await fetch(`http://localhost:5000/products?keyword=${encodeURIComponent(product.keyword)}`, { next: { revalidate: 10 } });
      if (res.ok) {
        const rawRelated = await res.json();
        if (Array.isArray(rawRelated)) {
          // 현재 상품은 제외하고 최대 4개 선택
          relatedProducts = rawRelated
            .filter((p: Product) => (p.pid || p.id) !== pid)
            .slice(0, 4);
        }
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    }
  }

  // 시간 파싱
  let timeStr = product.updatedBefore || product.createdBefore || product.time || '';
  if (timeStr && /^\d+$/.test(timeStr)) {
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

  // 상태 배지 정의
  let statusBadge = '';
  let statusVariant: 'default' | 'secondary' | 'destructive' = 'secondary';
  if (product.isAd) {
    statusBadge = 'AD';
    statusVariant = 'secondary';
  } else if (product.status === 1) {
    statusBadge = '예약중';
    statusVariant = 'default';
  } else if (product.status === 2) {
    statusBadge = '거래완료';
    statusVariant = 'destructive';
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      {/* 최근 본 상품 목록 저장을 위한 클라이언트 컴포넌트 */}
      <SaveRecentProduct product={product} />

      {/* 뒤로가기 네비게이션 */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4" />
          목록으로 돌아가기
        </Link>
      </div>

      {/* 메인 상품 상세 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* 왼쪽: 상품 이미지 */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted/20 border border-border/80 shadow-md">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name || product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-7xl">
              🛍️
            </div>
          )}
          {statusBadge && (
            <Badge className="absolute top-4 left-4 text-xs px-2.5 py-1 font-bold shadow-md rounded-lg" variant={statusVariant}>
              {statusBadge}
            </Badge>
          )}
        </div>

        {/* 오른쪽: 상품 정보 및 액션 */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            {/* 카테고리 & 키워드 정보 */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                {product.keyword || '일반상품'}
              </Badge>
              <span className="text-xs text-muted-foreground">상품고유번호: {pid}</span>
            </div>

            {/* 상품 제목 */}
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-[1.3] text-foreground">
              {product.name || product.title}
            </h1>

            {/* 가격 정보 */}
            <div className="text-3xl font-extrabold text-foreground tracking-tight">
              {product.price === 0 ? (
                <span className="text-emerald-500">무료나눔</span>
              ) : (
                `${product.price.toLocaleString()}원`
              )}
            </div>

            {/* 상세 서브정보 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-2 border-y border-border/40 py-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {product.location || '위치 정보 없음'}
              </span>
              <span className="h-3 w-px bg-border/60" />
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {timeStr}
              </span>
              <span className="h-3 w-px bg-border/60" />
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-red-500 fill-red-500/10" />
                찜 {product.favoriteCount || product.likes || 0}
              </span>
              <span className="h-3 w-px bg-border/60" />
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4 text-primary" />
                번개톡 {product.chatCount || 0}
              </span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="mt-8 space-y-3">
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-2xl h-14">
                <Shield className="h-5 w-5" />
                Loopa Pay 안전결제
              </Button>
              <Button size="lg" variant="outline" className="flex-1 text-base font-bold gap-2 rounded-2xl h-14 border-border/80 hover:bg-muted/10">
                <MessageCircle className="h-5 w-5 text-primary" />
                1:1 번개톡 문의
              </Button>
            </div>
            <div className="flex gap-2 justify-between items-center text-xs text-muted-foreground px-1.5 pt-2">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Loopa Pay 결제 시 수수료 0원 이벤트 진행 중!
              </span>
              <button className="flex items-center gap-1 hover:text-foreground transition-colors font-medium">
                <Share2 className="h-3.5 w-3.5" />
                공유하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <hr className="border-border/60 my-12" />

      {/* 관련 추천 상품 섹션 */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">이 상품은 어떠세요? (관련 추천 상품)</h2>
        </div>

        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.pid || p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-muted/10 border border-dashed border-border/60">
            <span className="text-3xl mb-2 block">📦</span>
            <p className="text-sm text-muted-foreground">현재 동일한 카테고리의 추천 연관 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
