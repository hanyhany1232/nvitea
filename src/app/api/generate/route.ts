import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are CoverCraft, an expert career writer that produces tailored, ATS-friendly cover letters. Rules you MUST follow:

1. Mirror the language of the job posting and the requested output language.
2. Open with a concrete hook tied to the company or role — never start with "I am writing to express my interest" or similar boilerplate.
3. Pick the 2-3 most relevant accomplishments from the candidate's résumé and quantify impact wherever possible (numbers, percentages, scale).
4. Use natural, confident prose — no clichés ("team player", "fast-paced environment", "passionate about"). One short paragraph per idea.
5. Keep it under 320 words. Single page. No headers, no markdown, no emojis.
6. End with a clear, specific call-to-action.
7. Output ONLY the body of the letter (greeting through sign-off). No explanations, no preamble, no "Here is your cover letter:".`;

const TONES = ["professional", "friendly", "enthusiastic"] as const;
const LANGUAGES = ["english", "french"] as const;

type Tone = (typeof TONES)[number];
type Language = (typeof LANGUAGES)[number];

interface GenerateBody {
  job_description?: unknown;
  resume?: unknown;
  tone?: unknown;
  language?: unknown;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asTone(value: unknown): Tone {
  return TONES.includes(value as Tone) ? (value as Tone) : "professional";
}

function asLanguage(value: unknown): Language {
  return LANGUAGES.includes(value as Language)
    ? (value as Language)
    : "english";
}

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        detail:
          "Server is missing DEEPSEEK_API_KEY. Set it in Vercel project settings and redeploy.",
      },
      { status: 503 },
    );
  }

  let body: GenerateBody;
  try {
    body = (await request.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body." }, { status: 400 });
  }

  const job_description = asString(body.job_description).trim();
  const resume = asString(body.resume).trim();
  const tone = asTone(body.tone);
  const language = asLanguage(body.language);

  if (job_description.length < 20) {
    return NextResponse.json(
      { detail: "Job description must be at least 20 characters." },
      { status: 400 },
    );
  }
  if (resume.length < 20) {
    return NextResponse.json(
      { detail: "Résumé must be at least 20 characters." },
      { status: 400 },
    );
  }
  if (job_description.length > 20_000 || resume.length > 20_000) {
    return NextResponse.json(
      { detail: "Inputs are too long (20,000 character max)." },
      { status: 400 },
    );
  }

  const userPrompt = `Write a cover letter in ${language} with a ${tone} tone.

<job_description>
${job_description}
</job_description>

<candidate_resume>
${resume}
</candidate_resume>

Produce the letter now.`;

  const baseURL =
    process.env.LLM_BASE_URL ?? "https://api.deepseek.com/v1";
  const model = process.env.COVERCRAFT_MODEL ?? "deepseek-v4-flash";
  const client = new OpenAI({ apiKey, baseURL });

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.7,
      max_tokens: 1200,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const letter = completion.choices[0]?.message?.content?.trim() ?? "";

    if (!letter) {
      return NextResponse.json(
        { detail: "Empty response from model." },
        { status: 502 },
      );
    }

    return NextResponse.json({ cover_letter: letter, model });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { detail: `LLM call failed: ${msg}` },
      { status: 502 },
    );
  }
}
