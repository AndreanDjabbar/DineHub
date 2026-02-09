import React from 'react'
import { Button } from '~/components'

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex items-center justify-center">
            <div className="text-center flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to DineHub</h1>
                <Button onClick={() => window.location.href = '/menu'}>Get Started</Button>
                <p className="text-gray-500">Your restaurant ordering system</p>
            </div>
        </div>
    )
}

export default Home