'use client'

import Link from 'next/link'
import { Sparkles, Users, Printer, ChevronRight, Utensils, MapPin, Calendar } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f5f0] paper-texture">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e8e4de]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0a0a0a] rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-[#c9a962]" />
            </div>
            <div>
              <span className="font-serif-title text-xl font-bold text-[#0a0a0a]">私宴通</span>
              <span className="hidden sm:inline text-xs text-[#6b6560] ml-2">平江颂·定制版</span>
            </div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a962]/10 rounded-full mb-8 animate-fade-in border border-[#c9a962]/20">
            <Sparkles className="w-4 h-4 text-[#c9a962]" />
            <span className="text-sm text-[#a0854a] font-medium">平江颂 · 米其林一星餐厅定制</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif-title text-4xl sm:text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 leading-tight animate-fade-in delay-100">
            一席私宴
            <br />
            <span className="gold-gradient-text">尽显东方雅韵</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#6b6560] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in delay-200">
            专为平江颂打造的私域宴请邀请函系统
            <br className="hidden sm:block" />
            一键生成雅致邀请函，让每场宴请更具仪式感
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
      <section className="py-20 px-6 bg-white border-y border-[#e8e4de]">
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
            <div className="group p-8 bg-[#f7f5f0] rounded-2xl hover:shadow-xl transition-all duration-300 border border-[#e8e4de]">
              <div className="w-14 h-14 bg-[#0a0a0a] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-[#c9a962]" />
              </div>
              <h3 className="font-serif-title text-xl font-bold text-[#0a0a0a] mb-3">
                一键生成邀请函
              </h3>
              <p className="text-[#6b6560] leading-relaxed">
                预填平江颂餐厅信息，快速生成精美邀请函。支持导出高清图片，主人可直接发送给客人。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-[#f7f5f0] rounded-2xl hover:shadow-xl transition-all duration-300 border border-[#e8e4de]">
              <div className="w-14 h-14 bg-[#0a0a0a] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Printer className="w-7 h-7 text-[#c9a962]" />
              </div>
              <h3 className="font-serif-title text-xl font-bold text-[#0a0a0a] mb-3">
                双版本打印物料
              </h3>
              <p className="text-[#6b6560] leading-relaxed">
                对外菜牌（给客人）+ 对内员工卡（含备注信息）。A4纸张优化，一键导出打印。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-[#f7f5f0] rounded-2xl hover:shadow-xl transition-all duration-300 border border-[#e8e4de]">
              <div className="w-14 h-14 bg-[#0a0a0a] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-[#c9a962]" />
              </div>
              <h3 className="font-serif-title text-xl font-bold text-[#0a0a0a] mb-3">
                宴请管理
              </h3>
              <p className="text-[#6b6560] leading-relaxed">
                查看所有宴请记录，管理 RSVP 回复，统计出席人数，让服务更加从容。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 平江颂介绍 */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm text-[#c9a962] font-medium tracking-wider uppercase">关于平江颂</span>
              <h2 className="font-serif-title text-3xl font-bold text-[#0a0a0a] mt-2 mb-6">
                米其林一星
                <br />
                新时代园林餐厅
              </h2>
              <div className="w-12 h-0.5 bg-[#c9a962] mb-6"></div>
              <p className="text-[#6b6560] leading-relaxed mb-6">
                平江颂坐落于平江历史文化街区内，是高端餐饮品牌金海华打造的一处"新时代园林餐厅"。以明代园林为范本、明代美学文化为底色，每一处细节都展现了苏式美学生活的灵动气息。
              </p>
              <p className="text-[#6b6560] leading-relaxed mb-6">
                漫步其中，叠山理水、曲桥回廊、松风竹影……尽是苏式园林的雅韵。一桌宴席，在舌尖展现古城的匠心独运。
              </p>
              <div className="flex items-center gap-2 text-sm text-[#6b6560]">
                <MapPin className="w-4 h-4 text-[#c9a962]" />
                <span>苏州市姑苏区平江街道大儒巷54号（清代丁春之旧宅）</span>
              </div>
            </div>
            <div className="bg-[#f7f5f0] rounded-2xl p-8 border border-[#e8e4de]">
              <h3 className="font-serif-title text-lg font-bold text-[#0a0a0a] mb-6">招牌菜品</h3>
              <div className="space-y-4">
                {[
                  { name: '海胆蟹钳杯', desc: '蟹钳鲜味与大连海胆甘甜' },
                  { name: '红烧河鳗', desc: '鱼皮糯、鱼肉烂，浓油赤酱' },
                  { name: '松鼠鳜鱼', desc: '苏帮菜经典，酸甜可口' },
                  { name: '平江颂蟹八件釜饭', desc: '蟹肉丰富，板栗粉糯' },
                ].map((dish, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-[#c9a962] font-serif-title">{index + 1}.</span>
                    <div>
                      <span className="font-medium text-[#0a0a0a]">{dish.name}</span>
                      <p className="text-sm text-[#6b6560]">{dish.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 bg-white border-y border-[#e8e4de]">
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
              { num: '01', title: '填写宴请信息', desc: '预填平江颂餐厅信息，只需填写主题、日期、主人信息' },
              { num: '02', title: '生成邀请函', desc: '系统自动生成精美邀请函，可导出图片或分享链接' },
              { num: '03', title: '打印物料', desc: '一键打印对外菜牌和对内员工卡，服务无忧' },
            ].map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="text-6xl font-serif-title font-bold text-[#e8e4de] mb-4">{step.num}</div>
                <h3 className="font-serif-title text-xl font-bold text-[#0a0a0a] mb-2">{step.title}</h3>
                <p className="text-[#6b6560]">{step.desc}</p>
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
                开启您的私宴之旅
              </h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                立即创建邀请函，为您的宾客呈现一场完美的苏式私宴体验
              </p>
              <Link 
                href="/admin"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a962] text-[#0a0a0a] rounded-xl font-bold hover:bg-[#e8d5a3] transition-all"
              >
                <Sparkles className="w-5 h-5" />
                创建邀请函
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
              平江颂定制版 · 让宴请更有仪式感
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
