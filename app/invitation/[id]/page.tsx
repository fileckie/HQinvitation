'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { toPng } from 'html-to-image'
import { MapPin, Phone, Calendar, Download, ChevronDown, ChevronUp } from 'lucide-react'
import RSVPForm from '@/components/RSVPForm'
import RSVPStats from '@/components/RSVPStats'
import TemplateSelector, { TemplateType } from '@/components/TemplateSelector'

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

// 模板样式配置
const templates: Record<TemplateType, {
  bg: string
  cardBg: string
  headerBg: string
  accentColor: string
  textPrimary: string
  textSecondary: string
  borderColor: string
}> = {
  classic: {
    bg: '#1A1A1A',
    cardBg: '#FAF7F2',
    headerBg: '#1A1A1A',
    accentColor: '#C9A962',
    textPrimary: '#1A1A1A',
    textSecondary: '#8A8A8A',
    borderColor: '#E5E0D8'
  },
  modern: {
    bg: '#2C3E50',
    cardBg: '#FFFFFF',
    headerBg: '#2C3E50',
    accentColor: '#E74C3C',
    textPrimary: '#2C3E50',
    textSecondary: '#7F8C8D',
    borderColor: '#ECF0F1'
  },
  minimal: {
    bg: '#F5F5F5',
    cardBg: '#FFFFFF',
    headerBg: '#000000',
    accentColor: '#000000',
    textPrimary: '#000000',
    textSecondary: '#666666',
    borderColor: '#E0E0E0'
  }
}

