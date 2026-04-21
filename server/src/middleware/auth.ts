import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

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

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'] // Retrieve authorization information from request
    const token = authHeader?.split(' ')[1] // Extract token, token is the actual token or undefined

    if (token == null) { // Token not included in header
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) {
            return res.sendStatus(403) // User forbidden, token incorrect or tampered
        }
        
        // Allow access to route handling logic without having to decode again
        req.user = user as { id: string, role: string }
        next()
    })

}

// Role-Based Access Control
export function authorizeRoles(...roles: string[]) { // sample input: ['DOCTOR', 'NURSE']
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.sendStatus(403) // Role not authorized for endpoint
        }
        next()
    }
}