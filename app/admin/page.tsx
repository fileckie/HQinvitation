'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronLeft, Plus, Trash2, Loader2,
  CheckCircle, Copy, Utensils, Sparkles,
  QrCode, Eye, Printer
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface Dish {
  name: string
  description?: string
  isSignature?: boolean
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    invitationId: string
    invitationUrl: string
    printUrl: string
  } | null>(null)
  const [showQR, setShowQR] = useState(false)

  // 表单状态
  const [formData, setFormData] = useState({
    restaurantName: '',
    restaurantAddress: '',
    restaurantPhone: '',
    restaurantDesc: '',
    chefName: '',
    chefIntro: '',
    title: '',
    date: '',
    time: '',
    guestCount: '',
    roomName: '',
    hostName: '',
    hostPhone: '',
    notes: '',
  })

  // 菜单
  const [dishes, setDishes] = useState<Dish[]>([
    { name: '', description: '', isSignature: false }
  ])

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
                请将以下链接或二维码分享给客户
              </p>
            </div>

            <div className="space-y-6">
              {/* 邀请函链接 */}
              <div className="bg-[#f7f5f0] p-4 rounded-xl">
                <label className="text-sm font-medium text-[#6b6560] mb-2 block">
                  邀请函链接
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
                  打印菜单链接（给餐厅使用）
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={result.printUrl}
                    readOnly
                    className="flex-1 px-4 py-2.5 bg-white border border-[#e8e4de] rounded-lg text-sm"
                  />
                  <button
                    onClick={() => copyLink(result.printUrl)}
                    className="px-4 py-2.5 bg-[#0a0a0a] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    复制
                  </button>
                </div>
              </div>

              {/* 二维码展示 */}
              <div className="bg-[#f7f5f0] p-6 rounded-xl text-center">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center gap-2 mx-auto text-[#c9a962] hover:text-[#a0854a] transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                  {showQR ? '隐藏二维码' : '显示二维码'}
                </button>
                {showQR && (
                  <div className="mt-4 flex justify-center">
                    <div className="p-4 bg-white rounded-xl">
                      <QRCodeSVG 
                        value={result.invitationUrl}
                        size={160}
                        level="M"
                        bgColor="white"
                        fgColor="#0a0a0a"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4 pt-4">
                <Link
                  href={result.invitationUrl}
                  target="_blank"
                  className="flex-1 px-6 py-3.5 bg-[#0a0a0a] text-white rounded-xl text-center font-medium hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  预览邀请函
                </Link>
                <Link
                  href={result.printUrl}
                  target="_blank"
                  className="flex-1 px-6 py-3.5 bg-[#f7f5f0] text-[#0a0a0a] border border-[#e8e4de] rounded-xl text-center font-medium hover:border-[#c9a962] hover:text-[#c9a962] transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  预览打印版
                </Link>
              </div>

              <button
                onClick={() => {
                  setResult(null)
                  setFormData({
                    restaurantName: '',
                    restaurantAddress: '',
                    restaurantPhone: '',
                    restaurantDesc: '',
                    chefName: '',
                    chefIntro: '',
                    title: '',
                    date: '',
                    time: '',
                    guestCount: '',
                    roomName: '',
                    hostName: '',
                    hostPhone: '',
                    notes: '',
                  })
                  setDishes([{ name: '', description: '', isSignature: false }])
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
          <Link 
            href="/admin/list"
            className="text-sm text-[#6b6560] hover:text-[#0a0a0a] transition-colors"
          >
            宴请列表
          </Link>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 餐厅信息 */}
          <section className="bg-white rounded-2xl border border-[#e8e4de] p-6">
            <h2 className="text-lg font-bold text-[#0a0a0a] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c9a962] text-white rounded-full text-sm flex items-center justify-center">1</span>
              餐厅信息
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm text-[#6b6560] mb-2">餐厅名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                  placeholder="如：得月楼私宴"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#6b6560] mb-2">餐厅地址 *</label>
                <input
                  type="text"
                  required
                  value={formData.restaurantAddress}
                  onChange={(e) => setFormData({...formData, restaurantAddress: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                  placeholder="详细地址"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2">联系电话 *</label>
                <input
                  type="tel"
                  required
                  value={formData.restaurantPhone}
                  onChange={(e) => setFormData({...formData, restaurantPhone: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                  placeholder="021-88888888"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2">主厨姓名</label>
                <input
                  type="text"
                  value={formData.chefName}
                  onChange={(e) => setFormData({...formData, chefName: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                  placeholder="主厨名字"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#6b6560] mb-2">品牌介绍</label>
                <textarea
                  rows={3}
                  value={formData.restaurantDesc}
                  onChange={(e) => setFormData({...formData, restaurantDesc: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] resize-none"
                  placeholder="餐厅品牌故事、特色等"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#6b6560] mb-2">主厨介绍</label>
                <textarea
                  rows={2}
                  value={formData.chefIntro}
                  onChange={(e) => setFormData({...formData, chefIntro: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] resize-none"
                  placeholder="主厨履历、擅长菜系等"
                />
              </div>
            </div>
          </section>

          {/* 宴请信息 */}
          <section className="bg-white rounded-2xl border border-[#e8e4de] p-6">
            <h2 className="text-lg font-bold text-[#0a0a0a] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c9a962] text-white rounded-full text-sm flex items-center justify-center">2</span>
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
                  placeholder="如：牡丹厅"
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
                <label className="block text-sm text-[#6b6560] mb-2">备注/忌口</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] resize-none"
                  placeholder="宾客忌口、特殊要求等"
                />
              </div>
            </div>
          </section>

          {/* 今日菜单 */}
          <section className="bg-white rounded-2xl border border-[#e8e4de] p-6">
            <h2 className="text-lg font-bold text-[#0a0a0a] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c9a962] text-white rounded-full text-sm flex items-center justify-center">3</span>
              今日菜单
            </h2>
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
              <button
                type="button"
                onClick={addDish}
                className="w-full py-3 border-2 border-dashed border-[#e8e4de] rounded-xl text-[#6b6560] hover:border-[#c9a962] hover:text-[#c9a962] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加菜品
              </button>
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
