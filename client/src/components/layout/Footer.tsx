import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const FOOTER_LINKS = {
  서비스: [
    { label: '이용약관', href: '/terms' },
    { label: '개인정보처리방침', href: '/privacy' },
    { label: '고객센터', href: '/support' },
  ],
  회사: [
    { label: '회사 소개', href: '/about' },
    { label: '채용', href: '/careers' },
    { label: '공지사항', href: '/notice' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* 브랜드 */}
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold text-primary">Loopa</span>
            <p className="text-sm text-muted-foreground max-w-xs">
              당신 근처의 중고 거래, <br />
              안전하고 편리하게 Loopa에서.
            </p>
          </div>

          {/* 링크 그룹 */}
          <div className="flex gap-12">
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-3">
                <span className="text-sm font-semibold">{group}</span>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-xs text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} Loopa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
