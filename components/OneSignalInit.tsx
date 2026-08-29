'use client';

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInit() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !OneSignal.initialized) {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
        allowLocalhostAsSecureOrigin: true,
      }).then(() => {
        OneSignal.Slidedown.promptPush();
      }).catch((err) => console.log('OneSignal init error:', err));
    }
  }, []);

  return null;
}