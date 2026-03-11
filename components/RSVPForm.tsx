'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Users, MessageSquare, User, Phone } from 'lucide-react'

interface RSVPFormProps {
  banquetId: string
  onSuccess?: () => void
}

export default function RSVPForm({ banquetId, onSuccess }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    status: 'confirmed' as 'confirmed' | 'declined',
    attendeeCount: '1',
    dietaryRestrictions: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`/api/banquet/${banquetId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          attendeeCount: parseInt(formData.attendeeCount)
        })
      })

      if (response.ok) {
        setSubmitted(true)
        onSuccess?.()
      } else {
        alert('提交失败，请重试')
      }
    } catch (error) {
      alert('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-[#F5F0E8] p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-display text-xl text-[#1A1A1A] mb-2">
          {formData.status === 'confirmed' ? '感谢确认出席！' : '已收到您的回复'}
        </h3>
        <p className="text-sm text-[#8A8A8A]">
          {formData.status === 'confirmed' 
            ? `期待 ${formData.guestName} 的光临` 
            : '期待下次再聚'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#F5F0E8] p-6 md:p-8">
      <h3 className="font-display text-xl text-[#1A1A1A] mb-6 text-center">RSVP 回执</h3>
      
      {/* 出席选择 */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setFormData({...formData, status: 'confirmed'})}
          className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
            formData.status === 'confirmed'
              ? 'border-green-500 bg-green-50'
              : 'border-[#E5E0D8] bg-white hover:border-green-300'
          }`}
        >
          <CheckCircle className={`w-6 h-6 ${formData.status === 'confirmed' ? 'text-green-600' : 'text-[#8A8A8A]'}`} />
          <span className={`text-sm font-medium ${formData.status === 'confirmed' ? 'text-green-700' : 'text-[#4A4A4A]'}`}>
            确认出席
          </span>
        </button>
        <button
          type="button"
          onClick={() => setFormData({...formData, status: 'declined'})}
          className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
            formData.status === 'declined'
              ? 'border-red-300 bg-red-50'
              : 'border-[#E5E0D8] bg-white hover:border-red-200'
          }`}
        >
          <XCircle className={`w-6 h-6 ${formData.status === 'declined' ? 'text-red-500' : 'text-[#8A8A8A]'}`} />
          <span className={`text-sm font-medium ${formData.status === 'declined' ? 'text-red-600' : 'text-[#4A4A4A]'}`}>
            无法出席
          </span>
        </button>
      </div>

      {formData.status === 'confirmed' && (
        <div className="animate-fade-in space-y-4 mb-6">
          <div>
            <label className="flex items-center gap-2 text-sm text-[#6b6560] mb-2">
              <Users className="w-4 h-4" />
              出席人数
            </label>
            <div className="flex gap-2">
              {['1', '2', '3', '4', '5+'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({...formData, attendeeCount: num})}
                  className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${
                    formData.attendeeCount === num
                      ? 'border-[#C9A962] bg-[#C9A962] text-white'
                      : 'border-[#E5E0D8] bg-white text-[#4A4A4A] hover:border-[#C9A962]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="flex items-center gap-2 text-sm text-[#6b6560] mb-2">
            <User className="w-4 h-4" />
            您的姓名 *
          </label>
          <input
            type="text"
            required
            value={formData.guestName}
            onChange={(e) => setFormData({...formData, guestName: e.target.value})}
            className="w-full px-4 py-3 bg-white border border-[#E5E0D8] rounded-xl focus:outline-none focus:border-[#C9A962]"
            placeholder="请输入姓名"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-[#6b6560] mb-2">
            <Phone className="w-4 h-4" />
            联系电话
          </label>
          <input
            type="tel"
            value={formData.guestPhone}
            onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
            className="w-full px-4 py-3 bg-white border border-[#E5E0D8] rounded-xl focus:outline-none focus-border-[#C9A962]"
            placeholder="138****8888"
          />
        </div>

        {formData.status === 'confirmed' && (
          <div className="animate-fade-in">
            <label className="flex items-center gap-2 text-sm text-[#6b6560] mb-2">
              饮食忌口/过敏
            </label>
            <input
              type="text"
              value={formData.dietaryRestrictions}
              onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-[#E5E0D8] rounded-xl focus:outline-none focus:border-[#C9A962]"
              placeholder="如：海鲜过敏、素食等"
            />
          </div>
        )}

        <div>
          <label className="flex items-center gap-2 text-sm text-[#6b6560] mb-2">
            <MessageSquare className="w-4 h-4" />
            给主人的留言
          </label>
          <textarea
            rows={2}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full px-4 py-3 bg-white border border-[#E5E0D8] rounded-xl focus:outline-none focus:border-[#C9A962] resize-none"
            placeholder="可选"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !formData.guestName}
        className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-[#2C2C2C] transition-colors disabled:opacity-50"
      >
        {submitting ? '提交中...' : formData.status === 'confirmed' ? '确认出席' : '提交回复'}
      </button>
    </form>
  )
}
