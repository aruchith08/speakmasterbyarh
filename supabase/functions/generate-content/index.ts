import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, topic, level, userHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
        userPrompt = `Generate 3 Part 3 discussion questions about "${topic || "society and technology"}" in JSON format:
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
        systemPrompt = `You are an expert IELTS tutor creating personalized lesson content. ${userHistory ? `The student's history shows: ${userHistory}` : ''}`;
        userPrompt = `Create a lesson about "${topic}" for a student at band ${level || 6} level. Return JSON:
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
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
    console.error("Error in generate-content function:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
