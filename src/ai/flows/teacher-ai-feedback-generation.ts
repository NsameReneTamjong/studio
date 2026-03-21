'use server';
/**
 * @fileOverview A Genkit flow for generating personalized and constructive feedback for students.
 *
 * - generateStudentFeedback - A function that handles the student feedback generation process.
 * - GenerateStudentFeedbackInput - The input type for the generateStudentFeedback function.
 * - GenerateStudentFeedbackOutput - The return type for the generateStudentFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GradeSchema = z.object({
  assignment: z.string().describe('Name of the assignment or test.'),
  score: z.number().describe('Score obtained for the assignment.'),
  maxScore: z.number().describe('Maximum possible score for the assignment.'),
});

const GenerateStudentFeedbackInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  className: z.string().describe('The name of the class.'),
  grades: z.array(GradeSchema).describe('A list of the student\u0027s grades for various assignments.'),
  attendancePercentage: z.number().min(0).max(100).describe('The student\u0027s attendance percentage (0-100).'),
  additionalContext: z.string().optional().describe('Any additional context or observations about the student.'),
});
export type GenerateStudentFeedbackInput = z.infer<typeof GenerateStudentFeedbackInputSchema>;

const GenerateStudentFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Personalized and constructive feedback for the student.'),
});
export type GenerateStudentFeedbackOutput = z.infer<typeof GenerateStudentFeedbackOutputSchema>;

export async function generateStudentFeedback(input: GenerateStudentFeedbackInput): Promise<GenerateStudentFeedbackOutput> {
  return generateStudentFeedbackFlow(input);
}

const feedbackPrompt = ai.definePrompt({
  name: 'studentFeedbackPrompt',
  input: {schema: GenerateStudentFeedbackInputSchema},
  output: {schema: GenerateStudentFeedbackOutputSchema},
  prompt: `You are an AI assistant specialized in generating personalized and constructive feedback for students.

Generate detailed feedback for the student named '{{{studentName}}}' in the class '{{{className}}}' based on their academic performance and attendance.

Consider the following data:
Student Name: {{{studentName}}}
Class Name: {{{className}}}

Academic Performance (Grades):
{{#each grades}}- {{this.assignment}}: {{this.score}}/{{this.maxScore}}
{{/each}}

Attendance: {{{attendancePercentage}}}% (A higher percentage indicates better attendance.)

{{#if additionalContext}}Additional Context: {{{additionalContext}}}
{{/if}}

Your feedback should:
1. Start with a positive acknowledgment or an area of strength.
2. Clearly identify areas for improvement, providing specific examples where possible.
3. Offer actionable suggestions or strategies for growth.
4. Maintain a supportive and encouraging tone.
5. Be concise yet comprehensive.

Provide the feedback in a well-structured paragraph.`,
});

const generateStudentFeedbackFlow = ai.defineFlow(
  {
    name: 'generateStudentFeedbackFlow',
    inputSchema: GenerateStudentFeedbackInputSchema,
    outputSchema: GenerateStudentFeedbackOutputSchema,
  },
  async input => {
    const {output} = await feedbackPrompt(input);
    if (!output) {
      throw new Error('Failed to generate feedback.');
    }
    return output;
  }
);
