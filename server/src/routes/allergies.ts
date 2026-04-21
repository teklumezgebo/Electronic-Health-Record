import { prisma } from '../lib/prisma'
import { Router } from 'express'
import { authenticateToken, authorizeRoles } from '../middleware/auth'
import { logAudit } from '../lib/audit'
import { Action, Resource } from '../generated/prisma/client'

const router = Router()

router.get('/', authenticateToken, async (req, res) => {
    try {
        const allergies = await prisma.allergy.findMany({
            where: { patientId: req.params.patientId as string }
        })

        if (allergies.length == 0) { 
            return res.status(404).send() // Allergies do not exist
        }

        await logAudit(req.user!.id, Action.VIEW, Resource.ALLERGY, req.params.patientId as string)
        res.status(200).send(allergies)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

// Doctors and Nurses are only authorized to assign allergies
router.post('/', authenticateToken, authorizeRoles('DOCTOR', 'NURSE'), async (req, res) => {
    try {
        const allergy = await prisma.allergy.create({
            data: {
                allergen: req.body.allergen,
                symptoms: req.body.symptoms,
                severity: req.body.severity,
                patientId: req.params.patientId as string,
                providerId: req.user!.id
            }
        })

        await logAudit(req.user!.id, Action.CREATE, Resource.ALLERGY, allergy.id)
        res.status(201).send(allergy)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})
// Doctors and Nurses are only authorized to update allergies
router.put('/:id', authenticateToken, authorizeRoles('DOCTOR', 'NURSE'), async (req, res) => {
    try {
        const allergy = await prisma.allergy.findUnique({
            where: { id: req.params.id as string }
        })

        if (allergy == null) {
            return res.status(404).send() // Allergy does not exist
        }

        const updatedallergy = await prisma.allergy.update({
            where: { id: req.params.id as string },
            data: req.body
        })

        await logAudit(req.user!.id, Action.UPDATE, Resource.ALLERGY, allergy.id)
        res.status(200).send(updatedallergy)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

export default router