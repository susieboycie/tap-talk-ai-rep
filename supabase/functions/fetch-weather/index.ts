
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
    
    console.log(`Weather API called for outlet: ${outlet}, date: ${date}, city: ${city}`);
    
    if (!outlet || !date) {
      throw new Error('Outlet and date are required')
    }

    const weatherApiKey = Deno.env.get('OPENWEATHER_API_KEY')
    if (!weatherApiKey) {
      throw new Error('Weather API key not configured')
    }

    console.log("Fetching weather data from OpenWeatherMap API...");
    
    // Fetch weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
    )

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error("OpenWeatherMap API error:", errorText);
      throw new Error(`Failed to fetch weather data: ${weatherResponse.status} ${errorText}`)
    }

    const weatherData: WeatherResponse = await weatherResponse.json()
    console.log("Weather data received:", JSON.stringify(weatherData));

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse weather data
    const weatherRecord = {
      date,
      outlet_name: outlet,
      temperature_max: weatherData.main.temp_max,
      temperature_min: weatherData.main.temp_min,
      precipitation: weatherData.rain?.["1h"] || weatherData.rain?.["3h"] || 0,
      description: weatherData.weather[0]?.description || ''
    };
    
    console.log("Storing weather data:", JSON.stringify(weatherRecord));
    
    // Store weather data
    const { error } = await supabase
      .from('daily_weather')
      .upsert(weatherRecord)

    if (error) {
      console.error("Error storing weather data:", error);
      throw error
    }

    console.log("Successfully stored weather data");
    
    return new Response(JSON.stringify(weatherRecord), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("Error in weather function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
