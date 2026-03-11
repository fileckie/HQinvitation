'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen texture-paper">
      {/* Navigation - 极简 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 md:px-16 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg tracking-[0.2em] text-[#1A1A1A]">平江颂</span>
            <span className="hidden sm:inline text-xs text-[#8A8A8A] tracking-wider">|</span>
            <span className="hidden sm:inline text-xs text-[#8A8A8A] tracking-wider">私宴定制</span>
          </div>
          <Link 
            href="/admin" 
            className="text-sm tracking-wider text-[#1A1A1A] hover:text-[#C9A962] transition-colors"
          >
            创建邀请函
          </Link>
        </div>
      </nav>

      {/* Hero Section - 大量留白 */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 pt-20">
        <div className="max-w-4xl">
          {/* 小标题 */}
          <p className="text-xs tracking-[0.3em] text-[#8A8A8A] mb-8 animate-fade-in">
            金海华餐饮集团 · 米其林一星
          </p>
          
          {/* 主标题 */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] leading-[1.1] mb-8 animate-slide-up">
            一席私宴
            <br />
            <span className="text-[#4A4A4A]">尽显东方雅韵</span>
          </h1>
          
          {/* 分隔线 */}
          <div className="w-16 h-px bg-[#C9A962] mb-8 animate-fade-in delay-200"></div>
          
          {/* 描述 */}
          <p className="text-base md:text-lg text-[#4A4A4A] max-w-xl leading-relaxed mb-12 animate-fade-in delay-300">
            为平江颂量身定制的私域宴请邀请函系统
            <br className="hidden md:block" />
            一键生成雅致邀请函，让每场宴请更具仪式感
          </p>
          
          {/* CTA */}
          <div className="flex flex-wrap items-center gap-6 animate-fade-in delay-400">
            <Link 
              href="/admin"
              className="group flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white text-sm tracking-wider hover:bg-[#2C2C2C] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              创建邀请函
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/admin/list"
              className="text-sm tracking-wider text-[#4A4A4A] hover:text-[#C9A962] transition-colors border-b border-[#E5E0D8] pb-1 hover:border-[#C9A962]"
            >
              管理宴请
            </Link>
          </div>
        </div>
      </section>

      {/* 平江颂介绍 - 两栏布局 */}
      <section className="py-32 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* 左栏 */}
            <div>
              <p className="text-xs tracking-[0.3em] text-[#C9A962] mb-6">ABOUT</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] leading-tight mb-8">
                新时代
                <br />
                园林餐厅
              </h2>
              <div className="w-12 h-px bg-[#C9A962] mb-8"></div>
            </div>
            
            {/* 右栏 */}
            <div className="space-y-6">
              <p className="text-[#4A4A4A] leading-[1.8]">
                平江颂坐落于平江历史文化街区内，是高端餐饮品牌金海华打造的一处"新时代园林餐厅"。以明代园林为范本、明代美学文化为底色，每一处细节都展现了苏式美学生活的灵动气息。
              </p>
              <p className="text-[#4A4A4A] leading-[1.8]">
                漫步其中，叠山理水、曲桥回廊、松风竹影……尽是苏式园林的雅韵。一桌宴席，在舌尖展现古城的匠心独运。
              </p>
              <div className="pt-6 border-t border-[#E5E0D8]">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs tracking-[0.2em] text-[#8A8A8A] mb-2">地址</p>
                    <p className="text-sm text-[#1A1A1A]">苏州市姑苏区平江街道大儒巷54号</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.2em] text-[#8A8A8A] mb-2">荣誉</p>
                    <p className="text-sm text-[#1A1A1A]">米其林一星餐厅</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特点 - 三栏 */}
      <section className="py-32 px-8 md:px-16 texture-paper">
        <div className="max-w-6xl mx-auto">
          {/* 标题 */}
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.3em] text-[#8A8A8A] mb-4">FEATURES</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A]">核心功能</h2>
          </div>
          
          {/* 三栏 */}
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                num: '01',
                title: '一键生成',
                desc: '预填平江颂餐厅信息，快速生成精美邀请函。支持导出高清图片，主人可直接发送给客人。'
              },
              {
                num: '02',
                title: '双版物料',
                desc: '对外菜牌彰显品味，对内员工卡含服务备注。A4纸张优化，一键导出打印。'
              },
              {
                num: '03',
                title: '宴请管理',
                desc: '查看所有宴请记录，管理 RSVP 回复，统计出席人数，让服务更加从容。'
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <span className="font-display text-5xl text-[#E5E0D8] group-hover:text-[#C9A962] transition-colors duration-500">
                  {item.num}
                </span>
                <h3 className="font-display text-xl text-[#1A1A1A] mt-6 mb-4">{item.title}</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 招牌菜品 */}
      <section className="py-32 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* 左栏 - 标题 */}
            <div className="md:sticky md:top-32">
              <p className="text-xs tracking-[0.3em] text-[#C9A962] mb-6">SIGNATURE</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] leading-tight">
                招牌
                <br />
                菜品
              </h2>
              <div className="w-12 h-px bg-[#C9A962] mt-8"></div>
            </div>
            
            {/* 右栏 - 菜品列表 */}
            <div className="space-y-0">
              {[
                { name: '海胆蟹钳杯', desc: '蟹钳鲜味与大连海胆甘甜', price: '' },
                { name: '红烧河鳗', desc: '鱼皮糯、鱼肉烂，浓油赤酱', price: '' },
                { name: '松鼠鳜鱼', desc: '苏帮菜经典，酸甜可口', price: '' },
                { name: '平江颂蟹八件釜饭', desc: '蟹肉丰富，板栗粉糯', price: '' },
                { name: '菊花拌', desc: '白鱼松、小榄餐菊拌柚子醋', price: '' },
              ].map((dish, index) => (
                <div 
                  key={index} 
                  className="py-6 border-b border-[#E5E0D8] first:pt-0 group hover:border-[#C9A962] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-lg text-[#1A1A1A] mb-1 group-hover:text-[#C9A962] transition-colors">
                        {dish.name}
                      </h3>
                      <p className="text-sm text-[#8A8A8A]">{dish.desc}</p>
                    </div>
                    <span className="text-xs text-[#C9A962] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      招牌
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 md:px-16 texture-paper">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-[#8A8A8A] mb-6">START NOW</p>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mb-8">
            开启您的私宴之旅
          </h2>
          <p className="text-[#4A4A4A] mb-12 max-w-lg mx-auto">
            立即创建邀请函，为您的宾客呈现一场完美的苏式私宴体验
          </p>
          <Link 
            href="/admin"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#1A1A1A] text-white text-sm tracking-wider hover:bg-[#2C2C2C] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            创建邀请函
          </Link>
        </div>
      </section>

      {/* Footer - 极简 */}
      <footer className="py-12 px-8 md:px-16 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="font-display text-sm tracking-[0.2em] text-white">平江颂</span>
            <span className="text-xs text-[#8A8A8A]">|</span>
            <span className="text-xs text-[#8A8A8A] tracking-wider">米其林一星餐厅</span>
          </div>
          <p className="text-xs text-[#8A8A8A] tracking-wider">
            私宴通定制版 · 让宴请更具仪式感
          </p>
        </div>
      </footer>
    </div>
  )
}
