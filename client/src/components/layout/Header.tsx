'use client';

import Link from 'next/link';
import { Search, Bell, MessageCircle, Plus, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const NAV_LINKS = [
  { label: '전체 상품', href: '/products' },
  { label: '카테고리', href: '/categories' },
  { label: '인기 상품', href: '/popular' },
  { label: '무료 나눔', href: '/free' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-4 px-4">

        {/* 로고 */}
        <Link href="/" className="flex shrink-0 items-center gap-1.5">
          <span className="text-xl font-bold tracking-tight text-primary">Loopa</span>
        </Link>

        {/* 검색바 (데스크탑) */}
        <div className="relative hidden flex-1 max-w-md md:flex">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="상품명, 카테고리 검색"
            className="pl-9 bg-muted/50"
          />
        </div>

        {/* 데스크탑 내비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* 판매하기 버튼 */}
          <Button size="sm" className="hidden md:flex gap-1.5">
            <Plus className="h-4 w-4" />
            판매하기
          </Button>

          {/* 알림 */}
          <Button variant="ghost" size="icon" className="hidden md:flex relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          {/* 채팅 */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <MessageCircle className="h-5 w-5" />
          </Button>

          {/* 프로필 드롭다운 — Base UI: render prop 사용 */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="hidden md:flex items-center justify-center rounded-full p-1 hover:bg-accent transition-colors" />
              }
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* Base UI MenuItem는 asChild 미지원 → Link를 자식으로 */}
              <DropdownMenuItem className="p-0">
                <Link href="/profile" className="flex w-full px-1.5 py-1">
                  내 프로필
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link href="/my/products" className="flex w-full px-1.5 py-1">
                  내 상품 관리
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link href="/my/wishlist" className="flex w-full px-1.5 py-1">
                  찜한 상품
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-variant="destructive">
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 모바일 햄버거 메뉴 — Base UI: render prop 사용 */}
          <Sheet>
            <SheetTrigger
              render={
                <button className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-accent transition-colors" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-left text-lg font-bold">Loopa</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2 px-4">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="검색" className="pl-9" />
                </div>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2.5 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                  <Button className="w-full gap-1.5">
                    <Plus className="h-4 w-4" />
                    판매하기
                  </Button>
                  <Button variant="outline" className="w-full">로그인</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
