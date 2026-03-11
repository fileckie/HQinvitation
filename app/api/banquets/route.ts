import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const banquets = await prisma.banquet.findMany({
      include: {
        restaurant: {
          select: {
            name: true
          }
        },
        rsvps: {
          select: {
            status: true,
            attendeeCount: true
          }
        },
        _count: {
          select: {
            rsvps: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 计算统计数据
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const stats = {
      total: banquets.length,
      thisMonth: banquets.filter(b => {
        const date = new Date(b.createdAt)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      }).length,
      pending: banquets.filter(b => b.status === 'active').length,
      confirmed: banquets.reduce((sum, b) => {
        return sum + b.rsvps.filter(r => r.status === 'confirmed').reduce((s, r) => s + r.attendeeCount, 0)
      }, 0)
    }

    return NextResponse.json({ banquets, stats })
  } catch (error) {
    console.error('Error fetching banquets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banquets' },
      { status: 500 }
    )
  }
}
