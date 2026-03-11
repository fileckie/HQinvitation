'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { toPng } from 'html-to-image'
import { MapPin, Phone, Calendar, Download, X } from 'lucide-react'

interface Dish {
  name: string
  description?: string
  isSignature?: boolean
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
  menu: Dish[]
  restaurant: {
    name: string
    address: string
    phone: string
    chefName?: string
  }
}

export default function InvitationPage() {
  const params = useParams()
  const [data, setData] = useState<BanquetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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

  // 导出图片
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
      alert('导出失败')
    } finally {
      setExporting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return {
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: weekdays[date.getDay()],
      year: date.getFullYear()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <div className="w-12 h-12 border border-[#C9A962] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <p className="text-white/60">{error}</p>
      </div>
    )
  }

  const dateInfo = formatDate(data.date)

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* 导出按钮 */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={exportImage}
          disabled={exporting}
          className="flex items-center gap-2 px-5 py-3 bg-[#C9A962] text-white text-sm tracking-wider hover:bg-[#B87333] transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? '导出中' : '保存图片'}
        </button>
      </div>

      {/* 邀请函主体 */}
      <div 
        ref={invitationRef}
        className="max-w-lg mx-auto bg-[#FAF7F2] min-h-screen relative"
      >
        {/* 顶部装饰线 */}
        <div className="h-1 bg-[#C9A962]"></div>
        
        {/* 头部 - 深色背景 */}
        <div className="bg-[#1A1A1A] text-center py-16 px-8">
          <p className="text-[#C9A962] text-xs tracking-[0.4em] mb-6">{data.restaurant.name}</p>
          <h1 className="font-display text-4xl text-white mb-4 tracking-wider">诚挚邀请</h1>
          <div className="w-12 h-px bg-[#C9A962] mx-auto mb-6"></div>
          <p className="text-white/80 text-lg font-display tracking-wide">{data.title}</p>
        </div>

        {/* 日期时间 - 突出显示 */}
        <div className="py-12 px-8 text-center border-b border-[#E5E0D8]">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="font-display text-5xl text-[#1A1A1A]">{dateInfo.month}</p>
              <p className="text-xs tracking-[0.3em] text-[#8A8A8A] mt-1">月</p>
            </div>
            <div className="w-px h-16 bg-[#E5E0D8]"></div>
            <div className="text-center">
              <p className="font-display text-5xl text-[#1A1A1A]">{dateInfo.day}</p>
              <p className="text-xs tracking-[0.3em] text-[#8A8A8A] mt-1">{dateInfo.weekday}</p>
            </div>
            <div className="w-px h-16 bg-[#E5E0D8]"></div>
            <div className="text-center">
              <p className="font-display text-3xl text-[#1A1A1A]">{data.time}</p>
              <p className="text-xs tracking-[0.3em] text-[#8A8A8A] mt-2">入席</p>
            </div>
          </div>
        </div>

        {/* 地点信息 */}
        <div className="py-10 px-8 border-b border-[#E5E0D8]">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#C9A962] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-display text-[#1A1A1A] mb-1">{data.restaurant.name}</p>
                <p className="text-sm text-[#8A8A8A]">{data.restaurant.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-9">
              <span className="text-sm text-[#8A8A8A]">包厢</span>
              <span className="font-display text-[#1A1A1A]">{data.roomName}</span>
            </div>
          </div>
        </div>

        {/* 菜单 */}
        <div className="py-10 px-8">
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.4em] text-[#C9A962] mb-2">MENU</p>
            <h2 className="font-display text-xl text-[#1A1A1A] tracking-wider">今日菜单</h2>
          </div>
          
          <div className="space-y-0">
            {data.menu.map((dish, index) => (
              <div 
                key={index}
                className={`py-4 border-b border-[#E5E0D8] last:border-0 ${
                  dish.isSignature ? 'bg-[#F5F0E8] -mx-8 px-8' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-[#C9A962] font-display text-sm w-6">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`${dish.isSignature ? 'font-display text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>
                        {dish.name}
                      </span>
                      {dish.isSignature && (
                        <span className="text-[10px] tracking-wider text-[#C9A962] border border-[#C9A962] px-2 py-0.5">
                          招牌
                        </span>
                      )}
                    </div>
                    {dish.description && (
                      <p className="text-xs text-[#8A8A8A] mt-1">{dish.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 主人信息 */}
        <div className="py-8 px-8 border-t border-[#E5E0D8]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.2em] text-[#8A8A8A] mb-1">设宴</p>
              <p className="font-display text-lg text-[#1A1A1A]">{data.hostName}</p>
            </div>
            <a 
              href={`tel:${data.hostPhone}`}
              className="flex items-center gap-2 text-[#C9A962] text-sm"
            >
              <Phone className="w-4 h-4" />
              联系主人
            </a>
          </div>
        </div>

        {/* 餐厅电话 */}
        <div className="py-6 px-8 bg-[#F5F0E8] text-center">
          <p className="text-xs tracking-[0.2em] text-[#8A8A8A] mb-2">预订咨询</p>
          <a href={`tel:${data.restaurant.phone}`} className="font-display text-xl text-[#1A1A1A]">
            {data.restaurant.phone}
          </a>
        </div>

        {/* 底部装饰 */}
        <div className="h-1 bg-[#C9A962]"></div>
        
        {/* 底部信息 */}
        <div className="py-6 text-center">
          <p className="text-xs tracking-[0.2em] text-[#8A8A8A]">
            {data.restaurant.name} · 期待您的光临
          </p>
        </div>
      </div>
    </div>
  )
}
