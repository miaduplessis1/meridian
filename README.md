
# Meridian Proposal Agent

An AI agent that turns a financial adviser's meeting notes into a fully
populated investment proposal. Built for the Old Mutual Wealth AI Engineer
Challenge.

## What it does

1. An adviser pastes their meeting notes (plain English) into the app.
2. The notes are sent to an LLM (Google Gemini) via a Next.js API route
   (`/api/extract`), which extracts a structured JSON object matching the
   proposal schema — never inventing figures the notes didn't provide.
3. That JSON is passed into `challenge-generator.html` via
   `window.postMessage` + `window.loadProposal()`, rendering a complete,
   ready-to-review investment proposal.

Any field the model can't confidently fill in from the notes (e.g. a missing
investment amount or time horizon) is flagged inside the generated proposal
as a distinct amber "confirm with client" callout, rather than being guessed
or silently left buried in the text.

## Model used

**Google Gemini 3.6-flash**, called directly via the Generative Language API
(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`).

The route includes automatic retry with backoff on transient `429`
(rate limit) and `503` (overloaded) errors, with fallback to
`gemini-flash-latest` and `gemini-2.5-flash-lite` if the primary model is
unavailable.

**Note:** this demo runs on a free-tier Gemini API key. Under heavy
back-to-back testing, a `429` or `503` can occasionally surface even with
the retry/fallback logic in place — this reflects free-tier rate limits,
not an application bug.

## Running it locally

Requires an environment variable named `Gemini_API_Key` (or `GEMINI_API_KEY`,
both are supported) set to a valid Gemini API key from
[Google AI Studio](https://aistudio.google.com/apikey).
