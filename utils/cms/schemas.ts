import { z } from 'zod';

export const HistoryEntrySchema = z.object({
    org: z.string().min(1),
    title: z.string().min(1),
    location: z.string().min(1), 
    start: z.string({ 'invalid_type_error': 'HistoryEntry without start' }).datetime('Invalid START datetime'),
    end: z.string({ 'invalid_type_error': 'HistoryEntry without end' }).datetime('Invalid END datetime').nullable(),
})