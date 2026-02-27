import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LogoutButton from '../components/ui/LogoutButton'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-canvas to-neutral-100 flex items-center justify-center p-6">
      <Card className="text-center max-w-md w-full relative">
        <LogoutButton className="absolute top-4 right-4" />
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-ink mb-4">Page Not Found</h1>
        <p className="text-neutral-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Button as={Link} to="/" className="w-full bg-brand-600 hover:bg-brand-700">
            🏠 Go Home
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            ← Go Back
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default NotFound
