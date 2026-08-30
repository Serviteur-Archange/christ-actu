'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EventItem {
  id: string;
  title: string;
  date_event: string;
  location: string;
  type: string;
  image_url: string;
  link_url?: string;
}

export default function AuProgramme() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      if (data) setEvents(data);
    }
    fetchEvents();
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h2 className="text-lg font-black text-gray-900 uppercase">Au Programme</h2>
        <span className="w-2 h-2 rounded-full bg-red-600"></span>
      </div>

      <div className="space-y-4">
        {events.map((evt) => (
          <div key={evt.id} className="flex gap-3 items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            {evt.image_url && (
              <img src={evt.image_url} alt={evt.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded">
                {evt.type}
              </span>
              <h3 className="text-xs font-bold text-gray-900 leading-snug">{evt.title}</h3>
              <p className="text-[11px] text-gray-500 font-medium">📅 {evt.date_event} | 📍 {evt.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}