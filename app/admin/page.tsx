'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, Trash2, Loader2, CheckCircle, ArrowLeft,
  Sparkles, Download, QrCode, Eye
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface Dish {
  name: string
  description?: string
  isSignature?: boolean
}

// 平江颂默认数据
const DEFAULT_DATA = {
  restaurantName: '金海华·平江颂',
  restaurantAddress: '苏州市姑苏区平江街道大儒巷54号（清代丁春之旧宅）',
  restaurantPhone: '0512-68888888',
  restaurantDesc: '平江颂坐落于平江历史文化街区内，是高端餐饮品牌金海华打造的一处"新时代园林餐厅"。以明代园林为范本、明代美学文化为底色，每一处细节都展现了苏式美学生活的灵动气息。',
  chefName: 'Executive Chef',
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
  { name: '桂花秋月梨', description: '清润甜品', isSignature: false },
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

  const [formData, setFormData] = useState({ ...DEFAULT_DATA })
  const [dishes, setDishes] = useState<Dish[]>([...DEFAULT_MENU])

  const loadDefaultData = () => {
    setFormData({ ...DEFAULT_DATA })
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
    } finally {
      setLoading(false)
    }
  }

  // 成功页面
  if (result) {
    return (
      <div className="min-h-screen texture-paper py-20 px-8">
        <div className="max-w-2xl mx-auto">
          {/* 成功图标 */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 border border-[#C9A962] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#C9A962]" />
            </div>
            <h2 className="font-display text-3xl text-[#1A1A1A] mb-3">邀请函已创建</h2>
            <p className="text-[#8A8A8A]">您可以通过以下方式分享给客人</p>
          </div>

          <div className="space-y-6">
            {/* 操作按钮 */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href={result.invitationUrl}
                target="_blank"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-[#1A1A1A] text-white text-sm tracking-wider hover:bg-[#2C2C2C] transition-colors"
              >
                <Eye className="w-4 h-4" />
                预览邀请函
              </Link>
              <Link
                href={result.printUrl}
                target="_blank"
                className="flex items-center justify-center gap-2 px-6 py-4 border border-[#1A1A1A] text-[#1A1A1A] text-sm tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                打印物料
              </Link>
            </div>

            {/* 二维码 */}
            <div className="bg-white p-8 border border-[#E5E0D8]">
              <div className="text-center">
                <p className="text-xs tracking-[0.2em] text-[#8A8A8A] mb-6">扫描二维码查看邀请函</p>
                <div className="inline-block p-4 bg-[#FAF7F2]">
                  <QRCodeSVG 
                    value={result.invitationUrl}
                    size={160}
                    level="M"
                    bgColor="#FAF7F2"
                    fgColor="#1A1A1A"
                  />
                </div>
              </div>
            </div>

            {/* 链接 */}
            <div className="bg-[#F5F0E8] p-6">
              <p className="text-xs tracking-[0.2em] text-[#8A8A8A] mb-3">邀请函链接</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={result.invitationUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border border-[#E5E0D8] text-sm text-[#4A4A4A]"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.invitationUrl)
                    alert('链接已复制')
                  }}
                  className="px-6 py-3 bg-[#1A1A1A] text-white text-sm tracking-wider hover:bg-[#2C2C2C] transition-colors"
                >
                  复制
                </button>
              </div>
            </div>

            {/* 底部操作 */}
            <div className="flex justify-center gap-6 pt-6">
              <button
                onClick={() => {
                  setResult(null)
                  setFormData({ ...DEFAULT_DATA })
                  setDishes([...DEFAULT_MENU])
                }}
                className="text-sm text-[#4A4A4A] hover:text-[#C9A962] transition-colors border-b border-transparent hover:border-[#C9A962] pb-1"
              >
                创建新的邀请函
              </button>
              <Link
                href="/admin/list"
                className="text-sm text-[#4A4A4A] hover:text-[#C9A962] transition-colors border-b border-transparent hover:border-[#C9A962] pb-1"
              >
                查看宴请列表
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen texture-paper">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E5E0D8]">
        <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-display text-sm tracking-[0.15em] text-[#1A1A1A]">创建邀请函</span>
          </div>
          <button
            onClick={loadDefaultData}
            className="text-xs tracking-wider text-[#C9A962] hover:text-[#B87333] transition-colors"
          >
            重置为平江颂数据
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-8 pt-32 pb-20">
        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Section 1: 宴请信息 */}
          <section>
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-display text-4xl text-[#E5E0D8]">01</span>
              <h2 className="font-display text-xl text-[#1A1A1A] tracking-wider">宴请信息</h2>
            </div>
            
            <div className="space-y-6 pl-12">
              <div>
                <label className="block text-xs tracking-[0.2em] text-[#8A8A8A] mb-3">宴请主题 *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#E5E0D8] focus:border-[#C9A962] focus:outline-none text-lg text-[#1A1A1A] placeholder:text-[#C5C5C5]"
                  placeholder="如：王总家宴"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8A8A] mb-3">日期 *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#E5E0D8] focus:border-[#C9A962] focus:outline-none text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8A8A] mb-3">时间 *</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#E5E0D8] focus:border-[#C9A962] focus:outline-none text-[#1A1A1A]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8A8A] mb-3">包厢 *</label>
                  <input
                    type="text"
                    required
                    value={formData.roomName}
                    onChange={(e) => setFormData({...formData, roomName: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#E5E0D8] focus:border-[#C9A962] focus:outline-none text-[#1A1A1A] placeholder:text-[#C5C5C5]"
                    placeholder="颂雅轩"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8A8A] mb-3">人数 *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#E5E0D8] focus:border-[#C9A962] focus:outline-none text-[#1A1A1A]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8A8A] mb-3">主人姓名 *</label>
                  <input
                    type="text"
                    required
                    value={formData.hostName}
                    onChange={(e) => setFormData({...formData, hostName: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#E5E0D8] focus:border-[#C9A962] focus:outline-none text-[#1A1A1A] placeholder:text-[#C5C5C5]"
                    placeholder="主人姓名"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8A8A] mb-3">主人电话 *</label>
                  <input
                    type="tel"
                    required
                    value={formData.hostPhone}
                    onChange={(e) => setFormData({...formData, hostPhone: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#E5E0D8] focus:border-[#C9A962] focus:outline-none text-[#1A1A1A] placeholder:text-[#C5C5C5]"
                    placeholder="138****8888"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs tracking-[0.2em] text-[#8A8A8A] mb-3">对内备注（仅员工可见）</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#E5E0D8] focus:border-[#C9A962] focus:outline-none text-[#1A1A1A] placeholder:text-[#C5C5C5] resize-none"
                  placeholder="宾客忌口、特殊要求等"
                />
              </div>
            </div>
          </section>

          {/* Section 2: 菜单 */}
          <section>
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-display text-4xl text-[#E5E0D8]">02</span>
              <h2 className="font-display text-xl text-[#1A1A1A] tracking-wider">今日菜单</h2>
            </div>
            
            <div className="pl-12 space-y-4">
              {dishes.map((dish, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <span className="text-[#C9A962] text-sm mt-3 w-6">{index + 1}</span>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={dish.name}
                      onChange={(e) => updateDish(index, 'name', e.target.value)}
                      className="px-0 py-3 bg-transparent border-0 border-b border-[#E5E0D8] focus:border-[#C9A962] focus:outline-none text-[#1A1A1A] placeholder:text-[#C5C5C5]"
                      placeholder="菜品名称"
                    />
                    <input
                      type="text"
                      value={dish.description}
                      onChange={(e) => updateDish(index, 'description', e.target.value)}
                      className="px-0 py-3 bg-transparent border-0 border-b border-[#E5E0D8] focus:border-[#C9A962] focus:outline-none text-[#1A1A1A] placeholder:text-[#C5C5C5] text-sm"
                      placeholder="简介"
                    />
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dish.isSignature}
                          onChange={(e) => updateDish(index, 'isSignature', e.target.checked)}
                          className="w-4 h-4 border border-[#C9A962] rounded-none accent-[#C9A962]"
                        />
                        <span className="text-xs text-[#8A8A8A]">招牌</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeDish(index)}
                        className="ml-auto text-[#C5C5C5] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addDish}
                className="flex items-center gap-2 text-sm text-[#8A8A8A] hover:text-[#C9A962] transition-colors pt-4"
              >
                <Plus className="w-4 h-4" />
                添加菜品
              </button>
            </div>
          </section>

          {/* Section 3: 餐厅信息（只读） */}
          <section>
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-display text-4xl text-[#E5E0D8]">03</span>
              <h2 className="font-display text-xl text-[#1A1A1A] tracking-wider">餐厅信息</h2>
            </div>
            
            <div className="pl-12 py-8 bg-[#F5F0E8]">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">餐厅</span>
                  <span className="text-[#1A1A1A]">{formData.restaurantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">地址</span>
                  <span className="text-[#1A1A1A] text-right max-w-xs">{formData.restaurantAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">电话</span>
                  <span className="text-[#1A1A1A]">{formData.restaurantPhone}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="pl-12 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#1A1A1A] text-white text-sm tracking-[0.2em] hover:bg-[#2C2C2C] transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
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
