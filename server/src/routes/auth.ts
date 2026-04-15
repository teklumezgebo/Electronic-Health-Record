import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { Router } from 'express'

const router = Router()

router.post('/register', async (req, res) => {
    try {
        // Check for duplicate user, status 400 if found
        const duplicateUsername = await prisma.user.findFirst({
        where: { username: req.body.username  }
        })

        if (duplicateUsername != null) {
            return res.status(400).send()
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10) // Generate salt and hash password
    
        const user = await prisma.user.create({ // if successful new user is registered
            data :{
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                password: hashedPassword,
                role: req.body.role
            }
        })

        // create user copy to send back with password destructured out
        const {password, ...userWithoutPassword} = user 

        res.status(201).send(userWithoutPassword)
    } catch {
        res.status(500).send()
    }
})

router.post('/login', async (req, res) => {
    try {
        // Check if user is present in db, 401 if not found or if password is incorrect
        const user = await prisma.user.findFirst({
        where: { username: req.body.username  }
        })

        if (user == null) {
            return res.status(401).send()
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password)

        if (!passwordMatch) {
            return res.status(401).send()
        }

        res.send("Success")
    } catch {
        res.status(500).send()
    }
})

export default router