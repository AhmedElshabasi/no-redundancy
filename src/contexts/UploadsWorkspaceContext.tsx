'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { TeamRow } from '@/types/team'
import type { UploadPackageRow } from '@/types/uploadWorkspace'

export type UploadsWorkspaceValue = {
  initialUploads: UploadPackageRow[]
  serverUploadCount: number
  serverTotalBytes: number
  loadError: string | null
  teams: TeamRow[]
  activeTeamId: string | null
}

const UploadsWorkspaceContext = createContext<UploadsWorkspaceValue | null>(null)

export function UploadsWorkspaceProvider({
  value,
  children,
}: {
  value: UploadsWorkspaceValue
  children: ReactNode
}) {
  return <UploadsWorkspaceContext.Provider value={value}>{children}</UploadsWorkspaceContext.Provider>
}

export function useUploadsWorkspace(): UploadsWorkspaceValue {
  const ctx = useContext(UploadsWorkspaceContext)
  if (!ctx) {
    throw new Error('useUploadsWorkspace must be used within UploadsWorkspaceProvider')
  }
  return ctx
}
