import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = process.env.NANOBANANA_API_KEY;
  if (!token) {
    return NextResponse.json({ error: 'NANOBANANA_API_KEY is missing' }, { status: 500 });
  }

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

    const backgroundTypes = [
      "Pastel gradient with soft light",
      "Watercolor washes, light and airy",
      "Abstract brushstrokes",
      "Soft colored mist",
      "Canvas texture with light strokes"
    ];

    // Select 2 random backgrounds
    const selectedBackgrounds = backgroundTypes.sort(() => 0.5 - Math.random()).slice(0, 2);

    const baseUrl = 'https://api.nanobananaapi.ai/api/v1/nanobanana';

    const results = await Promise.all(
      selectedBackgrounds.map(async (bg) => {
        const fullPrompt = `${basePrompt} Background: ${bg}. Artistic, masterpiece, high quality.`;
        
        // 1. Generate task
        const genRes = await fetch(`${baseUrl}/generate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: fullPrompt,
            type: 'IMAGETOIAMGE',
            numImages: 1,
            imageUrls: [image], // Supports base64 or URL
          })
        });

        const genData = await genRes.json();
        if (genData.code !== 200) {
          throw new Error(genData.msg || 'Generation initiation failed');
        }

        const taskId = genData.data.taskId;

        // 2. Poll for completion
        const startTime = Date.now();
        const maxWaitTime = 60000; // 60 seconds

        while (Date.now() - startTime < maxWaitTime) {
          const statusRes = await fetch(`${baseUrl}/record-info?taskId=${taskId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const statusData = await statusRes.json();

          if (statusData.successFlag === 1) {
             return statusData.response.resultImageUrl;
          } else if (statusData.successFlag === 2 || statusData.successFlag === 3) {
             throw new Error(statusData.errorMessage || 'Generation failed');
          }

          await new Promise(r => setTimeout(r, 3000));
        }
        throw new Error('Timeout waiting for AI results');
      })
    );

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate images' }, { status: 500 });
  }
}