export default function InvitationPage() {
  const params = useParams()
  const [data, setData] = useState<BanquetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)
  const [showRSVP, setShowRSVP] = useState(false)
  const [template, setTemplate] = useState<TemplateType>('classic')
  const [rsvpRefresh, setRsvpRefresh] = useState(0)
  const invitationRef = useRef<HTMLDivElement>(null)

  const theme = templates[template]

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <div className="w-12 h-12 border-2 border-[#C9A962] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <p className="text-white/60">{error}</p>
      </div>
    )
  }

  const dateInfo = formatDate(data.date)

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.bg }}>
      {/* 顶部工具栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-start">
        <TemplateSelector value={template} onChange={setTemplate} />
        <button
          onClick={exportImage}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A962] text-white rounded-lg hover:bg-[#B87333] transition-colors disabled:opacity-50 text-sm"
        >
          <Download className="w-4 h-4" />
          {exporting ? '导出中' : '保存图片'}
        </button>
      </div>

      <div className="max-w-lg mx-auto pt-20 pb-8 px-4">
        {/* 邀请函主体 */}
        <div 
          ref={invitationRef}
          className="shadow-2xl overflow-hidden"
          style={{ backgroundColor: theme.cardBg }}
        >
          {/* 顶部装饰线 */}
          <div className="h-1.5" style={{ backgroundColor: theme.accentColor }}></div>
          
          {/* 头部 */}
          <div 
            className="text-center py-12 px-8"
            style={{ backgroundColor: theme.headerBg }}
          >
            <p 
              className="text-xs tracking-[0.4em] mb-4"
              style={{ color: theme.accentColor }}
            >
              {data.restaurant.name}
            </p>
            <h1 
              className="font-display text-4xl mb-3 tracking-wider"
              style={{ color: 'white' }}
            >
              {template === 'minimal' ? 'INVITATION' : '诚挚邀请'}
            </h1>
            <div 
              className="w-12 h-px mx-auto mb-4"
              style={{ backgroundColor: theme.accentColor }}
            ></div>
            <p className="text-white/80 text-lg font-display tracking-wide">{data.title}</p>
          </div>

          {/* 日期时间 */}
          <div 
            className="py-10 px-8 text-center"
            style={{ borderBottom: `1px solid ${theme.borderColor}` }}
          >
            <div className="flex items-center justify-center gap-6 md:gap-8">
              <div className="text-center">
                <p 
                  className="font-display text-5xl"
                  style={{ color: theme.textPrimary }}
                >
                  {dateInfo.month}
                </p>
                <p 
                  className="text-xs tracking-[0.3em] mt-1"
                  style={{ color: theme.textSecondary }}
                >
                  月
                </p>
              </div>
              <div 
                className="w-px h-16"
                style={{ backgroundColor: theme.borderColor }}
              ></div>
              <div className="text-center">
                <p 
                  className="font-display text-5xl"
                  style={{ color: theme.textPrimary }}
                >
                  {dateInfo.day}
                </p>
                <p 
                  className="text-xs tracking-[0.3em] mt-1"
                  style={{ color: theme.textSecondary }}
                >
                  {dateInfo.weekday}
                </p>
              </div>
              <div 
                className="w-px h-16"
                style={{ backgroundColor: theme.borderColor }}
              ></div>
              <div className="text-center">
                <p 
                  className="font-display text-3xl"
                  style={{ color: theme.textPrimary }}
                >
                  {data.time}
                </p>
                <p 
                  className="text-xs tracking-[0.3em] mt-2"
                  style={{ color: theme.textSecondary }}
                >
                  入席
                </p>
              </div>
            </div>
          </div>

          {/* 地点信息 */}
          <div 
            className="py-8 px-8"
            style={{ borderBottom: `1px solid ${theme.borderColor}` }}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin 
                  className="w-5 h-5 mt-0.5 flex-shrink-0" 
                  style={{ color: theme.accentColor }}
                />
                <div>
                  <p 
                    className="font-display mb-1"
                    style={{ color: theme.textPrimary }}
                  >
                    {data.restaurant.name}
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    {data.restaurant.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-9">
                <span 
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  包厢
                </span>
                <span 
                  className="font-display"
                  style={{ color: theme.textPrimary }}
                >
                  {data.roomName}
                </span>
              </div>
            </div>
          </div>

          {/* 菜单 */}
          <div className="py-8 px-8">
            <div className="text-center mb-8">
              <p 
                className="text-xs tracking-[0.4em] mb-2"
                style={{ color: theme.accentColor }}
              >
                MENU
              </p>
              <h2 
                className="font-display text-xl tracking-wider"
                style={{ color: theme.textPrimary }}
              >
                今日菜单
              </h2>
            </div>
            
            <div className="space-y-0">
              {data.menu.map((dish, index) => (
                <div 
                  key={index}
                  className="py-4 last:border-0"
                  style={{ 
                    borderBottom: index !== data.menu.length - 1 ? `1px solid ${theme.borderColor}` : 'none',
                    backgroundColor: dish.isSignature ? `${theme.accentColor}10` : 'transparent',
                    margin: dish.isSignature ? '0 -32px' : '0',
                    paddingLeft: dish.isSignature ? '32px' : undefined,
                    paddingRight: dish.isSignature ? '32px' : undefined
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span 
                      className="font-display text-sm w-6"
                      style={{ color: theme.accentColor }}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span style={{ 
                          fontWeight: dish.isSignature ? 600 : 400,
                          color: theme.textPrimary 
                        }}>
                          {dish.name}
                        </span>
                        {dish.isSignature && (
                          <span 
                            className="text-[10px] tracking-wider border px-2 py-0.5"
                            style={{ 
                              color: theme.accentColor,
                              borderColor: theme.accentColor
                            }}
                          >
                            招牌
                          </span>
                        )}
                      </div>
                      {dish.description && (
                        <p 
                          className="text-xs mt-1"
                          style={{ color: theme.textSecondary }}
                        >
                          {dish.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 主人信息 */}
          <div 
            className="py-6 px-8"
            style={{ borderTop: `1px solid ${theme.borderColor}` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p 
                  className="text-xs tracking-[0.2em] mb-1"
                  style={{ color: theme.textSecondary }}
                >
                  设宴
                </p>
                <p 
                  className="font-display text-lg"
                  style={{ color: theme.textPrimary }}
                >
                  {data.hostName}
                </p>
              </div>
              <a 
                href={`tel:${data.hostPhone}`}
                className="flex items-center gap-2 text-sm"
                style={{ color: theme.accentColor }}
              >
                <Phone className="w-4 h-4" />
                联系主人
              </a>
            </div>
          </div>

          {/* 餐厅电话 */}
          <div 
            className="py-5 px-8 text-center"
            style={{ backgroundColor: `${theme.accentColor}10` }}
          >
            <p 
              className="text-xs tracking-[0.2em] mb-2"
              style={{ color: theme.textSecondary }}
            >
              预订咨询
            </p>
            <a 
              href={`tel:${data.restaurant.phone}`} 
              className="font-display text-xl"
              style={{ color: theme.textPrimary }}
            >
              {data.restaurant.phone}
            </a>
          </div>

          {/* 底部装饰 */}
          <div 
            className="h-1.5"
            style={{ backgroundColor: theme.accentColor }}
          ></div>
          
          {/* 底部信息 */}
          <div className="py-5 text-center">
            <p 
              className="text-xs tracking-[0.2em]"
              style={{ color: theme.textSecondary }}
            >
              {data.restaurant.name} · 期待您的光临
            </p>
          </div>
        </div>

        {/* RSVP 区域 */}
        <div className="mt-6">
          <button
            onClick={() => setShowRSVP(!showRSVP)}
            className="w-full py-4 bg-white rounded-xl flex items-center justify-center gap-2 text-[#1A1A1A] font-medium hover:bg-gray-50 transition-colors"
          >
            {showRSVP ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            {showRSVP ? '收起回执' : '填写出席回执'}
          </button>
          
          {showRSVP && (
            <div className="mt-4 overflow-hidden rounded-xl">
              <RSVPForm 
                banquetId={data.id} 
                onSuccess={() => setRsvpRefresh(r => r + 1)}
              />
            </div>
          )}
        </div>

        {/* RSVP 统计 */}
        <div className="mt-6 overflow-hidden rounded-xl">
          <RSVPStats key={rsvpRefresh} banquetId={data.id} />
        </div>
      </div>
    </div>
  )
}
