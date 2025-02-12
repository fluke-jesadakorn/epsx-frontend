import * as admin from 'firebase-admin';

// Check if Firebase Admin has already been initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Convert the private key string to proper format
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    
    // TODO: Future features
    // - Add Firebase Authentication integration for user management
    // - Implement Firestore database connection for data persistence
    // - Set up Firebase Storage for file uploads
    // - Configure Firebase Cloud Messaging for notifications
    // - Add Firebase Functions integration for serverless backend logic
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

// Export the admin instance
export const firebaseAdmin = admin;

// Export commonly used services
export const auth = admin.auth();
export const firestore = admin.firestore();
export const storage = admin.storage();
