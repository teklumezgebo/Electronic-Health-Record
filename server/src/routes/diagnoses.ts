import { prisma } from '../lib/prisma'
import { Router } from 'express'
import { authenticateToken, authorizeRoles } from '../middleware/auth'
import { logAudit } from '../lib/audit'
import { Action, Resource } from '../generated/prisma/client'

const router = Router()

router.get('/', authenticateToken, async (req, res) => {
    try {
        const diagnoses = await prisma.diagnosis.findMany({
            where: { patientId: req.params.patientId as string }
        })

        if (diagnoses.length == 0) { 
            return res.status(404).send() // Diagnoses do not exist
        }

        await logAudit(req.user!.id, Action.VIEW, Resource.DIAGNOSIS, req.params.patientId as string)
        res.status(200).send(diagnoses)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

// Doctors are only authorized to diagnose
router.post('/', authenticateToken, authorizeRoles('DOCTOR'), async (req, res) => {
    try {
        const diagnosis = await prisma.diagnosis.create({
            data: {
                name: req.body.name,
                code: req.body.code,
                status: req.body.status,
                patientId: req.params.patientId as string,
                providerId: req.user!.id
            }
        })

        await logAudit(req.user!.id, Action.CREATE, Resource.DIAGNOSIS, diagnosis.id)
        res.status(201).send(diagnosis)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

// Doctors are only authorized to update diagnoses
router.put('/:id', authenticateToken, authorizeRoles('DOCTOR'), async (req, res) => {
    try {
        const diagnosis = await prisma.diagnosis.findUnique({
            where: { id: req.params.id as string }
        })

        if (diagnosis == null) {
            return res.status(404).send() // Diagnosis does not exist
        }

        const updatedDiagnosis = await prisma.diagnosis.update({
            where: { id: req.params.id as string },
            data: req.body
        })

        await logAudit(req.user!.id, Action.UPDATE, Resource.DIAGNOSIS, req.params.id as string)
        res.status(200).send(updatedDiagnosis)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

export default router