import { prisma } from '../lib/prisma'
import { Router } from 'express'
import { authenticateToken, authorizeRoles } from '../middleware/auth'

const router = Router()

router.get('/', authenticateToken, async (req, res) => {
    try {
        const diagnoses = await prisma.diagnosis.findMany({
            where: { patientId: req.params.patientId as string }
        })

        if (diagnoses.length == 0) { 
            return res.status(404).send() // Diagnoses do not exist
        }

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

        res.status(200).send(updatedDiagnosis)

    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

export default router