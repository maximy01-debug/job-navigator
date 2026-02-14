"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Clock, Edit } from "lucide-react"
import { format } from "date-fns"

interface TimelineItemProps {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  targetDate?: Date
  grade: 1 | 2 | 3
  isLast?: boolean
}

const statusConfig = {
  pending: {
    icon: Circle,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    label: '예정'
  },
  in_progress: {
    icon: Clock,
    color: 'text-primary',
    bgColor: 'bg-primary',
    label: '진행 중'
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-secondary',
    bgColor: 'bg-secondary',
    label: '완료'
  }
}

export function TimelineItem({
  title,
  description,
  status,
  targetDate,
  grade,
  isLast = false
}: TimelineItemProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex gap-4">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className={`h-10 w-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${config.color === 'text-muted-foreground' ? 'text-white' : 'text-white'}`} />
        </div>
        {!isLast && (
          <div className="w-0.5 h-full min-h-[60px] bg-border mt-2" />
        )}
      </div>

      {/* Content */}
      <Card className={`flex-1 mb-6 ${status === 'in_progress' ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  grade === 1 ? 'bg-blue-100 text-blue-700' :
                  grade === 2 ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {grade}학년
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  status === 'completed' ? 'bg-secondary/10 text-secondary' :
                  status === 'in_progress' ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {config.label}
                </span>
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
              {targetDate && (
                <p className="text-xs text-muted-foreground mt-2">
                  목표: {format(targetDate, 'yyyy년 MM월 dd일')}
                </p>
              )}
            </div>
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
