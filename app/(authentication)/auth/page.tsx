'use client';
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { firebaseAuth, firestoreDb} from "../../firebase/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function Page() {
  const { userId, isLoaded, getToken } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const [signInError, setSignInError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const [isSignedInFirebase, setIsSignedInFirebase] = useState<any>(null)

  // Firebase Sign In Effect
  useEffect(() => {
    const handleSignInSuccess = async () => {
      try {
        // Safely extract email and username
        const Email = user?.primaryEmailAddress?.emailAddress || "";
        const Username =
          user?.username || user?.firstName || user?.id || "Anonymous";

        // Sign in with Firebase
        const token = await getToken({ template: "integration_firebase" });

        const userCredentials = await signInWithCustomToken(firebaseAuth, token || "");
        setIsSignedInFirebase(userCredentials.user.uid);

        console.log("User signed in with Firebase", userCredentials);

        // Create user document if not signed up yet
        const userDocRef = doc(firestoreDb, "users", userCredentials.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: userCredentials.user.uid,
            email: Email,
            name: Username,
            role: "free-tier",
            createdAt: serverTimestamp(),
          });
          console.log("User document created in Firestore");
        }
      } catch (err) {
        console.error("Firebase sign-in error:", err);
        setSignInError("Failed to sign in with Firebase. Please try again.");
      }
    };

    if (isSignedIn) {
      handleSignInSuccess();
    }
  }, [isSignedIn, user]);

  // Firebase Sign Out Effect
  useEffect(() => {
    const handleSignOutSuccess = async () => {
      try {
        await signOut(firebaseAuth);
        console.log("User signed out from Firebase");
      } catch (err) {
        console.error("Firebase sign-out error:", err);
        setSignInError("Failed to sign out from Firebase. Please try again.");
      }
    };

    if (!isSignedIn) {
      handleSignOutSuccess();
    }
  }, [isSignedIn]);

  // Routing Effect
  useEffect(() => {
    if (isLoaded) {
      if (!userId) {
        router.push("/home");
      } else if (isSignedInFirebase) {
        router.push("/news");
      }
    }
  }, [userId, isLoaded, isSignedInFirebase, router]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Error handling
  if (signInError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          {signInError}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-900">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4 animate-pulse">
          Redirecting...
        </h1>
        <p className="text-lg text-white">
          Please wait while we take you to your destination.
        </p>
      </div>
    </div>
  );
}
