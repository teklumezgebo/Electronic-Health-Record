import { prisma } from '../lib/prisma'
import { Router } from 'express'
import { authenticateToken, authorizeRoles } from '../middleware/auth'
import { logAudit } from '../lib/audit'
import { Action, Resource } from '../generated/prisma/client'

const router = Router({ mergeParams: true })

router.get('/', authenticateToken, async (req, res) => {
    try {
        const notes = await prisma.note.findMany({
            where: { patientId: req.params.patientId as string }
        })
        if (notes.length == 0) { 
            return res.status(404).send() // Notes do not exist
        }

        await logAudit(req.user!.id, Action.VIEW, Resource.NOTE, req.params.patientId as string)
        res.status(200).send(notes) 
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

// Only Doctors and Nurses can create notes
router.post('/', authenticateToken, authorizeRoles('DOCTOR', 'NURSE'), async (req, res) => {
    try {
        const note = await prisma.note.create({
            data: {
                noteType: req.body.noteType,
                body: req.body.body,
                patientId: req.params.patientId as string,
                writerId: req.user!.id,
            }
        })

        await logAudit(req.user!.id, Action.CREATE, Resource.NOTE, note.id)
        res.status(201).send(note)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

// Before a note is able to be updated it must exist and belong to the user accessing it
router.put('/:id', authenticateToken, authorizeRoles('DOCTOR', 'NURSE'), async (req, res) => {
    try {
        const note = await prisma.note.findUnique({
            where: { id: req.params.id as string }
        })

        if (note == null) {
            return res.status(404).send() // Note does not exist
        }

        if (note.writerId !== req.user!.id) {
            return res.status(403).send() // Forbidden access, note doesn't belong to user
        }

        const updatedNote = await prisma.note.update({
        where: { id: req.params.id as string },
        data: req.body
        })

        await logAudit(req.user!.id, Action.UPDATE, Resource.NOTE, note.id)
        res.status(200).send(updatedNote)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

// Sign note
router.put('/:id/sign', authenticateToken, authorizeRoles('DOCTOR', 'NURSE'), async (req, res) => {
    try {
        const note = await prisma.note.findUnique({
            where: { id: req.params.id as string }
        })

        if (note == null) {
            return res.status(404).send() // Note does not exist
        }

        if (note.writerId !== req.user!.id) {
            return res.status(403).send() // Forbidden access, note doesn't belong to user
        }

        const updatedNote = await prisma.note.update({
        where: { id: req.params.id as string },
        data: {
            signedAt: new Date()
        }
        })

        await logAudit(req.user!.id, Action.UPDATE, Resource.NOTE, note.id)
        res.status(200).send(updatedNote)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

export default router