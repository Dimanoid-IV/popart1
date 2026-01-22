import { NextRequest, NextResponse } from 'next/server';

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
      "Pastel gradient with soft light",
      "Watercolor washes, light and airy",
      "Abstract brushstrokes",
      "Soft colored mist",
      "Canvas texture with light strokes"
    ];

    // Select 2 random backgrounds
    const selectedBackgrounds = backgroundTypes.sort(() => 0.5 - Math.random()).slice(0, 2);

    const baseUrl = 'https://api.nanobananaapi.ai/api/v1/nanobanana';

    const tasks = await Promise.all(
      selectedBackgrounds.map(async (bg) => {
        const fullPrompt = `${basePrompt} Background: ${bg}. Artistic, masterpiece, high quality.`;
        
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
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate images' }, { status: 500 });
  }
}
