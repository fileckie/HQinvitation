'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, Trash2, Loader2, CheckCircle, Copy, Utensils, Sparkles,
  QrCode, Eye, Printer, ImageIcon, ChevronLeft, RefreshCw
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toPng } from 'html-to-image'

interface Dish {
  name: string
  description?: string
  isSignature?: boolean
}

// 平江颂默认数据
const PINGJIANGSONG_DATA = {
  restaurantName: '金海华·平江颂',
  restaurantAddress: '苏州市姑苏区平江街道大儒巷54号（清代丁春之旧宅）',
  restaurantPhone: '0512-68888888',
  restaurantDesc: '平江颂坐落于平江历史文化街区内，是高端餐饮品牌金海华打造的一处"新时代园林餐厅"。以明代园林为范本、明代美学文化为底色，每一处细节都展现了苏式美学生活的灵动气息。米其林一星餐厅，主推当代苏菜，遵循"不时不食"原则。',
  chefName: ' Executive Chef',
  chefIntro: '主厨团队秉承苏帮菜传统精髓，守正鼎新，以工笔技法雕琢苏菜之魂。',
  title: '',
  date: '',
  time: '18:00',
  guestCount: '8',
  roomName: '颂雅轩',
  hostName: '',
  hostPhone: '',
  notes: '',
}

