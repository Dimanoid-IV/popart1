import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: NextRequest) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const basePrompt = `Digital painting portrait. Exact likeness and anatomy preserved. 
    Smooth painterly skin, no pores, soft volume. 
    Expressive artistic eyes, saturated iris, soft painted highlights. 
    Painterly hair shapes, simplified clothing with brushstroke effects. 
    Soft glowing outlines.`;

    const negativePrompt = "photorealism, sharp background, detailed scenery, city, room, nature details, hard edges, anime, cartoon, plastic skin, hyper-realistic eyes";

    const backgroundTypes = [
      "Pastel gradient with soft light",
      "Watercolor washes, light and airy",
      "Abstract brushstrokes",
      "Soft colored mist",
      "Canvas texture with light strokes"
    ];

    // Select 2 random backgrounds
    const selectedBackgrounds = backgroundTypes.sort(() => 0.5 - Math.random()).slice(0, 2);

    const predictions = await Promise.all(
      selectedBackgrounds.map(async (bg) => {
        // Using SDXL with image-to-image or a similar model
        // For simplicity and quality, we can use stability-ai/sdxl
        return replicate.run(
          "stability-ai/sdxl:7762fd89782c3516513a0a5d562a608103c624d67876a307047743d50893112c",
          {
            input: {
              prompt: `${basePrompt} Background: ${bg}. Artistic, masterpiece, high quality.`,
              negative_prompt: negativePrompt,
              image: image, // Base64 or URL
              prompt_strength: 0.65, // Adjust to keep likeness but allow style change
              num_inference_steps: 50,
            }
          }
        );
      })
    );

    return NextResponse.json({ results: predictions });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate images' }, { status: 500 });
  }
}
