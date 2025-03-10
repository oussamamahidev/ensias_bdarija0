"use client"

import { useEffect, useRef } from "react"

interface ProfileActivityProps {
  userId: string
}

const ProfileActivity = ({ userId }: ProfileActivityProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const activityData = [
    { date: "2023-01", count: 5 },
    { date: "2023-02", count: 8 },
    { date: "2023-03", count: 12 },
    { date: "2023-04", count: 7 },
    { date: "2023-05", count: 15 },
    { date: "2023-06", count: 20 },
    { date: "2023-07", count: 18 },
    { date: "2023-08", count: 25 },
    { date: "2023-09", count: 22 },
    { date: "2023-10", count: 30 },
    { date: "2023-11", count: 28 },
    { date: "2023-12", count: 35 },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Find max count for scaling
    const maxCount = Math.max(...activityData.map((d) => d.count))

    // Calculate dimensions
    const padding = { top: 20, right: 20, bottom: 30, left: 40 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#E5E7EB" // Light gray for axes
    ctx.lineWidth = 1

    // Y-axis
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, rect.height - padding.bottom)

    // X-axis
    ctx.moveTo(padding.left, rect.height - padding.bottom)
    ctx.lineTo(rect.width - padding.right, rect.height - padding.bottom)
    ctx.stroke()

    // Draw bars
    const barWidth = (chartWidth / activityData.length) * 0.8
    const barSpacing = (chartWidth / activityData.length) * 0.2

    activityData.forEach((data, index) => {
      const barHeight = (data.count / maxCount) * chartHeight
      const x = padding.left + index * (barWidth + barSpacing)
      const y = rect.height - padding.bottom - barHeight

      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, rect.height - padding.bottom)
      gradient.addColorStop(0, "#FF7000") // Your primary-500 color
      gradient.addColorStop(1, "#FFB27D") // Lighter version of primary color

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 4) // Rounded corners
      ctx.fill()

      // Add month label
      if (index % 3 === 0) {
        ctx.fillStyle = "#6B7280" // Gray-500
        ctx.font = "12px Inter"
        ctx.textAlign = "center"
        ctx.fillText(data.date.split("-")[1], x + barWidth / 2, rect.height - padding.bottom + 20)
      }
    })

    // Add y-axis labels
    ctx.fillStyle = "#6B7280" // Gray-500
    ctx.font = "12px Inter"
    ctx.textAlign = "right"

    const yLabels = [0, Math.round(maxCount / 2), maxCount]
    yLabels.forEach((label, i) => {
      const y = rect.height - padding.bottom - i * (chartHeight / 2)
      ctx.fillText(label.toString(), padding.left - 10, y + 4)
    })
  }, [activityData])

  return (
    <div className="w-full h-[240px] relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}

export default ProfileActivity

