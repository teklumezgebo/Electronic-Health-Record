import { prisma } from '../lib/prisma'
import { Router } from 'express'
import { authenticateToken, authorizeRoles } from '../middleware/auth'

const router = Router()

router.get('/', authenticateToken, async (req, res) => {
    try {
        const patients = await prisma.patient.findMany()
        res.status(200).send(patients) 
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: req.params.id as string }, // Casting as string since id will always be a string
            include: {
                notes: true,
                medications: true,
                diagnoses: true,
                allergies: true,
            }
        })

        if (patient == null) { 
            return res.status(404).send() // Patient does not exist
        }

        res.status(200).send(patient) 
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

// Physicians, Admin, and Nurses only authorized to create patient records
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE'), async (req, res) => {
    try {
        const patient = await prisma.patient.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                MRN: parseInt(req.body.MRN),
                weight: req.body.weight,
                phone: req.body.phone,
                address: req.body.address,
                bloodType: req.body.bloodType
            },
        })
        res.status(201).send(patient)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

// Physicians, Admin, and Nurses only authorized to update patient records
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE'), async (req, res) => {
    try {
        const updatedPatient = await prisma.patient.update({
            where: { id: req.params.id as string },
            data : req.body
        })

        res.status(200).send(updatedPatient)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

export default router