import React, { ReactNode } from 'react'
import Settings from './settings'

function layoutDashboard({
    children,
}: {
    children: React.ReactNode
}) {
  return (
    <Settings>{children}</Settings>
  )
}

export default layoutDashboard
