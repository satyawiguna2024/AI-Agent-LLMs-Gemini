export const generatePrompt = async ({ prompt, thread_id }) => {
  const res = await fetch('http://localhost:3001/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      thread_id,
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to fetch LLM response')
  }

  return res.json()
}