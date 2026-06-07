import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBY6JA639q-6evNusT-RD63Dluk6c2qvA",
  authDomain: "almhwarpress.firebaseapp.com",
  projectId: "almhwarpress",
  storageBucket: "almhwarpress.firebasestorage.app",
  messagingSenderId: "702920706800",
  appId: "1:702920706800:web:f3b073be23fdbe166d5035",
  measurementId: "",
};

let app: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  return app;
}

let firestoreInstance: Firestore | null = null;

export function getDb(): Firestore | null {
  if (typeof window === "undefined") return null;
  if (firestoreInstance) return firestoreInstance;
  const a = getFirebaseApp();
  if (!a) return null;
  firestoreInstance = getFirestore(a);
  return firestoreInstance;
}

export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;
  try {
    const supported = await isSupported();
    if (!supported) return null;
    const a = getFirebaseApp();
    if (!a) return null;
    analyticsInstance = getAnalytics(a);
    return analyticsInstance;
  } catch (err) {
    console.warn("Firebase Analytics init failed", err);
    return null;
  }
}

export async function logAnalyticsEvent(
  name: string,
  params?: Record<string, unknown>,
) {
  const a = await getAnalyticsInstance();
  if (!a) return;
  try {
    logEvent(a, name as string, params as Record<string, unknown>);
  } catch (err) {
    console.warn("logEvent failed", err);
  }
}