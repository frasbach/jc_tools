'use client'

import { SiteHeader } from "@/components/side-header"
import SplittingTable from "@/components/splitting-table"

export default function Home() {
  return (
    <div className="main">
      <SiteHeader />
      <div className="flex min-h-screen items-center justify-center">
        <SplittingTable />
      </div>
    </div>
  )
}