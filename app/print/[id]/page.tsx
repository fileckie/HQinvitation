'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Printer, ArrowLeft, Eye, Download } from 'lucide-react'
import Link from 'next/link'
import { toPng } from 'html-to-image'

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
  notes?: string
  menu: Dish[]
  restaurant: {
    name: string
    address: string
    phone: string
    chefName?: string
  }
  rsvps?: {
    status: string
    attendeeCount: number
    guestName: string
    dietaryRestrictions?: string
  }[]
}

export default function PrintPage() {
  const params = useParams()
  const [data, setData] = useState<BanquetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'guest' | 'staff'>('guest')
  
  const guestCardRef = useRef<HTMLDivElement>(null)
  const staffCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/banquet/${params.id}`)
        if (!response.ok) throw new Error('Not found')
        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  const getWeekday = (dateStr: string) => {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const date = new Date(dateStr)
    return weekdays[date.getDay()]
  }

  const exportGuestCard = async () => {
    if (!guestCardRef.current) return
    try {
      const dataUrl = await toPng(guestCardRef.current, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${data?.title}_菜牌.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      alert('导出失败')
    }
  }

  const exportStaffCard = async () => {
    if (!staffCardRef.current) return
    try {
      const dataUrl = await toPng(staffCardRef.current, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${data?.title}_员工卡.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      alert('导出失败')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-12 h-12 border border-[#C9A962] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <p className="text-[#8A8A8A]">数据不存在</p>
      </div>
    )
  }

  const confirmedGuests = data.rsvps?.filter(r => r.status === 'confirmed') || []
  const confirmedCount = confirmedGuests.reduce((sum, r) => sum + r.attendeeCount, 0)
  const dietaryNotes = confirmedGuests
    .filter(r => r.dietaryRestrictions)
    .map(r => `${r.guestName}: ${r.dietaryRestrictions}`)
    .join('； ')

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="no-print fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/list" className="text-[#8A8A8A] hover:text-[#1A1A1A]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display text-sm tracking-[0.15em] text-[#1A1A1A]">{data.title}</h1>
              <p className="text-xs text-[#8A8A8A]">打印物料预览</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/invitation/${data.id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors"
            >
              <Eye className="w-4 h-4" />
              预览邀请
            </Link>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-sm tracking-wider hover:bg-[#2C2C2C] transition-colors"
            >
              <Printer className="w-4 h-4" />
              打印
            </button>
          </div>
        </div>
      </header>

      {/* Tab切换 */}
      <div className="no-print fixed top-16 left-0 right-0 z-40 bg-[#FAF7F2] border-b border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex gap-1 bg-[#F5F0E8] p-1 w-fit">
            <button
              onClick={() => setActiveTab('guest')}
              className={`px-6 py-2.5 text-sm tracking-wider transition-colors ${
                activeTab === 'guest'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#8A8A8A] hover:text-[#1A1A1A]'
              }`}
            >
              对外菜牌
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-6 py-2.5 text-sm tracking-wider transition-colors ${
                activeTab === 'staff'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#8A8A8A] hover:text-[#1A1A1A]'
              }`}
            >
              对内员工卡
            </button>
          </div>
        </div>
      </div>

      {/* 对外菜牌 */}
      {activeTab === 'guest' && (
        <div className="pt-40 pb-20 px-8">
          <div className="no-print max-w-4xl mx-auto mb-6 flex justify-end">
            <button
              onClick={exportGuestCard}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A962] text-white text-sm tracking-wider hover:bg-[#B87333] transition-colors"
            >
              <Download className="w-4 h-4" />
              导出图片
            </button>
          </div>

          {/* 菜牌设计 */}
          <div 
            ref={guestCardRef}
            className="bg-white max-w-md mx-auto"
            style={{ width: '375px', minHeight: '667px' }}
          >
            {/* 顶部装饰 */}
            <div className="h-1 bg-[#C9A962]"></div>
            
            {/* 头部 */}
            <div className="bg-[#1A1A1A] text-center py-10 px-6">
              <p className="text-[#C9A962] text-[10px] tracking-[0.4em] mb-4">{data.restaurant.name}</p>
              <h1 className="font-display text-2xl text-white tracking-wider mb-2">今日菜单</h1>
              <div className="w-8 h-px bg-[#C9A962] mx-auto mt-4"></div>
            </div>

            {/* 宴请信息 */}
            <div className="text-center py-6 border-b border-[#E5E0D8]">
              <p className="font-display text-lg text-[#1A1A1A] mb-2">{data.title}</p>
              <p className="text-xs text-[#8A8A8A] tracking-wider">
                {formatShortDate(data.date)} {getWeekday(data.date)} · {data.time} · {data.roomName}
              </p>
            </div>

            {/* 菜单 */}
            <div className="py-6 px-6">
              {data.menu.map((dish, index) => (
                <div 
                  key={index}
                  className={`py-3 border-b border-[#E5E0D8] last:border-0 ${
                    dish.isSignature ? 'bg-[#F5F0E8] -mx-6 px-6' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#C9A962] text-xs font-display w-5">{index + 1}</span>
                    <span className={`text-sm ${dish.isSignature ? 'font-display text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>
                      {dish.name}
                    </span>
                    {dish.isSignature && (
                      <span className="ml-auto text-[8px] tracking-wider text-[#C9A962] border border-[#C9A962] px-1.5 py-0.5">
                        招牌
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 底部 */}
            <div className="mt-auto py-6 text-center border-t border-[#E5E0D8]">
              <p className="text-[10px] tracking-[0.2em] text-[#8A8A8A] mb-1">{data.restaurant.name}</p>
              <p className="text-[10px] text-[#C9A962]">{data.restaurant.phone}</p>
            </div>
            
            <div className="h-1 bg-[#C9A962]"></div>
          </div>
        </div>
      )}

      {/* 对内员工卡 */}
      {activeTab === 'staff' && (
        <div className="pt-40 pb-20 px-8">
          <div className="no-print max-w-4xl mx-auto mb-6 flex justify-end">
            <button
              onClick={exportStaffCard}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A962] text-white text-sm tracking-wider hover:bg-[#B87333] transition-colors"
            >
              <Download className="w-4 h-4" />
              导出图片
            </button>
          </div>

          {/* 员工卡设计 - A4横向 */}
          <div 
            ref={staffCardRef}
            className="bg-white mx-auto"
            style={{ width: '297mm', height: '210mm', padding: '20mm' }}
          >
            {/* 顶部 */}
            <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-[#1A1A1A]">
              <div>
                <p className="text-xs tracking-[0.3em] text-[#C9A962] mb-1">INTERNAL USE ONLY</p>
                <h1 className="font-display text-2xl text-[#1A1A1A] tracking-wider">服务信息卡</h1>
              </div>
              <div className="text-right">
                <p className="font-display text-lg text-[#1A1A1A]">{data.restaurant.name}</p>
                <p className="text-xs text-[#8A8A8A]">{formatShortDate(data.date)} {data.time}</p>
              </div>
            </div>

            {/* 三列布局 */}
            <div className="grid grid-cols-3 gap-8">
              {/* 第一列：宴请信息 */}
              <div className="border-r border-[#E5E0D8] pr-8">
                <h3 className="text-xs tracking-[0.2em] text-[#C9A962] mb-4">宴请信息</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#8A8A8A]">主题：</span>
                    <span className="text-[#1A1A1A] font-display">{data.title}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">日期：</span>
                    <span className="text-[#1A1A1A]">{formatDate(data.date)} {getWeekday(data.date)}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">时间：</span>
                    <span className="text-[#1A1A1A]">{data.time}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">包厢：</span>
                    <span className="text-[#1A1A1A] font-display">{data.roomName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">预订人数：</span>
                    <span className="text-[#1A1A1A]">{data.guestCount}位</span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E0D8]">
                    <span className="text-[#8A8A8A]">主人：</span>
                    <span className="text-[#1A1A1A]">{data.hostName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">电话：</span>
                    <span className="text-[#1A1A1A]">{data.hostPhone}</span>
                  </div>
                </div>
              </div>

              {/* 第二列：菜单 */}
              <div className="border-r border-[#E5E0D8] pr-8">
                <h3 className="text-xs tracking-[0.2em] text-[#C9A962] mb-4">
                  菜单 <span className="text-[#8A8A8A]">({data.menu.length}道)</span>
                </h3>
                <div className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
                  {data.menu.map((dish, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-[#C9A962] text-xs w-4">{index + 1}</span>
                      <span className={dish.isSignature ? 'font-display text-[#1A1A1A]' : 'text-[#1A1A1A]'}>
                        {dish.name}
                      </span>
                      {dish.isSignature && (
                        <span className="text-[10px] text-[#C9A962]">★</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 第三列：服务备注 */}
              <div>
                <h3 className="text-xs tracking-[0.2em] text-[#C9A962] mb-4">服务备注</h3>
                
                <div className="space-y-4">
                  {/* RSVP统计 */}
                  <div className="bg-[#F5F0E8] p-4">
                    <p className="text-xs text-[#8A8A8A] mb-1">已确认出席</p>
                    <p className="font-display text-3xl text-[#1A1A1A]">{confirmedCount} <span className="text-sm font-normal">人</span></p>
                    {data.rsvps && data.rsvps.length > 0 && (
                      <p className="text-xs text-[#8A8A8A] mt-1">{data.rsvps.length}人回复</p>
                    )}
                  </div>

                  {/* 忌口信息 */}
                  {(dietaryNotes || data.notes) && (
                    <div className="bg-red-50 border border-red-100 p-4">
                      <p className="text-xs text-red-600 font-medium mb-2">⚠ 特别注意</p>
                      {dietaryNotes && (
                        <p className="text-xs text-red-700 leading-relaxed mb-2">
                          忌口：{dietaryNotes}
                        </p>
                      )}
                      {data.notes && (
                        <p className="text-xs text-red-700 leading-relaxed">
                          备注：{data.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 服务要点 */}
                  <div className="bg-[#F5F0E8] p-4">
                    <p className="text-xs text-[#8A8A8A] mb-3">服务要点</p>
                    <ul className="text-xs text-[#1A1A1A] space-y-2 list-disc list-inside">
                      <li>提前15分钟开启包厢空调</li>
                      <li>准备消毒毛巾和热茶</li>
                      <li>上菜节奏根据宴席进度调整</li>
                      <li>招牌菜重点介绍</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部 */}
            <div className="mt-8 pt-4 border-t border-[#E5E0D8] flex justify-between text-xs text-[#8A8A8A]">
              <span>{data.restaurant.name} · {data.restaurant.address}</span>
              <span>预订：{data.restaurant.phone}</span>
            </div>
          </div>
        </div>
      )}

      {/* 打印提示 */}
      <div className="no-print max-w-4xl mx-auto px-8 pb-8 text-center">
        <p className="text-sm text-[#8A8A8A]">
          {activeTab === 'guest' ? '对外菜牌建议用手机尺寸打印或导出图片' : '对内员工卡建议用 A4 横向打印'}
        </p>
      </div>
    </div>
  )
}
