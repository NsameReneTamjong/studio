
'use server';
/**
 * @fileOverview A general-purpose AI assistant for all EduIgnite users.
 *
 * - getAiAssistantResponse - A function that handles general AI queries.
 * - AssistantInput - The input type for the assistant.
 * - AssistantOutput - The return type for the assistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistantInputSchema = z.object({
  userRole: z.string().describe('The role of the user (e.g., STUDENT, TEACHER, PARENT, ADMIN, BURSAR, LIBRARIAN).'),
  userName: z.string().describe('The name of the user.'),
  query: z.string().describe('The user\'s question or request.'),
  context: z.string().optional().describe('Additional context about what the user is currently viewing.'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user query.'),
  suggestions: z.array(z.string()).optional().describe('A few suggested follow-up actions or questions.'),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export async function getAiAssistantResponse(input: AssistantInput): Promise<AssistantOutput> {
  return aiAssistantFlow(input);
}

const assistantPrompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {schema: AssistantInputSchema},
  output: {schema: AssistantOutputSchema},
  prompt: `You are the EduIgnite AI, a highly intelligent and supportive educational assistant integrated into a SaaS school management platform.

User Identity:
- Name: {{{userName}}}
- Role: {{{userRole}}}

Current Context:
{{{context}}}

User Query:
{{{query}}}

Your goal is to provide a response tailored strictly to their role:
1. If the user is a STUDENT: Focus on learning support, explaining concepts, or clarifying assignment requirements.
2. If the user is a TEACHER: Assist with lesson planning ideas, grading strategies, or administrative efficiency.
3. If the user is a PARENT: Provide insights on how to support their child's learning and interpret performance data.
4. If the user is a BURSAR: Assist with financial reporting, fee collection strategies, and inventory budgeting.
5. If the user is a LIBRARIAN: Help with library management system queries, book categorization, or promoting reading culture.
6. If the user is a SCHOOL_ADMIN or SUPER_ADMIN: Help with platform management, institutional health, and data insights.

Guidelines:
- Maintain a professional, empathetic, and encouraging tone.
- Keep responses concise but comprehensive.
- Format your response using clear structure (paragraphs or lists).
- Provide 2-3 short, relevant follow-up suggestions for the user.
- Respond in the language of the query (English or French).`,
});

const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async input => {
    const {output} = await assistantPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);
