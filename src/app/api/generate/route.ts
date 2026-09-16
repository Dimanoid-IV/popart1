import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/errors';
import { selectBackgroundPair, selectBackgrounds } from '@/lib/background-options';
import { consumeGenerationCredit, getVisitorIdentity, refundGenerationCredit, VISITOR_COOKIE } from '@/lib/generation-credit-store';
import { registerPortraitTask } from '@/lib/portrait-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = process.env.NANOBANANA_API_KEY;
  if (!token) {
    return NextResponse.json({ error: 'NANOBANANA_API_KEY is missing' }, { status: 500 });
  }

  let reservation: Awaited<ReturnType<typeof consumeGenerationCredit>> | null = null;
  let identity: Awaited<ReturnType<typeof getVisitorIdentity>> | null = null;
  try {
    const { image, backgroundColor, backgroundColors } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    identity = await getVisitorIdentity();
    reservation = await consumeGenerationCredit(identity.visitorId, identity.ipHash);
    if (!reservation.allowed) {
      const response = NextResponse.json({ error: 'GENERATION_LIMIT_REACHED', credits: reservation }, { status: 429 });
      if (identity.isNew) response.cookies.set(VISITOR_COOKIE, identity.visitorId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 365 * 24 * 60 * 60, path: '/' });
      return response;
    }

    const basePrompt = `Professional digital art portrait in a beautiful painterly style. 
    Artistic rendering with smooth brushstrokes, soft volume, and elegant lighting. 
    Expressive artistic eyes, simplified clothing with painterly textures. 
    A masterpiece of digital painting. Avoid photorealism.`;

    const selectedBackgrounds = Array.isArray(backgroundColors)
      ? selectBackgroundPair(backgroundColors)
      : selectBackgrounds(backgroundColor);

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

    await Promise.all(tasks.map((taskId) => registerPortraitTask(taskId, identity!.visitorId)));
    const response = NextResponse.json({ taskIds: tasks, credits: reservation });
    if (identity.isNew) response.cookies.set(VISITOR_COOKIE, identity.visitorId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 365 * 24 * 60 * 60, path: '/' });
    return response;
  } catch (error: unknown) {
    if (reservation?.allowed && reservation.source && identity) {
      try { await refundGenerationCredit(identity.visitorId, identity.ipHash, reservation.source); } catch (refundError) { console.error('Credit refund failed:', refundError); }
    }
    console.error('Generation Error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to generate images') },
      { status: 500 }
    );
  }
}
