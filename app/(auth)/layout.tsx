import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-muted/40">
            {children}
        </div>
    )
}

export default AuthLayout
