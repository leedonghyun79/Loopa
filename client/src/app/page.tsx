import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Shield, Zap, MessageCircle } from 'lucide-react';
import ProductCard, { type Product } from '@/components/product/ProductCard';

// ── 더미 데이터 ───────────────────────────────────────────────────
const CATEGORIES = [
  { label: '디지털/가전', emoji: '📱' },
  { label: '의류/패션', emoji: '👗' },
  { label: '가구/인테리어', emoji: '🪑' },
  { label: '도서', emoji: '📚' },
  { label: '스포츠/레저', emoji: '⚽' },
  { label: '뷰티/미용', emoji: '💄' },
  { label: '식물', emoji: '🌿' },
  { label: '기타', emoji: '📦' },
];

const PRODUCTS: Product[] = [
  { id: 1, title: '애플 맥북 프로 M3 14인치', price: 1_850_000, location: '강남구', time: '10분 전', likes: 24, badge: '거래 중', category: '디지털/가전' },
  { id: 2, title: '에어팟 프로 2세대 미개봉', price: 220_000, location: '마포구', time: '32분 전', likes: 8, badge: null, category: '디지털/가전' },
  { id: 3, title: '닌텐도 스위치 OLED + 게임 4개', price: 380_000, location: '서초구', time: '1시간 전', likes: 15, badge: null, category: '게임' },
  { id: 4, title: '북유럽 원목 1인 소파', price: 95_000, location: '용산구', time: '2시간 전', likes: 5, badge: '예약 중', category: '가구/인테리어' },
  { id: 5, title: '겨울 무스탕 자켓 M사이즈', price: 45_000, location: '성동구', time: '3시간 전', likes: 3, badge: null, category: '의류/패션' },
  { id: 6, title: '다이슨 에어랩 컴플리트', price: 430_000, location: '노원구', time: '4시간 전', likes: 31, badge: null, category: '뷰티/미용' },
  { id: 7, title: '[무료나눔] 이케아 서랍장', price: 0, location: '송파구', time: '5시간 전', likes: 47, badge: '나눔', category: '가구/인테리어' },
  { id: 8, title: '캐논 EOS R50 + 렌즈 2개', price: 720_000, location: '강서구', time: '6시간 전', likes: 12, badge: null, category: '디지털/가전' },
];

const FEATURES = [
  { icon: Shield, title: '안전한 거래', desc: '사기 방지 시스템과 매너 온도로 안전하게 거래하세요.' },
  { icon: Zap, title: '빠른 직거래', desc: '가까운 동네에서 만나 빠르게 거래할 수 있어요.' },
  { icon: MessageCircle, title: '실시간 채팅', desc: '판매자/구매자와 실시간으로 소통해보세요.' },
];

export const dynamic = 'force-dynamic';

// ── 페이지 (Server Component) ─────────────────────────────────────
export default async function HomePage() {
  let displayProducts: Product[] = [];
  try {
    const res = await fetch('http://localhost:5000/products', { cache: 'no-store' });
    if (res.ok) {
      const dbProducts = await res.json();
      if (dbProducts && dbProducts.length > 0) {
        displayProducts = dbProducts.slice(0, 24); // Show top 24 products
      }
    }
  } catch (error) {
    console.error('Failed to fetch real products from API:', error);
  }

  // Fallback to dummy products if API is empty or failed
  if (displayProducts.length === 0) {
    displayProducts = PRODUCTS;
  }

  return (
    <div className="flex flex-col">

      {/* Hero 섹션 */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/10 border-b border-border overflow-hidden">
        <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 왼쪽: 메세지 */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <Badge variant="secondary" className="text-xs px-3 py-1 font-semibold rounded-full">
                🎉 신규 가입 시 거래 수수료 0원
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.25] text-foreground">
                내 근처에서 시작하는<br />
                <span className="text-primary bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">스마트한 중고거래</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Loopa에서 안전하게 필요 없는 물건을 판매하고,<br />
                이웃들의 질 좋고 유니크한 물건을 합리적인 가격에 구매해 보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Button size="lg" className="gap-2 rounded-2xl px-8 h-14 font-bold shadow-md hover:shadow-lg transition-all">
                  지금 둘러보기
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl px-8 h-14 font-bold border-border/80 hover:bg-muted/10">
                  판매 시작하기
                </Button>
              </div>
            </div>
            {/* 오른쪽: 제너레이트한 아름다운 3D 배너 이미지 */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none aspect-[4/3] rounded-3xl overflow-hidden border border-border/60 shadow-xl bg-card/50 backdrop-blur-md p-1.5 group">
                <img
                  src="/images/banner.png"
                  alt="Loopa Premium Platform Promotion"
                  className="h-full w-full object-cover rounded-[20px] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-[20px]" />
                <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md border border-border/40 rounded-xl p-3 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <div>
                      <p className="text-xs font-bold text-foreground">Loopa 트렌디 IT 기기 기획전</p>
                      <p className="text-[10px] text-muted-foreground">지금 가장 핫한 중고 전자기기 모아보기</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">카테고리</h2>
          <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
            전체 보기 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/categories/${cat.label}`}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 상품 목록 섹션 */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-4 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">최근 등록 상품</h2>
          <Link href="/products" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
            더 보기 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.pid || product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features 섹션 */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-screen-xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold mb-10">왜 Loopa인가요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-background border border-border">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 배너 */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-10">
        <div className="rounded-2xl bg-primary p-8 md:p-12 text-primary-foreground text-center">
          <h2 className="text-2xl md:text-3xl font-bold">지금 바로 판매 시작하세요</h2>
          <p className="mt-2 text-primary-foreground/70 text-sm md:text-base">
            등록 수수료 0원, 지금 내 물건을 올려보세요.
          </p>
          <Button size="lg" variant="secondary" className="mt-6">
            무료로 판매하기
          </Button>
        </div>
      </section>

    </div>
  );
}
