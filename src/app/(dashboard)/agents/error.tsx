"use client"
import ErrorState from '@/components/ErrorState';
import React from 'react'

function ErrorPage() {
  return (
    
    <ErrorState
      title="Failed to load agents"
      description="Please try again later."
    />
  )
}

export default ErrorPage