
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, outletContext, personaContext } = await req.json()

    const systemPrompt = `You are RepGPT, a specialized AI sales assistant for beverage industry representatives. 
    ${outletContext ? `\nOutlet Context: ${outletContext}` : ''}
    ${personaContext ? `\nCustomer Persona: ${personaContext}` : ''}
    
    Focus on providing:
    1. Relevant outlet-specific insights
    2. Tailored activation plans
    3. Smart conversation starters
    4. Product recommendations based on outlet type and customer persona
    
    Be concise, professional, and always align recommendations with the outlet context and customer persona.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`)
    }

    const data = await response.json()
    const reply = data.choices[0].message.content

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in chat-with-repgpt function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
