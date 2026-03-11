'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { toPng } from 'html-to-image'
import { 
  MapPin, Phone, User, Users, Clock, Calendar, ChefHat, 
  Sparkles, Utensils, Share2, Download, CheckCircle, X,
  MessageSquare
} from 'lucide-react'

interface Dish {
  name: string
  description?: string
  isSignature?: boolean
}

interface RSVPData {
  id: string
  guestName: string
  status: string
  attendeeCount: number
}

interface BanquetData {
  id: string
  title: string
  date: string
  time: string
  guestCount: number
  roomName: string
  hostName: string
  hostPhone: string
  notes?: string
  menu: Dish[]
  specialDishes: Dish[]
  rsvps: RSVPData[]
  restaurant: {
    name: string
    address: string
    phone: string
    description?: string
    chefName?: string
    chefIntro?: string
  }
}

export default function InvitationPage() {
  const params = useParams()
  const [data, setData] = useState<BanquetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showShare, setShowShare] = useState(false)
  const [exporting, setExporting] = useState(false)
  const invitationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/banquet/${params.id}`)
        if (!response.ok) throw new Error('Not found')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError('邀请函不存在或已过期')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  // 导出邀请函图片
  const exportImage = async () => {
    if (!invitationRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(invitationRef.current, { 
        quality: 0.95, 
        pixelRatio: 2,
        cacheBust: true
      })
      
      const link = document.createElement('a')
      link.download = `${data?.title}_邀请函.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      alert('导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

  // 分享功能
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `诚挚邀请 - ${data?.title}`,
          text: `${data?.hostName} 诚邀您参加 ${data?.title}`,
          url: window.location.href
        })
      } catch {
        setShowShare(true)
      }
    } else {
      setShowShare(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-white/60 mb-4">{error}</p>
          <a href="/" className="text-[#c9a962] hover:underline">
            返回首页
          </a>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
    return {
      month: months[date.getMonth()],
      day: date.getDate(),
      weekday: weekdays[date.getDay()],
      full: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
  }

  const dateInfo = formatDate(data.date)
  const confirmedCount = data.rsvps?.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.attendeeCount, 0) || 0

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* 导出按钮 - 固定在右上角 */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={exportImage}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-[#c9a962] text-white rounded-full shadow-lg hover:bg-[#a0854a] transition-all disabled:opacity-50 text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          {exporting ? '导出中...' : '保存图片'}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full shadow-lg hover:bg-white/20 transition-all text-sm font-medium"
        >
          <Share2 className="w-4 h-4" />
          分享
        </button>
      </div>

      {/* 邀请函主体 */}
      <div 
        ref={invitationRef}
        className="max-w-md mx-auto bg-[#faf9f7] min-h-screen shadow-2xl relative"
      >
        {/* 顶部装饰条 */}
        <div className="h-1.5" style={{ background: 'linear-gradient(135deg, #a0854a 0%, #c9a962 50%, #e8d5a3 100%)' }}></div>
        
        {/* 邀请函头部 */}
        <div className="relative bg-[#0a0a0a] text-white px-6 py-12 text-center overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-4 left-4 w-24 h-24 border border-[#c9a962] rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 border border-[#c9a962] rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <p className="text-[#c9a962] text-xs tracking-[0.3em] uppercase mb-4">
              {data.restaurant.name}
            </p>
            <h1 className="font-serif-title text-3xl font-bold mb-3">
              诚挚邀请
            </h1>
            <div className="w-12 h-px bg-[#c9a962] mx-auto mb-4"></div>
            <p className="text-white/80 text-lg">
              {data.title}
            </p>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="px-6 py-8">
          {/* 时间 */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#c9a962]" />
              <span className="text-sm text-[#6b6560]">{dateInfo.full}</span>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="font-serif-title text-4xl font-bold text-[#0a0a0a]">{dateInfo.day}</div>
                <div className="text-sm text-[#6b6560]">{dateInfo.month}月 · {dateInfo.weekday}</div>
              </div>
              <div className="w-px h-12 bg-[#e8e4de]"></div>
              <div className="text-center">
                <div className="font-serif-title text-4xl font-bold text-[#0a0a0a]">{data.time}</div>
                <div className="text-sm text-[#6b6560]">恭候光临</div>
              </div>
            </div>
          </div>

          {/* 地点信息 */}
          <div className="bg-[#f7f5f0] rounded-xl p-6 mb-8 border border-[#e8e4de]">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-[#c9a962] mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-[#0a0a0a]">{data.restaurant.name}</div>
                <div className="text-sm text-[#6b6560] mt-1">{data.restaurant.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Utensils className="w-5 h-5 text-[#c9a962] flex-shrink-0" />
              <div className="text-sm">
                <span className="text-[#6b6560]">包厢：</span>
                <span className="font-medium text-[#0a0a0a]">{data.roomName}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#c9a962] flex-shrink-0" />
              <div className="text-sm">
                <span className="text-[#6b6560]">宴请人数：</span>
                <span className="font-medium text-[#0a0a0a]">{data.guestCount}位</span>
              </div>
            </div>
          </div>

          {/* 今日菜单 */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-px bg-[#c9a962]"></div>
              <ChefHat className="w-5 h-5 text-[#c9a962]" />
              <h2 className="font-serif-title text-xl font-bold text-[#0a0a0a]">今日菜单</h2>
              <ChefHat className="w-5 h-5 text-[#c9a962]" />
              <div className="w-8 h-px bg-[#c9a962]"></div>
            </div>
            
            <div className="border border-[#e8e4de] rounded-xl overflow-hidden bg-white">
              {data.menu.map((dish, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between px-5 py-4 ${
                    index !== data.menu.length - 1 ? 'border-b border-[#f0ede8]' : ''
                  } ${dish.isSignature ? 'bg-[#c9a962]/5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#c9a962] text-sm font-serif-title w-6">{index + 1}</span>
                    <div>
                      <span className={`${dish.isSignature ? 'font-bold text-[#0a0a0a]' : 'text-[#0a0a0a]'}`}>
                        {dish.name}
                      </span>
                      {dish.description && (
                        <p className="text-xs text-[#6b6560] mt-0.5">{dish.description}</p>
                      )}
                    </div>
                  </div>
                  {dish.isSignature && (
                    <span className="text-xs px-2 py-1 bg-[#c9a962] text-white rounded-full">
                      招牌
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 主厨推荐 */}
          {(data.restaurant.chefName || data.specialDishes?.length > 0) && (
            <div className="bg-[#0a0a0a] rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#c9a962]" />
                <h3 className="font-serif-title text-lg font-bold text-white">主厨推荐</h3>
              </div>
              {data.restaurant.chefName && (
                <p className="text-sm text-white/70 mb-3">
                  {data.restaurant.chefName} {data.restaurant.chefIntro && `· ${data.restaurant.chefIntro}`}
                </p>
              )}
              {data.specialDishes?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.specialDishes.map((dish, index) => (
                    <span 
                      key={index}
                      className="text-sm px-3 py-1 bg-[#c9a962]/20 text-[#c9a962] rounded-full"
                    >
                      {dish.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 品牌介绍 */}
          {data.restaurant.description && (
            <div className="text-center mb-8">
              <div className="w-12 h-px bg-[#e8e4de] mx-auto mb-4"></div>
              <p className="text-sm text-[#6b6560] leading-relaxed max-w-sm mx-auto">
                {data.restaurant.description}
              </p>
            </div>
          )}

          {/* 主人信息 */}
          <div className="border-t border-[#e8e4de] pt-6 mb-6">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#c9a962]" />
                <span className="text-[#6b6560]">设宴：{data.hostName}</span>
              </div>
              <a href={`tel:${data.hostPhone}`} className="flex items-center gap-2 text-[#c9a962] hover:underline">
                <Phone className="w-4 h-4" />
                <span>联系主人</span>
              </a>
            </div>
          </div>

          {/* 餐厅电话 */}
          <div className="text-center mb-8">
            <p className="text-xs text-[#6b6560] mb-1">预订咨询</p>
            <a href={`tel:${data.restaurant.phone}`} className="text-lg font-bold text-[#0a0a0a]">
              {data.restaurant.phone}
            </a>
          </div>

          {/* 底部提示 */}
          <div className="text-center">
            <p className="text-xs text-[#6b6560]">
              期待与您相见 · {data.restaurant.name}
            </p>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="h-1.5" style={{ background: 'linear-gradient(135deg, #a0854a 0%, #c9a962 50%, #e8d5a3 100%)' }}></div>
        
        {/* 底部信息 */}
        <div className="bg-[#f7f5f0] py-6 text-center border-t border-[#e8e4de]">
          <p className="text-xs text-[#6b6560]">
            {data.restaurant.name} · 期待您的光临
          </p>
        </div>
      </div>

      {/* Share 弹窗 */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-fade-in-scale">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif-title text-lg font-bold text-[#0a0a0a]">分享邀请函</h3>
              <button onClick={() => setShowShare(false)}>
                <X className="w-5 h-5 text-[#6b6560]" />
              </button>
            </div>
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-[#f7f5f0] rounded-xl">
                <QRCodeSVG 
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  size={180}
                  level="M"
                  bgColor="#f7f5f0"
                  fgColor="#0a0a0a"
                />
              </div>
            </div>
            <p className="text-center text-sm text-[#6b6560] mb-4">
              扫描二维码查看邀请函
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                alert('链接已复制')
              }}
              className="w-full py-3 bg-[#0a0a0a] text-white rounded-xl font-medium"
            >
              复制链接
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
