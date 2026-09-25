import { NextResponse } from 'next/server'

const MODELS_TO_TRY = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite']

const SYSTEM_PROMPT = `You are an assistant that converts messy financial adviser notes into a single JSON object matching a strict schema, used to auto-populate an investment proposal tool.

Rules:
- Output ONLY valid JSON. No markdown, no commentary, no code fences.
- Every field in the schema is optional. Only include fields the notes actually support.
- NEVER invent or estimate a financial figure (investment amount, income figure, fee, or horizon) that isn't stated or clearly implied in the notes. If key information is missing, write a bracketed note inside the "needs" field listing exactly what still needs to be confirmed, e.g. "[TO CONFIRM WITH CLIENT: investment amount, time horizon]".
- Rewrite the client's situation into polished, professional third-person prose for the "needs" field — do not copy the adviser's raw notes verbatim.
- For "applyModel", choose the ID whose profile most closely matches what the client actually needs (goals, risk tolerance, income vs growth priority) — not the literal wording in the notes. The three available models are:
  - "balanced": Meridian Balanced Portfolio (ZAR) — local + global blend with an income base; use for moderate/balanced/general growth-with-some-income mandates.
  - "global-growth": Meridian Global Growth Portfolio (USD) — predominantly global equity, growth-focused; use for aggressive, pure-growth, offshore-heavy mandates with no income need.
  - "income": Meridian Income Portfolio (ZAR) — income-oriented, defensive; use for capital-preservation-first, local-focused, income-drawdown mandates.
  If none genuinely fit, omit "applyModel" and populate "strategy" by hand instead.
- Set "introGreetTo" to "advisor" if the notes indicate the proposal should be addressed to a financial adviser/planner rather than the client directly; otherwise default to "client".
- Additional fields not in the schema may be included if the notes provide a clearly relevant fact that doesn't fit an existing field (additionalProperties is allowed).

JSON schema to follow:
{
  "type": "object",
  "properties": {
    "clientName": "string",
    "clientEmail": "string",
    "introGreetTo": "client | advisor (default client)",
    "applyModel": "balanced | global-growth | income",
    "introduction": "string",
    "needs": "string — prose narrative of client situation/goals",
    "status": "draft | complete",
    "goalAssessment": { "clientType": "e.g. Individual, Trust, Company", "mandateType": "e.g. Discretionary", "currency": "ZAR | USD | GBP | EUR", "keyFigures": { "totalInvestment": "string, number only e.g. 8500000", "incomeValue": "string, monthly/annual income drawdown amount" } },
    "objective": { "targetReturn": "e.g. CPI + 5%", "benchmark": "string", "riskProfile": "narrative paragraph", "investmentHorizon": "e.g. 10 years+" },
    "strategy": { "model": "model id, alternative to applyModel", "portfolioName": "string", "currency": "string", "allocation": [{ "class": "string", "key": "sa-equity|intl-equity|fixed-interest|bonds|property|cash|other", "percent": "number" }], "composition": "prose", "rationale": "prose" },
    "fees": { "management": "string %", "advisorFee": "string %", "adminFee": "string %", "brokerage": "string %" },
    "replacements": { "isReplacement": "boolean", "details": "string" }
  }
}`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const notes = typeof body?.notes === 'string' ? body.notes.trim() : ''

    if (!notes) {
      return NextResponse.json({ error: 'Please add meeting notes before generating a proposal.' }, { status: 400 })
    }

    // Support the project's existing variable while also accepting Gemini's conventional uppercase name.
    const apiKey = process.env.GEMINI_API_KEY ?? process.env.Gemini_API_Key
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY (or Gemini_API_Key) is not configured.')
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELS_TO_TRY[0]}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: `${SYSTEM_PROMPT}\n\nReturn ONLY raw JSON. Do not wrap the response in markdown or code fences.` }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: `Convert these adviser notes into the JSON object described above:\n\n${notes}` }],
            },
          ],
          generationConfig: {
            temperature: 0,
            responseMimeType: 'application/json',
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API request failed with status ${response.status}.`)
    }

    const result = await response.json()
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text
    if (typeof generatedText !== 'string' || !generatedText.trim()) {
      throw new Error('Gemini returned an empty response.')
    }

    const cleaned = generatedText.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
    const data = JSON.parse(cleaned)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Proposal extraction failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
