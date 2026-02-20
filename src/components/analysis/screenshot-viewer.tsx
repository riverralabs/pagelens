"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Tablet, Smartphone } from "lucide-react"

interface Screenshot {
  viewport: number
  r2Url: string
}

interface ScreenshotViewerProps {
  screenshots: Screenshot[]
}

export function ScreenshotViewer({ screenshots }: ScreenshotViewerProps) {
  const desktop = screenshots.find(s => s.viewport === 1440)
  const tablet = screenshots.find(s => s.viewport === 768)
  const mobile = screenshots.find(s => s.viewport === 375)

  return (
    <Tabs defaultValue="desktop">
      <TabsList>
        <TabsTrigger value="desktop"><Monitor className="h-4 w-4 mr-1" />Desktop</TabsTrigger>
        <TabsTrigger value="tablet"><Tablet className="h-4 w-4 mr-1" />Tablet</TabsTrigger>
        <TabsTrigger value="mobile"><Smartphone className="h-4 w-4 mr-1" />Mobile</TabsTrigger>
      </TabsList>
      {[{ key: "desktop", data: desktop }, { key: "tablet", data: tablet }, { key: "mobile", data: mobile }].map(({ key, data }) => (
        <TabsContent key={key} value={key}>
          {data ? (
            <div className="overflow-auto rounded-lg border bg-muted/30 p-2">
              <img src={data.r2Url} alt={`${key} screenshot`} className="w-full rounded" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No {key} screenshot available</p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
