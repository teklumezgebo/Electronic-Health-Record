import { prisma } from '../lib/prisma'
import { Router } from 'express'
import { authenticateToken, authorizeRoles } from '../middleware/auth'
import { logAudit } from '../lib/audit'
import { Action, Resource } from '../generated/prisma/client'

const router = Router()

router.get('/', authenticateToken, async (req, res) => {
    try {
        const medications = await prisma.medication.findMany({
            where: { patientId: req.params.patientId as string }
        })

        if (medications.length == 0) { 
            return res.status(404).send() // medications do not exist
        }

        await logAudit(req.user!.id, Action.VIEW, Resource.MEDICATION, req.params.patientId as string)
        res.status(200).send(medications)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

// Doctors are only authorized to prescribe
router.post('/', authenticateToken, authorizeRoles('DOCTOR'), async (req, res) => {
    try {
        const medication = await prisma.medication.create({
            data: {
                name: req.body.name,
                dosage: req.body.dosage,
                frequency: req.body.frequency,
                status: req.body.status,
                patientId: req.params.patientId as string,
                prescriberId: req.user!.id
            }
        })

        await logAudit(req.user!.id, Action.CREATE, Resource.MEDICATION, medication.id)
        res.status(201).send(medication)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

// Prescribing Doctor is only authorized to update medication
router.put('/:id', authenticateToken, authorizeRoles('DOCTOR'), async (req, res) => {
    try {
        const medication = await prisma.medication.findUnique({
            where: { id: req.params.id as string }
        })

        if (medication == null) {
            return res.status(404).send() // medication does not exist
        }

        const updatedMedication = await prisma.medication.update({
            where: { id: req.params.id as string },
            data: req.body
        })

        await logAudit(req.user!.id, Action.UPDATE, Resource.MEDICATION, medication.id)
        res.status(200).send(updatedMedication)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

export default router