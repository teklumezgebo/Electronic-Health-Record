// Extending Request type to include an optional user field

declare global {
    namespace Express {
        interface Request { 
            user?: {
                id: string
                role: string
            }
        }
    }
}

export {}