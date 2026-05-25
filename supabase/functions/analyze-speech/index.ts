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
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Fetch user's API key from database
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('user_api_keys')
      .select('groq_api_key')
      .eq('user_id', userId)
      .single();

    if (apiKeyError || !apiKeyData?.groq_api_key) {
      return new Response(JSON.stringify({ error: "No API key configured. Please add your Groq API key in settings." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqApiKey = apiKeyData.groq_api_key;

    const { transcript, sessionType, topic } = await req.json();

    // Input validation
    if (!transcript || typeof transcript !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid transcript" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (transcript.length > 10000) {
      return new Response(JSON.stringify({ error: "Transcript too long (max 10000 characters)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (topic && topic.length > 200) {
      return new Response(JSON.stringify({ error: "Topic too long (max 200 characters)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedTranscript = transcript.trim();
    const sanitizedTopic = topic?.trim();

    console.log(`Analyzing speech for session type: ${sessionType}, topic: ${sanitizedTopic}`);

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

      case "phonetics":
        systemPrompt = `You are an expert phonetics coach analyzing pronunciation of specific phonemes.
Analyze how well the speaker pronounced the target sounds in their speech.
Provide feedback in JSON format with these fields:
- pronunciation_score (number 1-9, one decimal)
- accuracy_percentage (number 0-100)
- target_sounds_analysis (array of objects with: {sound, attempts, correct, needs_work, tips})
- ai_feedback (detailed phonetics coaching advice focusing on mouth position and articulation)
- strengths (array of 2-3 pronunciation strengths)
- weaknesses (array of 2-3 specific phonetic areas to improve)
- practice_words (array of 5 words to practice the weak sounds)`;
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
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Topic: ${sanitizedTopic || "General"}\n\nTranscript to analyze:\n${sanitizedTranscript}` }
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
    // Log full details server-side; return a generic message to the client.
    console.error("Error in analyze-speech function:", error);
    return new Response(JSON.stringify({ error: "Analysis failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
