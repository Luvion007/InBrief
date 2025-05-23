import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import {  StoreNewsDataCategory } from "@/components/storenewsdata";

function initFirebase() {
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(
      Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "",
        "base64"
      ).toString("utf-8")
    );

    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return { auth: getAuth(), db: getFirestore() };
}

interface CategoryPreference {
  id: string;
  categoryNewsId: string;
  name: string;
  includeKeyword: string[];
  excludeKeyword: string[];
  source: string[];
}

export default async function Page({ params }: { params: { id: string } }) {
  const { db } = initFirebase();
  const categoryNewsId = params?.id;
  const API_KEY = process.env.NEWS_API_KEY || "";
  let data: any = null;
  let loading = true;
  let error = null;
  let collectedCategoryName = null

  const storedNewsSnapshot = await db
    .collection("categoryNews")
    .where("categoryNewsId", "==", categoryNewsId)
    .get();

  if (!storedNewsSnapshot.empty) {
    const firstDoc = storedNewsSnapshot.docs[0];
    data = firstDoc ? firstDoc.data() : null;
    
    data = JSON.parse(JSON.stringify(data));
    loading = false;
    console.log("storing old data")
  } else {
    const newsSnapshot = await db
      .collection("categoryPreferences")
      .where("categoryNewsId", "==", categoryNewsId)
      .get();

      console.log("storing new data")

    if (!newsSnapshot.empty) {
      const categoryPreferences: CategoryPreference[] = newsSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<CategoryPreference, "id">),
        })
      );

      if (categoryPreferences.length > 0) {
        const pref = categoryPreferences[0];
        let queryString = "";
        const positiveKeywords = pref.includeKeyword.length > 0 ? pref.includeKeyword.join(" OR ") : "the";
        const negativeKeywords = pref.excludeKeyword
          .map((kw) => `-${kw}`)
          .join(" ");

        if (positiveKeywords || negativeKeywords) {
          queryString = `&q=${[positiveKeywords, negativeKeywords]
            .filter((kw) => kw.trim() !== "")
            .join(" ")}`;
        }

        const sourcesParam =
          pref.source.length > 0 ? `&sources=${pref.source.join(",")}` : "";

        let categoryName = pref.name; 

        const URL = `https://newsapi.org/v2/everything?language=en${queryString}${sourcesParam}&pageSize=10&apiKey=${API_KEY}`;

        try {
          const response = await fetch(URL);
          const result = await response.json();

          if (result.status === "ok" && result.articles.length > 0) {
            data = result;
            loading = false;
            collectedCategoryName = categoryName;
          } else {
            error = "No articles found with the current keywords or sources.";
            loading = false;
          }
        } catch (fetchError) {
          error = "Error fetching data from NewsAPI.";
          loading = false;
        }
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {loading ? (
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <StoreNewsDataCategory
          newsData={data}
          collectionName="categoryNews"
          categoryNewsId={categoryNewsId}
          redirectTo={`/category/${categoryNewsId}`}
          categoryName={collectedCategoryName || ""} // Pass the collected category name
        />
      )}
    </div>
  );
}

