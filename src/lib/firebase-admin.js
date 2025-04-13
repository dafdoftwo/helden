import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// The service account credentials should be stored as environment variables
// in production. For local development, we're using them directly, but this
// should be changed in a production environment.

const serviceAccountKey = {
  "type": "service_account",
  "project_id": "helden-ef55f",
  "private_key_id": "bdc66db78db2637c91b49575401b64bc67497b4c",
  "private_key": process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDe+T2VKPsVvDMD\nZoS271BMIObF+ycbCKj9r7VRTBhfazm47TpEFw0/nWsmnxziO6lGH8jBu/eKbKJ9\nZ0Xnl/jcvBi0fNG4Tu9CEQHKTlpcTdtpGUi5eLsbHss45ie4iug4PT72C3y3S+z5\n5mGI/f3Y6Xhn+C34vIVYSDkk8xJ98RGRb0SdQNAjyGeVtOauxmDZrj82vZN9jYZ0\nEHstiGgq3eKbMZG3P8Hj/pdp0h7XUtKdTtYH/9ZFHu0jeEVyCJ5nerXGb74OWP0G\nOAPlO/JkwF8Y7cKKnDU3tl+9EswoxW6TT6LwwYxCavhYZsA+WyGRCwL1t8LdgQKz\nlcbQyFdhAgMBAAECggEAJPpvSt80wt5HFIuKO391UObM9u0Hx304b3gWKTEmQp7Z\nABEBrnynMxNji5BsPR25XTqUtAJ9E10gVo1Lw9SJjmv4aehgbIFUvx9sbVVwuWml\nF2k8zRuXZjBFcj6DPGD3EaqgmDP//zMNjkU1jD9ZO8G+ePmpAB0dvS4fIgBY4v9K\nT3zFbGfeZ2b7LvINyVs1BmDRkWFJdm+YYrEVyPmKIzrNBrL+tbjNiAjGcuN0dmXL\nHkgJcM2wgzxUiJ4ZrK/AMYwQ0MLHRp+gjOTHiWgEsdUCbdkLCzcLPASXug+AcPxN\neM2L4i5z8xF/2fRwdU1CWx2WjPA+D8DzE+l+d1PrxQKBgQD0O+a5RhOH6p/fN4uV\nKSHCkDyjJgJZWrR+r/oBmFI3uv1c17kj/lF+5zDl7xK/B/HizljeBG1eAYdnqjeY\nob/RynLoga7P4i4LwkroiRycaMEYxRjDYbzNaHxnLvEvivCHlL4NQ1Dh3Ojj23j6\nF0BPMpcQYJ5lXnAmPnJ8BroBBQKBgQDptyNlDjxa6aY/t8upx7YlJdoSZRGsUc0E\nJ82otObJbJY72hHcJ64i70bCkdypNoU9FiqElirwCWTr6oUA59P/vFhRVrAHmGHF\nggGTpQIb8g17tycsJy49vC/y7Bf6bnWTSahc18CdpEMv/nY3mAKxbpUqkC5kkYaf\nR6jkWKu7rQKBgClVFdfW/ykqUMIC8XFd06PMqyZlIVKj4hXqjCHG+GsMDyKuM1vf\nB0W1tHXFPuPrYUkj6LAyCZw2IAcwLFZ9USwc2dN1VvNBcM92oxy1T408wSkC+gze\ntogAncUMka6dEdWwG3W9JawDqboeA1w3oR+GDUCtSUEYeVxPhypsLQBNAoGAOY+2\ncvQvn0B+hqDw0y7xyHJrJC6qTKOU99oJx+xODvvkgHc0AOHw/H+sEM216CMaa7Ii\n5KbLinT12zjWayOtzgWIRvgvwJ8iLW/YjZGNVG6oLXktd61qsR/BO3Y0baR45r60\nbbFhqjHDrnVgjk6tEyAmMuZx1qkU2/PdP+gq270CgYEA3O04u0Vz7C0fXyMGTlEs\n/zJeTfUDU1/Lta2IgPxS8dqeY3HF1ZJhuA1wbnWbnT3Y18U5tMrsPzKRLlF8ITbb\nmZccfI4oD/IVp4z2NNurj0KeaIXCIrkKWKvro1t+2XjDoYBrJT6TiJf5vSjblLM0\nYr4dCz/uH1u5RtAMPMi/MDE=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@helden-ef55f.iam.gserviceaccount.com",
  "client_id": "110930250961271980950",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40helden-ef55f.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialize the admin app
const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert(serviceAccountKey),
    storageBucket: "helden-ef55f.appspot.com"
  });
}

// Export the admin services
export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage(); 