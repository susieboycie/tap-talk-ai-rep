
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

    try {
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
        const errorText = await response.text();
        console.error(`OpenAI API error: ${errorText}`);
        
        // Fallback response when API fails
        const fallbackReply = generateFallbackResponse(message, outletContext, personaContext);
        
        return new Response(
          JSON.stringify({ reply: fallbackReply }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const data = await response.json()
      const reply = data.choices[0].message.content

      return new Response(
        JSON.stringify({ reply }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      
      // Fallback response when API throws an exception
      const fallbackReply = generateFallbackResponse(message, outletContext, personaContext);
      
      return new Response(
        JSON.stringify({ reply: fallbackReply }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
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

// Function to generate a fallback response when the API call fails
function generateFallbackResponse(message: string, outletContext?: string, personaContext?: string): string {
  const genericResponses = [
    "I understand you're asking about beverage sales strategies. While I'm currently experiencing connection issues with my knowledge base, I'd typically recommend focusing on seasonal promotions and staff training for this type of inquiry.",
    
    "Thank you for your question about beverage industry insights. I'm currently operating with limited connectivity, but I can suggest reviewing recent sales patterns and customer preferences as a starting point.",
    
    "I notice you're interested in optimizing your beverage offerings. While I'm operating in backup mode at the moment, I'd generally suggest analyzing your top-performing products and considering complementary pairings to enhance your selection.",
    
    "While my advanced analytics are temporarily unavailable, I can recommend focusing on staff product knowledge and upselling techniques as core strategies for increasing beverage sales.",
    
    "I appreciate your question about beverage industry trends. I'm currently operating with limited functionality, but would typically suggest exploring local craft options and premium non-alcoholic alternatives as growing market segments."
  ];

  let outletType = "your venue";
  let personaType = "";
  
  // Extract venue type from context if available
  if (outletContext && outletContext.includes("outlet:")) {
    const match = outletContext.match(/outlet:\s*([^.]+)/i);
    if (match && match[1]) {
      outletType = match[1].trim();
    }
  }
  
  // Extract persona type if available
  if (personaContext && personaContext.includes("persona type")) {
    const match = personaContext.match(/persona type[.:]\s*"([^"]+)"/i);
    if (match && match[1]) {
      personaType = match[1].trim();
      
      // Add persona-specific additions to the response
      if (personaType === "The Entrepreneur") {
        return `I understand you're looking for innovative approaches for ${outletType}. While my advanced analytics are temporarily unavailable, I'd recommend exploring digital marketing strategies and unique customer experiences to drive footfall. Once my systems are fully operational, I can provide more tailored innovation strategies for your business growth needs.`;
      } 
      else if (personaType === "The Deal Maker") {
        return `I see you're focused on optimizing profitability at ${outletType}. While my pricing database is temporarily unavailable, I'd generally recommend reviewing your highest margin products and developing bundle promotions to maximize returns. Once back online, I can provide more specific competitive pricing insights.`;
      }
      else if (personaType === "The Pragmatist") {
        return `For ${outletType}, I understand you prefer reliable, low-risk approaches. While my recommendation engine is temporarily limited, I'd suggest focusing on consistent product quality and staff training on your core offerings. This maintains your standards while minimizing disruption to your existing operations.`;
      }
      else if (personaType === "The Support Seeker") {
        return `I understand you're looking for guidance with ${outletType}. While my consultation database is temporarily limited, I'd recommend reviewing your current best-selling items and building simple promotions around them. Once fully operational, I can provide more comprehensive step-by-step guidance tailored to your specific needs.`;
      }
    }
  }

  // If we couldn't extract specific context, return a random generic response
  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}
