import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, message, url } = await request.json();

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Le titre et le message sont requis.' },
        { status: 400 }
      );
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        target_channel: 'push',
        headings: { fr: title, en: title },
        contents: { fr: message, en: message },
        url: url || 'https://christ-actu.vercel.app',
        included_segments: ['Subscribers'],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur OneSignal REST API:', data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur serveur notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l’envoi de la notification' },
      { status: 500 }
    );
  }
}