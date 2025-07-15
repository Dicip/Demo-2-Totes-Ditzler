'use server';
/**
 * @fileOverview Flow for detecting anomalous login attempts.
 *
 * - detectLoginAnomalies - Detects unusual login patterns.
 * - DetectLoginAnomaliesInput - Input for the anomaly detection flow.
 * - DetectLoginAnomaliesOutput - Output of the anomaly detection flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectLoginAnomaliesInputSchema = z.object({
  userId: z.string().describe('The ID of the user attempting to log in.'),
  ipAddress: z.string().describe('The IP address of the login attempt.'),
  timestamp: z.number().describe('The timestamp of the login attempt (in milliseconds since epoch).'),
  failedAttempts: z.number().describe('The number of failed login attempts for this user recently.'),
  location: z.string().describe('The location from which the login attempt is originating (e.g., city, country).'),
});
export type DetectLoginAnomaliesInput = z.infer<typeof DetectLoginAnomaliesInputSchema>;

const DetectLoginAnomaliesOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the login attempt is considered anomalous.'),
  reason: z.string().describe('The reason for considering the login attempt anomalous.'),
});
export type DetectLoginAnomaliesOutput = z.infer<typeof DetectLoginAnomaliesOutputSchema>;

export async function detectLoginAnomalies(input: DetectLoginAnomaliesInput): Promise<DetectLoginAnomaliesOutput> {
  return detectLoginAnomaliesFlow(input);
}

const detectLoginAnomaliesPrompt = ai.definePrompt({
  name: 'detectLoginAnomaliesPrompt',
  input: {schema: DetectLoginAnomaliesInputSchema},
  output: {schema: DetectLoginAnomaliesOutputSchema},
  prompt: `You are a security expert tasked with detecting anomalous login attempts.

  Based on the following information about a login attempt, determine if it is anomalous and provide a reason:

  User ID: {{{userId}}}
  IP Address: {{{ipAddress}}}
  Timestamp: {{{timestamp}}}
  Failed Attempts: {{{failedAttempts}}}
  Location: {{{location}}}

  Consider factors such as rapid failed attempts, unusual locations, and any other suspicious patterns.

  Return a JSON object with 'isAnomalous' (true or false) and 'reason' (a brief explanation).

  {
    "isAnomalous": true|false,
    "reason": "Explanation of why the login is considered anomalous."
  }`,
});

const detectLoginAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectLoginAnomaliesFlow',
    inputSchema: DetectLoginAnomaliesInputSchema,
    outputSchema: DetectLoginAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await detectLoginAnomaliesPrompt(input);
    return output!;
  }
);
