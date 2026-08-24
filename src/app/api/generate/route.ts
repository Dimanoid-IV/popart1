import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/errors';

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

    const basePrompt = `Professional digital art portrait in a beautiful painterly style. 
    Artistic rendering with smooth brushstrokes, soft volume, and elegant lighting. 
    Expressive artistic eyes, simplified clothing with painterly textures. 
    A masterpiece of digital painting. Avoid photorealism.`;

    const backgroundTypes = [
      "Dream-art inspired layered background in deep turquoise, indigo and violet: luminous watercolor clouds, energetic paint splashes, fine ink lines, subtle bokeh particles and a soft radiant glow behind the subject; rich depth, brighter near the face and darker toward the edges",
      "Dream-art inspired layered background in magenta, lavender and electric blue: translucent watercolor blooms, expressive acrylic splatters, delicate flowing light trails, tiny glowing particles and soft atmospheric haze; vivid but harmonious, with clear separation around the subject",
      "Dream-art inspired layered background in teal, aqua and cool silver: abstract painted textures, dynamic white paint droplets, elegant curved linework, soft mist and scattered points of light; cinematic depth with a gentle central glow",
      "Dream-art inspired layered background in coral, rose, purple and warm gold: watercolor washes, sweeping brush textures, controlled paint splashes, subtle sparkling dust and diffused light; dreamy, elegant and premium rather than childish",
      "Dream-art inspired layered background in sapphire blue, violet and white: dramatic grunge texture softened by watercolor, radial light accents, floating bokeh, fine ornamental strokes and crisp paint splashes; balanced negative space around the head and shoulders"
    ];

    // Select 2 random backgrounds
    const selectedBackgrounds = backgroundTypes.sort(() => 0.5 - Math.random()).slice(0, 2);

    const baseUrl = 'https://api.nanobananaapi.ai/api/v1/nanobanana';

    const tasks = await Promise.all(
      selectedBackgrounds.map(async (bg) => {
        const fullPrompt = `${basePrompt} Background only: ${bg}. Keep the person exactly as rendered by the portrait treatment: do not change the face, identity, expression, pose, body, hair, clothing, hands, proportions, or skin tone. Apply all splashes, particles, lines, mist, and light effects behind and around the silhouette, never across the eyes or central facial features. Create a cohesive premium Dream Art canvas composition with no scenery, objects, text, frames, borders, logos, or watermark. Artistic, masterpiece, high quality.`;
        
        let processedImage = image;
        
        // ImgBB Upload (Optional but recommended if base64 fails)
        const imgbbKey = process.env.IMGBB_API_KEY;
        if (imgbbKey && image.startsWith('data:')) {
           try {
             const base64Data = image.split(',')[1];
             const formData = new FormData();
             formData.append('image', base64Data);
             const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
               method: 'POST',
               body: formData
             });
             const imgbbData = await imgbbRes.json();
             if (imgbbData.success) {
               processedImage = imgbbData.data.url;
             }
           } catch (e) {
             console.error('ImgBB Upload failed:', e);
           }
        }

        // Generate task
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
            imageUrls: [processedImage],
            image_size: "2:3",
            callBackUrl: `${req.nextUrl.origin}/api/webhooks/dummy` 
          })
        });

        const genData = await genRes.json();
        if (genRes.status !== 200 || genData.code !== 200) {
          console.error('NanoBanana API Error Details:', JSON.stringify(genData, null, 2));
          throw new Error(genData.msg || `Generation initiation failed (Status ${genRes.status})`);
        }

        return genData.data.taskId;
      })
    );

    return NextResponse.json({ taskIds: tasks });
  } catch (error: unknown) {
    console.error('Generation Error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to generate images') },
      { status: 500 }
    );
  }
}