// 平江颂春季示例菜单
const DEFAULT_MENU: Dish[] = [
  { name: '海胆蟹钳杯', description: '蟹钳、蟹膏鲜味与大连海胆甘甜', isSignature: true },
  { name: '菊花拌', description: '白鱼松、小榄餐菊拌柚子醋', isSignature: true },
  { name: '红烧河鳗', description: '鱼皮糯、鱼肉烂，浓油赤酱', isSignature: true },
  { name: '灵岩山草头干红烧肉', description: '肉香与草头干香气交织', isSignature: true },
  { name: '松鼠鳜鱼', description: '苏帮菜经典，酸甜可口', isSignature: false },
  { name: '莼菜银鱼羹', description: '太湖三白，清鲜爽滑', isSignature: false },
  { name: '鸡头米虾仁', description: '时令河鲜，鲜嫩弹牙', isSignature: false },
  { name: '平江颂蟹八件釜饭', description: '蟹肉、蟹钳、板栗粉糯', isSignature: true },
  { name: '红糖燕窝汁', description: '洞燕配合老红糖与老姜熬制', isSignature: false },
  { name: '桂花秋月梨', description: '清润甜品，秋季限定', isSignature: false },
]

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    invitationId: string
    invitationUrl: string
    printUrl: string
  } | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [exporting, setExporting] = useState(false)

  // 表单状态
  const [formData, setFormData] = useState({ ...PINGJIANGSONG_DATA })
  const [dishes, setDishes] = useState<Dish[]>([...DEFAULT_MENU])

  // 加载默认数据
  const loadDefaultData = () => {
    setFormData({ ...PINGJIANGSONG_DATA })
    setDishes([...DEFAULT_MENU])
  }

  const addDish = () => {
    setDishes([...dishes, { name: '', description: '', isSignature: false }])
  }

  const removeDish = (index: number) => {
    if (dishes.length > 1) {
      setDishes(dishes.filter((_, i) => i !== index))
    }
  }

  const updateDish = (index: number, field: keyof Dish, value: string | boolean) => {
    const newDishes = [...dishes]
    newDishes[index] = { ...newDishes[index], [field]: value }
    setDishes(newDishes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validDishes = dishes.filter(d => d.name.trim())
      
      const response = await fetch('/api/banquet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          menu: validDishes
        })
      })

      if (!response.ok) throw new Error('创建失败')

      const data = await response.json()
      setResult({
        invitationId: data.id,
        invitationUrl: `${window.location.origin}/invitation/${data.id}`,
        printUrl: `${window.location.origin}/print/${data.id}`
      })
    } catch (error) {
      alert('创建失败，请重试')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('链接已复制')
  }

  // 导出邀请函图片
  const exportInvitationImage = async () => {
    if (!result) return
    setExporting(true)
    try {
      const response = await fetch(`/api/banquet/${result.invitationId}`)
      const data = await response.json()
      
      // 创建临时容器
      const container = document.createElement('div')
      container.style.width = '375px'
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.background = '#faf9f7'
      document.body.appendChild(container)
      
      // 渲染邀请函内容（简化版）
      container.innerHTML = `
        <div style="background: #faf9f7; min-height: 100%; padding: 0;">
          <div style="height: 4px; background: linear-gradient(135deg, #a0854a 0%, #c9a962 50%, #e8d5a3 100%);"></div>
          <div style="background: #0a0a0a; color: white; padding: 40px 24px; text-align: center;">
            <p style="color: #c9a962; font-size: 12px; letter-spacing: 3px; margin-bottom: 16px;">${data.restaurant.name}</p>
            <h1 style="font-size: 28px; margin-bottom: 12px;">诚挚邀请</h1>
            <div style="width: 48px; height: 1px; background: #c9a962; margin: 16px auto;"></div>
            <p style="color: rgba(255,255,255,0.8); font-size: 18px;">${data.title}</p>
          </div>
          <div style="padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <p style="color: #6b6560; font-size: 14px; margin-bottom: 8px;">${data.date} · ${data.time}</p>
              <p style="color: #0a0a0a; font-size: 20px; font-weight: bold;">${data.roomName}</p>
            </div>
            <div style="background: #f7f5f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e8e4de;">
              <p style="color: #0a0a0a; font-weight: bold; margin-bottom: 8px;">${data.restaurant.name}</p>
              <p style="color: #6b6560; font-size: 13px; line-height: 1.6;">${data.restaurant.address}</p>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <p style="color: #c9a962; font-size: 14px; margin-bottom: 12px;">今日菜单</p>
              ${data.menu.slice(0, 5).map((dish: any, i: number) => `
                <p style="color: #0a0a0a; font-size: 14px; margin: 8px 0;">${i + 1}. ${dish.name}</p>
              `).join('')}
              ${data.menu.length > 5 ? `<p style="color: #6b6560; font-size: 12px;">...等${data.menu.length}道菜品</p>` : ''}
            </div>
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e8e4de;">
              <p style="color: #6b6560; font-size: 13px;">设宴：${data.hostName}</p>
              <p style="color: #c9a962; font-size: 12px; margin-top: 8px;">期待您的光临</p>
            </div>
          </div>
          <div style="height: 4px; background: linear-gradient(135deg, #a0854a 0%, #c9a962 50%, #e8d5a3 100%);"></div>
        </div>
      `
      
      const dataUrl = await toPng(container, { quality: 0.95 })
      
      // 下载图片
      const link = document.createElement('a')
      link.download = `${data.title}_邀请函.png`
      link.href = dataUrl
      link.click()
      
      document.body.removeChild(container)
    } catch (error) {
      alert('导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4de] p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-serif-title text-2xl font-bold text-[#0a0a0a] mb-2">
                邀请函创建成功！
              </h2>
              <p className="text-[#6b6560]">
                您可以通过以下方式分享给客人
              </p>
            </div>

            <div className="space-y-6">
              {/* 快速操作按钮 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={exportInvitationImage}
                  disabled={exporting}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#c9a962] text-white rounded-xl hover:bg-[#a0854a] transition-colors disabled:opacity-50"
                >
                  <ImageIcon className="w-5 h-5" />
                  {exporting ? '导出中...' : '导出图片'}
                </button>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0a0a0a] text-white rounded-xl hover:bg-[#1a1a1a] transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                  {showQR ? '隐藏二维码' : '查看二维码'}
                </button>
              </div>

              {/* 二维码展示 */}
              {showQR && (
                <div className="bg-[#f7f5f0] p-6 rounded-xl text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white rounded-xl">
                      <QRCodeSVG 
                        value={result.invitationUrl}
                        size={200}
                        level="M"
                        bgColor="white"
                        fgColor="#0a0a0a"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-[#6b6560]">微信扫一扫查看邀请函</p>
                </div>
              )}

              {/* 邀请函链接 */}
              <div className="bg-[#f7f5f0] p-4 rounded-xl">
                <label className="text-sm font-medium text-[#6b6560] mb-2 block">
                  邀请函链接（发给客人）
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={result.invitationUrl}
                    readOnly
                    className="flex-1 px-4 py-2.5 bg-white border border-[#e8e4de] rounded-lg text-sm"
                  />
                  <button
                    onClick={() => copyLink(result.invitationUrl)}
                    className="px-4 py-2.5 bg-[#0a0a0a] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    复制
                  </button>
                </div>
              </div>

              {/* 打印链接 */}
              <div className="bg-[#f7f5f0] p-4 rounded-xl">
                <label className="text-sm font-medium text-[#6b6560] mb-2 block">
                  打印物料（对内使用）
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={result.printUrl}
                    readOnly
                    className="flex-1 px-4 py-2.5 bg-white border border-[#e8e4de] rounded-lg text-sm"
                  />
                  <Link
                    href={result.printUrl}
                    target="_blank"
                    className="px-4 py-2.5 bg-white border border-[#e8e4de] text-[#0a0a0a] rounded-lg hover:border-[#c9a962] transition-colors flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    打开
                  </Link>
                </div>
                <p className="text-xs text-[#6b6560] mt-2">
                  包含：对外菜牌（给客人）+ 对内员工卡（含备注信息）
                </p>
              </div>

              {/* 预览按钮 */}
              <div className="flex gap-3">
                <Link
                  href={result.invitationUrl}
                  target="_blank"
                  className="flex-1 py-3.5 bg-[#0a0a0a] text-white rounded-xl text-center font-medium hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  预览邀请函
                </Link>
              </div>

              <button
                onClick={() => {
                  setResult(null)
                  setFormData({ ...PINGJIANGSONG_DATA })
                  setDishes([...DEFAULT_MENU])
                  setShowQR(false)
                }}
                className="w-full px-6 py-3.5 border border-[#e8e4de] text-[#6b6560] rounded-xl font-medium hover:border-[#c9a962] hover:text-[#c9a962] transition-colors"
              >
                创建新的邀请函
              </button>
              
              <Link
                href="/admin/list"
                className="w-full block px-6 py-3.5 text-center text-[#6b6560] hover:text-[#0a0a0a] transition-colors"
              >
                返回宴请列表 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e4de] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#6b6560] hover:text-[#0a0a0a]">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#0a0a0a] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#c9a962]" />
              </div>
              <h1 className="font-serif-title text-lg font-bold text-[#0a0a0a]">创建宴请邀请函</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadDefaultData}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#c9a962] hover:bg-[#c9a962]/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              加载平江颂数据
            </button>
            <Link 
              href="/admin/list"
              className="text-sm text-[#6b6560] hover:text-[#0a0a0a] transition-colors"
            >
              宴请列表
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 平江颂提示 */}
          <div className="bg-[#c9a962]/10 border border-[#c9a962]/20 rounded-xl p-4 flex items-start gap-3">
            <Utensils className="w-5 h-5 text-[#c9a962] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-[#a0854a] font-medium">平江颂 · 米其林一星餐厅</p>
              <p className="text-xs text-[#a0854a]/80 mt-1">
                已预填餐厅信息，只需填写宴请主题、日期、主人信息即可快速创建
              </p>
            </div>
          </div>

          {/* 宴请信息 */}
          <section className="bg-white rounded-2xl border border-[#e8e4de] p-6">
            <h2 className="text-lg font-bold text-[#0a0a0a] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c9a962] text-white rounded-full text-sm flex items-center justify-center">1</span>
              宴请信息
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm text-[#6b6560] mb-2">宴请主题 *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                  placeholder="如：王总家宴、商务宴请"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2">宴请日期 *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2">宴请时间 *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2">宾客人数 *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2">包厢名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.roomName}
                  onChange={(e) => setFormData({...formData, roomName: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                  placeholder="如：颂雅轩"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2">宴请主人 *</label>
                <input
                  type="text"
                  required
                  value={formData.hostName}
                  onChange={(e) => setFormData({...formData, hostName: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                  placeholder="主人姓名"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2">主人电话 *</label>
                <input
                  type="tel"
                  required
                  value={formData.hostPhone}
                  onChange={(e) => setFormData({...formData, hostPhone: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                  placeholder="138****8888"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#6b6560] mb-2">对内备注（员工可见）</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] resize-none"
                  placeholder="宾客忌口、特殊要求、服务注意事项等（仅员工信息卡可见）"
                />
              </div>
            </div>
          </section>

          {/* 今日菜单 */}
          <section className="bg-white rounded-2xl border border-[#e8e4de] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#0a0a0a] flex items-center gap-2">
                <span className="w-6 h-6 bg-[#c9a962] text-white rounded-full text-sm flex items-center justify-center">2</span>
                今日菜单
              </h2>
              <button
                type="button"
                onClick={addDish}
                className="flex items-center gap-2 px-4 py-2 bg-[#c9a962] text-white rounded-lg hover:bg-[#a0854a] transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                添加菜品
              </button>
            </div>
            <div className="space-y-3">
              {dishes.map((dish, index) => (
                <div key={index} className="flex gap-3 items-start p-4 bg-[#f7f5f0] rounded-xl">
                  <div className="flex-1 grid md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={dish.name}
                      onChange={(e) => updateDish(index, 'name', e.target.value)}
                      className="px-4 py-2.5 border border-[#e8e4de] rounded-lg focus:outline-none focus:border-[#c9a962] bg-white"
                      placeholder="菜品名称"
                    />
                    <input
                      type="text"
                      value={dish.description}
                      onChange={(e) => updateDish(index, 'description', e.target.value)}
                      className="px-4 py-2.5 border border-[#e8e4de] rounded-lg focus:outline-none focus:border-[#c9a962] bg-white"
                      placeholder="菜品简介（可选）"
                    />
                    <label className="flex items-center gap-2 px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={dish.isSignature}
                        onChange={(e) => updateDish(index, 'isSignature', e.target.checked)}
                        className="w-4 h-4 text-[#c9a962] rounded focus:ring-[#c9a962]"
                      />
                      <span className="text-sm text-[#6b6560]">招牌菜</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDish(index)}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 餐厅信息（可折叠） */}
          <section className="bg-white rounded-2xl border border-[#e8e4de] p-6">
            <h2 className="text-lg font-bold text-[#0a0a0a] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c9a962] text-white rounded-full text-sm flex items-center justify-center">3</span>
              餐厅信息
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm text-[#6b6560] mb-2">餐厅名称</label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] bg-[#f7f5f0]"
                  readOnly
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#6b6560] mb-2">餐厅地址</label>
                <input
                  type="text"
                  value={formData.restaurantAddress}
                  onChange={(e) => setFormData({...formData, restaurantAddress: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] bg-[#f7f5f0]"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2">联系电话</label>
                <input
                  type="tel"
                  value={formData.restaurantPhone}
                  onChange={(e) => setFormData({...formData, restaurantPhone: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] bg-[#f7f5f0]"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2">主厨</label>
                <input
                  type="text"
                  value={formData.chefName}
                  onChange={(e) => setFormData({...formData, chefName: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] bg-[#f7f5f0]"
                  readOnly
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#6b6560] mb-2">品牌介绍</label>
                <textarea
                  rows={3}
                  value={formData.restaurantDesc}
                  onChange={(e) => setFormData({...formData, restaurantDesc: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] resize-none bg-[#f7f5f0]"
                  readOnly
                />
              </div>
            </div>
          </section>

          {/* 提交按钮 */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-[#0a0a0a] text-white rounded-xl font-bold text-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  生成邀请函
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
