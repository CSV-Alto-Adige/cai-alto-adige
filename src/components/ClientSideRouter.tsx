"use client";

import Link from 'next/link'
import React from 'react'

function ClientSideRouter({ children, route, ariaLabel }: { children: React.ReactNode; route: string; ariaLabel?: string }) {
  return (
    <Link href={route} aria-label={ariaLabel} role="link" className='w-full'>{children}</Link>
  )
}

export default ClientSideRouter