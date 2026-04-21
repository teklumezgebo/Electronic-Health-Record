import { prisma } from './prisma'
import { Action, Resource } from '../generated/prisma/client'

// Audit logs are created with every action made to a record
// HIPAA require that systems that handle Protected Health Information maintain a record of who accessed or modified data
export async function logAudit(
    userId: string,
    action: Action,
    resource: Resource,
    resourceId: string
) {
    await prisma.auditLog.create({
        data: {
            userId,
            action,
            resource,
            resourceId
        }
    })
}