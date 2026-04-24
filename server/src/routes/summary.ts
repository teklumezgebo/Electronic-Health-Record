import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../lib/prisma'
import { Router } from 'express'
import { authenticateToken, authorizeRoles } from '../middleware/auth'
import { logAudit } from '../lib/audit'
import { Action, Resource } from '../generated/prisma/client'
import { SUMMARY_PROMPT } from '../lib/prompts'

const router = Router({ mergeParams: true })

// Create Anthropic SDK instance
const client = new Anthropic({ 
    apiKey: process.env.ANTHROPIC_API_KEY
}) 

// Doctors only authorized to view AI summary as they have the most medical training
router.get('/:id/summary', authenticateToken, authorizeRoles('DOCTOR'), async (req, res) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: req.params.id as string },
            include: {
                notes: true,
                medications: true,
                diagnoses: true,
                allergies: true
            }
        })

        if (patient == null) {
            return res.status(404).send()
        } 

        const message = await client.messages.create({
            model: 'claude-haiku-4-5-20251001', // Cheaper and efficient model, more than capable of handling summarization
            max_tokens: 1024,
            system: SUMMARY_PROMPT,
            messages: [{
                role: 'user',
                content: `Please summarize this patient:
                    Name: ${patient.firstName} ${patient.lastName}
                    Date of Birth: ${patient.dateOfBirth}
                    Blood Type: ${patient.bloodType}
                    Weight: ${patient.weight}
                    Diagnoses: ${JSON.stringify(patient.diagnoses)}
                    Medications: ${JSON.stringify(patient.medications)}
                    Allergies: ${JSON.stringify(patient.allergies)}
                    Notes: ${JSON.stringify(patient.notes)}`
            }]
        })

        const block = message.content[0]

        if (block.type !== 'text') { // SDK returns TextBlock or ThinkingBlock, only TextBlock has a text field we can parse
            return res.status(500).send()
        }
        
        // JSON output isnt structured reliably straight from Claude, consistent extraction of JSON applied
        const rawText = block.text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim()
        
        const summary = JSON.parse(rawText)
        await logAudit(req.user!.id, Action.VIEW, Resource.PATIENT, patient.id)
        res.status(200).json(summary)
    } catch (error) {
        console.error(error)
        res.status(500).send()
    }
})

export default router