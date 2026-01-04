import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, sessionType, topic, userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client to fetch user's API key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's Groq API key
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("user_api_keys")
      .select("groq_api_key")
      .eq("user_id", userId)
      .maybeSingle();

    if (apiKeyError || !apiKeyData?.groq_api_key) {
      console.error("API key fetch error:", apiKeyError);
      return new Response(JSON.stringify({ error: "No Groq API key configured. Please add your API key in settings." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GROQ_API_KEY = apiKeyData.groq_api_key;

    console.log(`Analyzing speech for session type: ${sessionType}, topic: ${topic}`);

    let systemPrompt = "";
    
    switch (sessionType) {
      case "cue_card":
        systemPrompt = `You are an expert IELTS speaking examiner analyzing a Part 2 (Cue Card) response. 
Analyze the transcript and provide detailed feedback in JSON format with these fields:
- fluency_score (number 1-9, one decimal)
- lexical_score (number 1-9, one decimal)
- grammar_score (number 1-9, one decimal)  
- pronunciation_score (number 1-9, one decimal)
- overall_band (number 1-9, one decimal - average of all scores)
- strengths (array of 2-3 specific strengths)
- weaknesses (array of 2-3 specific areas to improve)
- ai_feedback (detailed paragraph of constructive feedback)
- optimized_response (a band 9 version of their response, keeping their ideas but improving language)
- vocabulary_learned (array of 3-5 advanced vocabulary words they could use)`;
        break;
      
      case "discussion":
        systemPrompt = `You are an expert IELTS speaking examiner analyzing a Part 3 (Discussion) response.
Focus on evaluating reasoning depth, argument sophistication, and abstract thinking.
Analyze the transcript and provide detailed feedback in JSON format with these fields:
- fluency_score (number 1-9, one decimal)
- lexical_score (number 1-9, one decimal)
- grammar_score (number 1-9, one decimal)
- pronunciation_score (number 1-9, one decimal)
- overall_band (number 1-9, one decimal)
- strengths (array of 2-3 specific strengths in reasoning and argumentation)
- weaknesses (array of 2-3 areas where reasoning could be deeper)
- ai_feedback (detailed paragraph focusing on reasoning quality and sophistication)
- optimized_response (a band 9 version showing sophisticated academic reasoning)
- vocabulary_learned (array of 5 advanced academic vocabulary/phrases they should use)`;
        break;
      
      case "read_aloud":
        systemPrompt = `You are an expert pronunciation coach analyzing a read-aloud exercise.
Compare the spoken transcript against what was expected and identify pronunciation errors.
Provide feedback in JSON format with these fields:
- pronunciation_score (number 1-9, one decimal)
- accuracy_percentage (number 0-100)
- mispronounced_words (array of objects with: {word, issue, correction})
- ai_feedback (detailed pronunciation coaching advice)
- strengths (array of 2-3 pronunciation strengths)
- weaknesses (array of 2-3 pronunciation areas to improve)`;
        break;
      
      case "mock_exam":
        systemPrompt = `You are an IELTS speaking examiner providing feedback on a full mock exam.
Analyze the complete speaking test performance and provide comprehensive feedback in JSON format:
- fluency_score (number 1-9, one decimal)
- lexical_score (number 1-9, one decimal)
- grammar_score (number 1-9, one decimal)
- pronunciation_score (number 1-9, one decimal)
- overall_band (number 1-9, one decimal)
- strengths (array of 3-4 specific strengths across all parts)
- weaknesses (array of 3-4 areas for improvement)
- ai_feedback (comprehensive paragraph covering all aspects of the test)
- optimized_response (key phrases they could have used better)
- vocabulary_learned (array of 5-7 vocabulary items to add to their repertoire)`;
        break;
      
      default:
        systemPrompt = `You are an IELTS speaking expert. Analyze this speaking sample and provide feedback in JSON format:
- fluency_score, lexical_score, grammar_score, pronunciation_score, overall_band (all numbers 1-9)
- strengths, weaknesses (arrays of strings)
- ai_feedback (detailed feedback paragraph)
- vocabulary_learned (array of useful vocabulary)`;
    }

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Topic: ${topic || "General"}\n\nTranscript to analyze:\n${transcript}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      
      if (response.status === 401) {
        return new Response(JSON.stringify({ error: "Invalid Groq API key. Please update your API key in settings." }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisContent = data.choices[0].message.content;
    
    console.log("Analysis completed successfully");
    
    let analysis;
    try {
      analysis = JSON.parse(analysisContent);
    } catch {
      analysis = { ai_feedback: analysisContent, overall_band: 6.5 };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-speech function:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
