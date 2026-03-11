'use client'

import Link from 'next/link'
import { Sparkles, Users, Printer, ChevronRight, Utensils } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e8e4de]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0a0a0a] rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-[#c9a962]" />
            </div>
            <span className="font-serif-title text-xl font-bold text-[#0a0a0a]">私宴通</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/list" 
              className="hidden sm:block px-4 py-2 text-[#6b6560] hover:text-[#0a0a0a] transition-colors"
            >
              宴请管理
            </Link>
            <Link 
              href="/admin" 
              className="px-5 py-2.5 bg-[#0a0a0a] text-white rounded-lg hover:bg-[#1a1a1a] transition-all hover:shadow-lg text-sm font-medium"
            >
              创建邀请函
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a962]/10 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#c9a962]" />
            <span className="text-sm text-[#a0854a] font-medium">高端餐饮私域解决方案</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif-title text-4xl sm:text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 leading-tight animate-fade-in delay-100">
            让每一场宴请
            <br />
            <span className="gold-gradient-text">更具仪式感</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#6b6560] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in delay-200">
            专为高端餐饮打造的私域宴请邀请函系统
            <br className="hidden sm:block" />
            一键生成优雅邀请函，提升宾客体验
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
            <Link 
              href="/admin"
              className="group flex items-center gap-2 px-8 py-4 bg-[#0a0a0a] text-white rounded-xl hover:bg-[#1a1a1a] transition-all shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">立即创建邀请函</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/admin/list"
              className="flex items-center gap-2 px-8 py-4 bg-white text-[#0a0a0a] border border-[#e8e4de] rounded-xl hover:border-[#c9a962] transition-all"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">管理宴请</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-sm text-[#c9a962] font-medium tracking-wider uppercase">核心功能</span>
            <h2 className="font-serif-title text-3xl font-bold text-[#0a0a0a] mt-2 mb-4">
              完整的宴请解决方案
            </h2>
            <div className="divider-gold"></div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-[#f7f5f0] rounded-2xl hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-[#0a0a0a] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-[#c9a962]" />
              </div>
              <h3 className="font-serif-title text-xl font-bold text-[#0a0a0a] mb-3">
                一键生成邀请函
              </h3>
              <p className="text-[#6b6560] leading-relaxed">
                填写宴请信息，系统自动生成优雅邀请函，包含菜单、品牌故事等完整信息，支持移动端完美展示。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-[#f7f5f0] rounded-2xl hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-[#0a0a0a] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-[#c9a962]" />
              </div>
              <h3 className="font-serif-title text-xl font-bold text-[#0a0a0a] mb-3">
                宾客 RSVP 管理
              </h3>
              <p className="text-[#6b6560] leading-relaxed">
                宾客可在线确认出席、填写忌口信息，实时统计出席人数，方便餐厅提前安排服务。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-[#f7f5f0] rounded-2xl hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-[#0a0a0a] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Printer className="w-7 h-7 text-[#c9a962]" />
              </div>
              <h3 className="font-serif-title text-xl font-bold text-[#0a0a0a] mb-3">
                智能打印物料
              </h3>
              <p className="text-[#6b6560] leading-relaxed">
                自动生成可打印菜单、桌卡和服务员信息卡，A4 纸张优化排版，让线下物料准备更轻松。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-serif-title text-4xl font-bold text-[#c9a962] mb-2">3步</div>
              <div className="text-white/60 text-sm">创建邀请函</div>
            </div>
            <div>
              <div className="font-serif-title text-4xl font-bold text-[#c9a962] mb-2">100%</div>
              <div className="text-white/60 text-sm">移动端适配</div>
            </div>
            <div>
              <div className="font-serif-title text-4xl font-bold text-[#c9a962] mb-2">3合1</div>
              <div className="text-white/60 text-sm">打印物料</div>
            </div>
            <div>
              <div className="font-serif-title text-4xl font-bold text-[#c9a962] mb-2">0元</div>
              <div className="text-white/60 text-sm">基础功能费用</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-sm text-[#c9a962] font-medium tracking-wider uppercase">使用流程</span>
            <h2 className="font-serif-title text-3xl font-bold text-[#0a0a0a] mt-2 mb-4">
              简单三步，优雅呈现
            </h2>
            <div className="divider-gold"></div>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: '填写信息', desc: '录入餐厅信息、宴请详情和今日菜单' },
              { num: '02', title: '生成邀请', desc: '系统自动生成精美的邀请函页面' },
              { num: '03', title: '分享宾客', desc: '一键分享链接，宾客可在线 RSVP' },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-serif-title font-bold text-[#e8e4de] mb-4">{step.num}</div>
                <h3 className="font-serif-title text-xl font-bold text-[#0a0a0a] mb-2">{step.title}</h3>
                <p className="text-[#6b6560]">{step.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 right-0 w-full h-px bg-[#e8e4de]"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0a0a0a] rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a962]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c9a962]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-white mb-4">
                开始您的第一场宴请
              </h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                立即创建邀请函，为您的宾客呈现一场完美的私宴体验
              </p>
              <Link 
                href="/admin"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a962] text-[#0a0a0a] rounded-xl font-bold hover:bg-[#e8d5a3] transition-all"
              >
                <Sparkles className="w-5 h-5" />
                免费创建邀请函
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#c9a962]/20 rounded-lg flex items-center justify-center">
                <Utensils className="w-4 h-4 text-[#c9a962]" />
              </div>
              <span className="font-serif-title text-lg font-bold text-white">私宴通</span>
            </div>
            <p className="text-white/40 text-sm">
              私域宴请邀请函系统 · 让宴请更有仪式感
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
