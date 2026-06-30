"use client"

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { useDarkCursor } from '@/hooks/useDarkCursor'

export default function StudioPage() {
  useDarkCursor()
  
  return <NextStudio config={config} />
}