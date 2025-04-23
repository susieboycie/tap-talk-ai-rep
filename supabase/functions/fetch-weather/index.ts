
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeatherResponse {
  main: {
    temp_max: number;
    temp_min: number;
  };
  weather: Array<{
    description: string;
  }>;
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { outlet, date, city = 'Dublin,IE' } = await req.json()
    
    if (!outlet || !date) {
      throw new Error('Outlet and date are required')
    }

    const weatherApiKey = Deno.env.get('OPENWEATHER_API_KEY')
    if (!weatherApiKey) {
      throw new Error('Weather API key not configured')
    }

    // Fetch weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
    )

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const weatherData: WeatherResponse = await weatherResponse.json()

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Store weather data
    const { error } = await supabase
      .from('daily_weather')
      .upsert({
        date,
        outlet_name: outlet,
        temperature_max: weatherData.main.temp_max,
        temperature_min: weatherData.main.temp_min,
        precipitation: weatherData.rain?.["1h"] || weatherData.rain?.["3h"] || 0,
        description: weatherData.weather[0]?.description || ''
      })

    if (error) {
      throw error
    }

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
