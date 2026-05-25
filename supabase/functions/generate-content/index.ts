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

    const { type, topic, level, userHistory } = await req.json();

    // Input validation
    if (topic && topic.length > 200) {
      return new Response(JSON.stringify({ error: "Topic too long (max 200 characters)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedTopic = topic?.trim();

    console.log(`Generating content: type=${type}, level=${level}`);

    let systemPrompt = "";
    let userPrompt = "";
    
    switch (type) {
      case "cue_card":
        systemPrompt = `You are an IELTS content generator. Generate a Part 2 Cue Card topic suitable for band ${level || 7} practice.`;
        userPrompt = `Generate a cue card topic in JSON format:
{
  "topic": "Main topic description",
  "points": ["Point 1 to address", "Point 2 to address", "Point 3 to address", "Explain why..."],
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
}`;
        break;
      
      case "discussion":
        systemPrompt = `You are an IELTS examiner generating Part 3 discussion questions. Create thought-provoking abstract questions suitable for band ${level || 7}+ candidates.`;
        userPrompt = `Generate 3 Part 3 discussion questions about "${sanitizedTopic || "society and technology"}" in JSON format:
{
  "questions": [
    {"question": "...", "complexity": "moderate/high/very high", "hint": "Consider discussing..."}
  ]
}`;
        break;
      
      case "read_aloud":
        systemPrompt = `You are creating reading passages for pronunciation practice. Generate academic-style passages with challenging phonetic combinations.`;
        userPrompt = `Generate a reading passage (80-100 words) suitable for pronunciation practice at band ${level || 7} level. Include challenging sounds like 'th', 'r', 'l', consonant clusters. Return JSON:
{
  "passage": "The full passage text...",
  "difficult_words": ["word1", "word2", "word3"],
  "phonetic_focus": ["th sounds", "word stress", etc]
}`;
        break;

      case "phonetics":
        systemPrompt = `You are an expert phonetics teacher creating pronunciation drills for specific English phonemes.`;
        userPrompt = `Generate a phonetics practice exercise for the phoneme/sound: "${sanitizedTopic}". Return JSON:
{
  "phoneme": "${sanitizedTopic}",
  "ipa_symbol": "The IPA symbol for this sound",
  "description": "Brief description of how to produce this sound (mouth position, tongue placement)",
  "minimal_pairs": [{"word1": "...", "word2": "..."}, ...],
  "practice_words": ["word1", "word2", "word3", "word4", "word5"],
  "practice_sentences": ["Sentence 1 with multiple instances of the sound", "Sentence 2", "Sentence 3"],
  "common_mistakes": ["mistake1", "mistake2"],
  "tips": ["tip1", "tip2", "tip3"]
}`;
        break;
      
      case "idiom":
        systemPrompt = `You are an English language expert teaching academic idioms and expressions suitable for IELTS speaking.`;
        userPrompt = `Generate 3 useful academic idioms or expressions with examples. Return JSON:
{
  "idioms": [
    {
      "expression": "The idiom/expression",
      "meaning": "What it means",
      "example": "Example sentence using it naturally",
      "context": "When to use this expression"
    }
  ]
}`;
        break;
      
      case "lesson":
        systemPrompt = `You are an expert IELTS tutor creating personalized lesson content. ${userHistory ? `The student's history shows: ${JSON.stringify(userHistory)}` : ''}`;
        userPrompt = `Create a lesson about "${sanitizedTopic}" for a student at band ${level || 6} level. Return JSON:
{
  "title": "Lesson title",
  "key_concepts": ["concept1", "concept2", "concept3"],
  "examples": ["example1", "example2"],
  "practice_prompt": "A prompt for the student to practice",
  "tips": ["tip1", "tip2"]
}`;
        break;
      
      case "personalized_plan":
        systemPrompt = `You are an IELTS coach analyzing student performance to create personalized training recommendations.`;
        userPrompt = `Based on this student history: ${JSON.stringify(userHistory || {})}, create a personalized practice plan. Return JSON:
{
  "focus_areas": ["area1", "area2"],
  "recommended_exercises": [{"type": "...", "reason": "..."}],
  "vocabulary_to_learn": ["word1", "word2"],
  "daily_goal": "...",
  "motivation": "Encouraging message..."
}`;
        break;
      
      default:
        throw new Error(`Unknown content type: ${type}`);
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
          { role: "user", content: userPrompt }
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
    const content = data.choices[0].message.content;
    
    console.log("Content generated successfully");
    
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { content };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    // Log full details server-side; return a generic message to the client.
    console.error("Error in generate-content function:", error);
    return new Response(JSON.stringify({ error: "Content generation failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
