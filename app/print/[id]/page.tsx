'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Printer, ChevronLeft, Eye } from 'lucide-react'
import Link from 'next/link'

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
  restaurant: {
    name: string
    address: string
    phone: string
    chefName?: string
  }
  menu: Dish[]
}

export default function PrintPage() {
  const params = useParams()
  const [data, setData] = useState<BanquetData | null>(null)
  const [loading, setLoading] = useState(true)

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] py-8">
      {/* 打印按钮 */}
      <div className="no-print max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-[#e8e4de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/list"
              className="p-2 text-[#6b6560] hover:text-[#0a0a0a] hover:bg-[#f7f5f0] rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-serif-title text-lg font-bold text-[#0a0a0a]">{data.title} - 打印菜单</h1>
              <p className="text-sm text-[#6b6560]">请使用 A4 纸打印，建议横向打印桌卡，纵向打印菜单</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/invitation/${data.id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-[#6b6560] hover:text-[#0a0a0a] transition-colors"
            >
              <Eye className="w-4 h-4" />
              预览
            </Link>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0a] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <Printer className="w-4 h-4" />
              打印
            </button>
          </div>
        </div>
      </div>

      {/* 打印区域 */}
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* 今日菜单 - A4 纵向 */}
        <div className="bg-white p-12 shadow-lg print:shadow-none" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
          {/* 餐厅名称 */}
          <div className="text-center mb-8">
            <h2 className="font-serif-title text-2xl font-bold text-[#0a0a0a]">{data.restaurant.name}</h2>
            <div className="w-16 h-px bg-[#c9a962] mx-auto mt-4"></div>
          </div>

          {/* 宴请信息 */}
          <div className="text-center mb-10">
            <h1 className="font-serif-title text-3xl font-bold text-[#0a0a0a] mb-4">今日菜单</h1>
            <div className="flex justify-center gap-6 text-sm text-[#6b6560]">
              <span>日期：{formatDate(data.date)}</span>
              <span>包厢：{data.roomName}</span>
              <span>人数：{data.guestCount}位</span>
            </div>
          </div>

          {/* 菜单列表 */}
          <div className="max-w-md mx-auto">
            {data.menu.map((dish, index) => (
              <div 
                key={index}
                className={`flex items-center py-4 ${
                  index !== data.menu.length - 1 ? 'border-b border-[#e8e4de]' : ''
                }`}
              >
                <span className="text-[#c9a962] w-8 text-sm font-serif-title">{index + 1}</span>
                <div className="flex-1">
                  <span className={`text-lg ${dish.isSignature ? 'font-bold text-[#0a0a0a]' : 'text-[#0a0a0a]'}`}>
                    {dish.name}
                  </span>
                  {dish.isSignature && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-[#c9a962] text-white rounded">
                      招牌
                    </span>
                  )}
                </div>
                {dish.description && (
                  <span className="text-sm text-[#6b6560]">{dish.description}</span>
                )}
              </div>
            ))}
          </div>

          {/* 主厨 */}
          {data.restaurant.chefName && (
            <div className="text-center mt-12 pt-8 border-t border-[#e8e4de]">
              <p className="text-[#6b6560]">
                主厨：<span className="font-medium text-[#0a0a0a]">{data.restaurant.chefName}</span>
              </p>
            </div>
          )}

          {/* 底部 */}
          <div className="text-center mt-12 pt-8">
            <p className="text-sm text-[#6b6560]">感谢您的光临 · {data.restaurant.phone}</p>
          </div>
        </div>

        {/* 桌卡 - A4 横向（可放两个） */}
        <div className="bg-white p-8 shadow-lg print:shadow-none" style={{ width: '210mm', margin: '0 auto' }}>
          <h3 className="text-center font-bold text-[#0a0a0a] mb-6 no-print">桌卡打印版（建议裁切使用）</h3>
          
          <div className="grid grid-cols-2 gap-8">
            {/* 桌卡 1 */}
            <div className="border-2 border-[#c9a962] p-6" style={{ aspectRatio: '3/2' }}>
              <div className="h-full flex flex-col justify-between text-center">
                <div>
                  <p className="text-sm text-[#6b6560] mb-1">{data.restaurant.name}</p>
                  <h3 className="font-serif-title text-2xl font-bold text-[#0a0a0a]">{data.title}</h3>
                </div>
                <div>
                  <p className="text-lg text-[#0a0a0a] mb-1">{data.roomName}</p>
                  <p className="text-sm text-[#6b6560]">{formatDate(data.date)} · {data.time}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6b6560]">设宴：{data.hostName}</p>
                </div>
              </div>
            </div>

            {/* 桌卡 2 */}
            <div className="border-2 border-[#c9a962] p-6" style={{ aspectRatio: '3/2' }}>
              <div className="h-full flex flex-col justify-between text-center">
                <div>
                  <p className="text-sm text-[#6b6560] mb-2">今日菜单</p>
                  <div className="text-left space-y-1">
                    {data.menu.slice(0, 6).map((dish, index) => (
                      <p key={index} className="text-sm text-[#0a0a0a] truncate">
                        {dish.name}
                      </p>
                    ))}
                    {data.menu.length > 6 && (
                      <p className="text-xs text-[#6b6560]">...等{data.menu.length}道菜</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#6b6560]">{data.restaurant.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 服务员信息卡 */}
        <div className="bg-white p-8 shadow-lg print:shadow-none" style={{ width: '210mm', margin: '0 auto' }}>
          <h3 className="text-center font-bold text-[#0a0a0a] mb-6 no-print">服务员信息卡（内部使用）</h3>
          
          <div className="border-2 border-[#e8e4de] p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#0a0a0a] mb-4">宴请信息</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-[#6b6560]">主题：</span>{data.title}</p>
                  <p><span className="text-[#6b6560]">时间：</span>{formatDate(data.date)} {data.time}</p>
                  <p><span className="text-[#6b6560]">包厢：</span>{data.roomName}</p>
                  <p><span className="text-[#6b6560]">人数：</span>{data.guestCount}位</p>
                  <p><span className="text-[#6b6560]">主人：</span>{data.hostName}</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-[#0a0a0a] mb-4">今日菜单</h4>
                <div className="space-y-1 text-sm">
                  {data.menu.map((dish, index) => (
                    <p key={index} className={dish.isSignature ? 'font-bold text-[#c9a962]' : 'text-[#0a0a0a]'}>
                      {dish.name} {dish.isSignature && '(招牌)'}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
