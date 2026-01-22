import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'REPLICATE_API_TOKEN is missing' }, { status: 500 });
  }

  const replicate = new Replicate({
    auth: token,
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
          "stability-ai/sdxl:da77452306f715723660619c56145a551366140ad9d576b95110da480f6ad680",
          {
            input: {
              prompt: `${basePrompt} Background: ${bg}. Artistic, masterpiece, high quality.`,
              negative_prompt: negativePrompt,
              image: image,
              prompt_strength: 0.7,
              num_inference_steps: 50,
              refine: "expert_ensemble_refiner",
              apply_watermark: false,
              high_noise_frac: 0.8,
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
