'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Printer, ChevronLeft, Eye, Download } from 'lucide-react'
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
    description?: string
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

  // 导出菜牌图片
  const exportGuestCard = async () => {
    if (!guestCardRef.current) return
    try {
      const dataUrl = await toPng(guestCardRef.current, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${data?.title}_菜牌.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      alert('导出失败，请重试')
    }
  }

  // 导出员工卡图片
  const exportStaffCard = async () => {
    if (!staffCardRef.current) return
    try {
      const dataUrl = await toPng(staffCardRef.current, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${data?.title}_员工信息卡.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      alert('导出失败，请重试')
    }
  }

  // 打印当前标签页
  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6b6560]">加载中...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
        <p className="text-[#6b6560]">数据不存在</p>
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
    <div className="min-h-screen bg-[#f7f5f0]">
      {/* Header */}
      <header className="no-print bg-white border-b border-[#e8e4de] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/list"
              className="p-2 text-[#6b6560] hover:text-[#0a0a0a] hover:bg-[#f7f5f0] rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-serif-title text-lg font-bold text-[#0a0a0a]">{data.title}</h1>
              <p className="text-xs text-[#6b6560]">打印物料预览</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/invitation/${data.id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-[#6b6560] hover:text-[#0a0a0a] transition-colors"
            >
              <Eye className="w-4 h-4" />
              预览邀请
            </Link>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0a] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <Printer className="w-4 h-4" />
              打印
            </button>
          </div>
        </div>
      </header>

      {/* Tab切换 */}
      <div className="no-print max-w-6xl mx-auto px-6 py-4">
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-[#e8e4de] w-fit">
          <button
            onClick={() => setActiveTab('guest')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'guest'
                ? 'bg-[#0a0a0a] text-white'
                : 'text-[#6b6560] hover:text-[#0a0a0a]'
            }`}
          >
            对外菜牌
            <span className="text-xs opacity-60">(给客人)</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'staff'
                ? 'bg-[#0a0a0a] text-white'
                : 'text-[#6b6560] hover:text-[#0a0a0a]'
            }`}
          >
            对内员工卡
            <span className="text-xs opacity-60">(含备注)</span>
          </button>
        </div>
      </div>

      {/* 对外菜牌 */}
      {activeTab === 'guest' && (
        <div className="max-w-4xl mx-auto px-6 pb-8">
          <div className="no-print mb-4 flex justify-end">
            <button
              onClick={exportGuestCard}
              className="flex items-center gap-2 px-4 py-2 bg-[#c9a962] text-white rounded-lg hover:bg-[#a0854a] transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              导出图片
            </button>
          </div>

          {/* 菜牌设计 - A4 纵向 */}
          <div 
            ref={guestCardRef}
            className="bg-white shadow-lg print:shadow-none"
            style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}
          >
            {/* 顶部装饰 */}
            <div className="h-3" style={{ background: 'linear-gradient(135deg, #a0854a 0%, #c9a962 50%, #e8d5a3 100%)' }}></div>
            
            {/* 头部 */}
            <div className="text-center py-10 px-12">
              <p className="text-[#c9a962] text-xs tracking-[0.3em] mb-3">{data.restaurant.name}</p>
              <h1 className="font-serif-title text-3xl font-bold text-[#0a0a0a] mb-2">今日菜单</h1>
              <div className="w-16 h-px bg-[#c9a962] mx-auto my-4"></div>
              <p className="text-[#6b6560] text-sm">{data.title}</p>
            </div>

            {/* 宴请信息 */}
            <div className="px-16 pb-8">
              <div className="flex justify-center items-center gap-8 text-sm text-[#6b6560] border-y border-[#e8e4de] py-4">
                <span>{formatDate(data.date)} {getWeekday(data.date)}</span>
                <span className="w-px h-4 bg-[#e8e4de]"></span>
                <span>{data.time} 入席</span>
                <span className="w-px h-4 bg-[#e8e4de]"></span>
                <span>{data.roomName}</span>
                <span className="w-px h-4 bg-[#e8e4de]"></span>
                <span>{data.guestCount}位</span>
              </div>
            </div>

            {/* 菜单列表 */}
            <div className="px-20 py-8">
              <div className="grid grid-cols-1 gap-0">
                {data.menu.map((dish, index) => (
                  <div 
                    key={index}
                    className={`flex items-start py-5 ${
                      index !== data.menu.length - 1 ? 'border-b border-[#f0ede8]' : ''
                    }`}
                  >
                    <span className="text-[#c9a962] font-serif-title text-lg w-10 flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg ${dish.isSignature ? 'font-bold text-[#0a0a0a]' : 'text-[#0a0a0a]'}`}>
                          {dish.name}
                        </span>
                        {dish.isSignature && (
                          <span className="text-xs px-2 py-0.5 bg-[#c9a962] text-white rounded">
                            招牌
                          </span>
                        )}
                      </div>
                      {dish.description && (
                        <p className="text-sm text-[#6b6560] mt-1">{dish.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 主厨介绍 */}
            {data.restaurant.chefName && (
              <div className="px-16 py-8 border-t border-[#e8e4de]">
                <div className="text-center">
                  <p className="text-[#6b6560] text-sm">
                    主厨：<span className="text-[#0a0a0a] font-medium">{data.restaurant.chefName}</span>
                  </p>
                </div>
              </div>
            )}

            {/* 底部信息 */}
            <div className="px-16 py-8 border-t border-[#e8e4de]">
              <div className="text-center space-y-2">
                <p className="text-[#0a0a0a] font-medium">{data.restaurant.name}</p>
                <p className="text-sm text-[#6b6560]">{data.restaurant.address}</p>
                <p className="text-sm text-[#c9a962]">{data.restaurant.phone}</p>
              </div>
            </div>

            {/* 底部装饰 */}
            <div className="h-3" style={{ background: 'linear-gradient(135deg, #a0854a 0%, #c9a962 50%, #e8d5a3 100%)' }}></div>
          </div>
        </div>
      )}

      {/* 对内员工卡 */}
      {activeTab === 'staff' && (
        <div className="max-w-4xl mx-auto px-6 pb-8">
          <div className="no-print mb-4 flex justify-end">
            <button
              onClick={exportStaffCard}
              className="flex items-center gap-2 px-4 py-2 bg-[#c9a962] text-white rounded-lg hover:bg-[#a0854a] transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              导出图片
            </button>
          </div>

          {/* 员工卡设计 - A4 横向 */}
          <div 
            ref={staffCardRef}
            className="bg-white shadow-lg print:shadow-none"
            style={{ width: '297mm', minHeight: '210mm', margin: '0 auto' }}
          >
            {/* 顶部装饰 */}
            <div className="h-2" style={{ background: 'linear-gradient(135deg, #a0854a 0%, #c9a962 50%, #e8d5a3 100%)' }}></div>
            
            <div className="p-8">
              {/* 标题 */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#0a0a0a]">
                <div>
                  <h1 className="font-serif-title text-2xl font-bold text-[#0a0a0a]">服务信息卡</h1>
                  <p className="text-[#6b6560] text-sm mt-1">内部使用 · 请勿对外</p>
                </div>
                <div className="text-right">
                  <p className="text-[#c9a962] font-bold text-xl">{data.restaurant.name}</p>
                  <p className="text-[#6b6560] text-xs">{formatShortDate(data.date)} {data.time}</p>
                </div>
              </div>

              {/* 主要内容 - 三列布局 */}
              <div className="grid grid-cols-3 gap-6">
                {/* 第一列：宴请信息 */}
                <div className="border-r border-[#e8e4de] pr-6">
                  <h3 className="font-bold text-[#0a0a0a] mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#c9a962] rounded-full"></span>
                    宴请信息
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-[#6b6560]">主题：</span>
                      <span className="font-medium text-[#0a0a0a]">{data.title}</span>
                    </div>
                    <div>
                      <span className="text-[#6b6560]">日期：</span>
                      <span className="text-[#0a0a0a]">{formatDate(data.date)} {getWeekday(data.date)}</span>
                    </div>
                    <div>
                      <span className="text-[#6b6560]">时间：</span>
                      <span className="text-[#0a0a0a]">{data.time}</span>
                    </div>
                    <div>
                      <span className="text-[#6b6560]">包厢：</span>
                      <span className="font-medium text-[#0a0a0a]">{data.roomName}</span>
                    </div>
                    <div>
                      <span className="text-[#6b6560]">预订人数：</span>
                      <span className="text-[#0a0a0a]">{data.guestCount}位</span>
                    </div>
                    <div className="pt-2 border-t border-[#e8e4de]">
                      <span className="text-[#6b6560]">主人：</span>
                      <span className="font-medium text-[#0a0a0a]">{data.hostName}</span>
                    </div>
                    <div>
                      <span className="text-[#6b6560]">电话：</span>
                      <span className="text-[#0a0a0a]">{data.hostPhone}</span>
                    </div>
                  </div>
                </div>

                {/* 第二列：菜单 */}
                <div className="border-r border-[#e8e4de] pr-6">
                  <h3 className="font-bold text-[#0a0a0a] mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#c9a962] rounded-full"></span>
                    今日菜单
                    <span className="text-xs font-normal text-[#6b6560]">({data.menu.length}道)</span>
                  </h3>
                  <div className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
                    {data.menu.map((dish, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-[#c9a962] w-5 flex-shrink-0">{index + 1}.</span>
                        <div className="flex-1">
                          <span className={dish.isSignature ? 'font-bold text-[#0a0a0a]' : 'text-[#0a0a0a]'}>
                            {dish.name}
                          </span>
                          {dish.isSignature && (
                            <span className="ml-1.5 text-xs text-[#c9a962]">★</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 第三列：服务备注 */}
                <div>
                  <h3 className="font-bold text-[#0a0a0a] mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#c9a962] rounded-full"></span>
                    服务备注
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    {/* RSVP统计 */}
                    <div className="bg-[#f7f5f0] p-3 rounded-lg">
                      <p className="text-[#6b6560] text-xs mb-1">已确认出席</p>
                      <p className="text-2xl font-bold text-[#0a0a0a]">{confirmedCount} <span className="text-sm font-normal">人</span></p>
                      {data.rsvps && data.rsvps.length > 0 && (
                        <p className="text-xs text-[#6b6560] mt-1">{data.rsvps.length}人回复</p>
                      )}
                    </div>

                    {/* 忌口信息 */}
                    {(dietaryNotes || data.notes) && (
                      <div className="bg-red-50 border border-red-100 p-3 rounded-lg">
                        <p className="text-red-600 text-xs font-medium mb-2">⚠️ 特别注意</p>
                        {dietaryNotes && (
                          <p className="text-red-700 text-xs leading-relaxed mb-2">
                            忌口：{dietaryNotes}
                          </p>
                        )}
                        {data.notes && (
                          <p className="text-red-700 text-xs leading-relaxed">
                            备注：{data.notes}
                          </p>
                        )}
                      </div>
                    )}

                    {/* 服务要点 */}
                    <div className="bg-[#f7f5f0] p-3 rounded-lg">
                      <p className="text-[#6b6560] text-xs mb-2">服务要点</p>
                      <ul className="text-xs text-[#0a0a0a] space-y-1.5 list-disc list-inside">
                        <li>提前15分钟开启包厢空调</li>
                        <li>准备消毒毛巾和热茶</li>
                        <li>上菜节奏根据宴席进度调整</li>
                        <li>招牌菜重点介绍</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部联系 */}
              <div className="mt-6 pt-4 border-t border-[#e8e4de] flex justify-between items-center text-xs text-[#6b6560]">
                <span>{data.restaurant.name} · {data.restaurant.address}</span>
                <span>预订电话：{data.restaurant.phone}</span>
              </div>
            </div>

            {/* 底部装饰 */}
            <div className="h-2" style={{ background: 'linear-gradient(135deg, #a0854a 0%, #c9a962 50%, #e8d5a3 100%)' }}></div>
          </div>
        </div>
      )}

      {/* 打印提示 */}
      <div className="no-print max-w-4xl mx-auto px-6 pb-8 text-center">
        <p className="text-sm text-[#6b6560]">
          {activeTab === 'guest' ? '对外菜牌建议用 A4 纸张纵向打印' : '对内员工卡建议用 A4 纸张横向打印'}
        </p>
      </div>
    </div>
  )
}
