import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '平江颂 · 私宴邀请函',
  description: '金海华餐饮集团 · 米其林一星餐厅 · 专属私宴邀请函系统',
  keywords: ['宴请邀请函', '平江颂', '米其林餐厅', '私宴定制', '金海华'],
  authors: [{ name: '平江颂' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '平江颂私宴邀请函',
    title: '平江颂 · 私宴邀请函',
    description: '金海华餐饮集团 · 米其林一星餐厅 · 专属私宴邀请函系统',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: '平江颂私宴邀请函'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '平江颂 · 私宴邀请函',
    description: '金海华餐饮集团 · 米其林一星餐厅',
    images: ['/og-image.png']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.json'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1A1A1A'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
