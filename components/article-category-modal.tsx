"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ThumbsUp, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tab";
import { firestoreDb } from "@/app/firebase/firebase";
import {
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "@clerk/nextjs";
import { getFireStoreDataCategory } from "@/app/firebase/(hooks)/getFirestoreSnapshot";
import { CheckCircle } from "lucide-react";
import { AddFireStoreData } from "@/app/firebase/(hooks)/addFireStoreData";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";

interface ArticleCategoryModalProps {
  article: {
    id: string;
    arrayIndex: number;
    title: string;
    timePosted: string;
    readTime: string;
    source: string;
    sourceUrl: string;
    image: string;
    content: string;
    preview: string;
    summary: string;
    like: number;
    readStatus: boolean;
    comments: string;
    tags: { label: string; color: string }[];
    openAiCollectionName: string;
  } | null;
  isOpen: boolean;
  collectionName: string;
  categoryNewsId: string;
  onClose: () => void;
}

export default function ArticleCategoryModal({
  article,
  isOpen,
  onClose,
  collectionName,
  categoryNewsId,
}: ArticleCategoryModalProps) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const { userId } = useAuth();
  const { data, id } = getFireStoreDataCategory("categoryNews", categoryNewsId);

  //add Bookmark
  const { addDataBookMark } = AddFireStoreData("bookmarks");
  const [bookmarkAlert, setBookmarkAlert] = useState(false);
  const clerkId = userId || "";

  const handleBookmark = async (article: any) => {
    try {
      if (!article || !clerkId) {
        console.error("Invalid article or user ID");
        return;
      }

      // Prepare the bookmark document with all fields from your Firebase structure
      const bookmarkDocument = {
        arrayIndex: article.arrayIndex || 0, // Default to 0 if not provided
        content: article.content || '',
        id: article.id || '',
        image: article.image || '',
        like: article.like || 0,
        likesBy: article.likesBy || null,
        openAiCollectionName: article.openAiCollectionName || '',
        preview: article.preview || '',
        readStatus: article.readStatus || false,
        readTime: article.readTime || 'Unavailable',
        source: article.source || '',
        sourceUrl: article.sourceUrl || '',
        summary: article.summary || null,
        timePosted: article.timePosted || new Date().toLocaleString(),
        title: article.title || 'Untitled Article',
      };
  
      console.log("Bookmarking article:", bookmarkDocument);
  
      await addDataBookMark(bookmarkDocument, clerkId);

      setBookmarkAlert(true);
      setTimeout(() => setBookmarkAlert(false), 1500);

      console.log("Article bookmarked successfully");
    } catch (error) {
      console.error("Error bookmarking article:", error);
    }
  };

  //get current like
  const [liveArticles, setLiveArticles] = useState<any>(null);

  useEffect(() => {
    if (!data) return;

    console.log("Raw Firestore data:", data);

    if (data.docData && Array.isArray(data.docData.articles)) {
      setLiveArticles(data.docData.articles);
      console.log("Articles set successfully:", data.docData.articles);
    } else {
      console.log("No articles found in the data structure");
    }
  }, [data]);

  //get scrape content
  const [scrapedArticle, setScrapeArticle] = useState<any>(null);

  useEffect(() => {
    const getScrapedArticle = async (article: any) => {
      if (!article?.source) return; // Skip if no article or source

      try {
        const scrapeResponse = await fetch(
          `/api/scrape-news?link=${encodeURIComponent(article.source)}`,
          { method: "GET" }
        );

        if (!scrapeResponse.ok) {
          throw new Error(
            `Failed to fetch article: ${scrapeResponse.statusText}`
          );
        }

        const scrapeData = await scrapeResponse.json();
        setScrapeArticle(scrapeData.textContent); // Update state
      } catch (error) {
        console.error("Error scraping article:", error);
      }
    };

    if (article) {
      getScrapedArticle(article); // Trigger scrape when modal opens
    }
  }, [article]); // Run only when `article` changes

    //get reading speed
    const [readingSpeed, setReadingSpeed] = useState<number>(250);
    const [readTime, setReadTime] = useState<String>("");
    const [isCalculating, setIsCalculating] = useState(false);
  
    useEffect(() => {
      const fetchReadingSpeed = async () => {
        const docRef = doc(firestoreDb, "userReading", clerkId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data()?.readingSpeed || 250; // Fallback to 250 WPM
        }
        return 250;
      };
  
      const calculateReadTime = async () => {
        if (!scrapedArticle || !clerkId) return;
        setIsCalculating(true);
        setReadTime("");
  
        try {
          // 1. Get fresh reading speed (avoid stale closures)
          const currentSpeed = await fetchReadingSpeed();
          setReadingSpeed(currentSpeed); // Update state if needed
  
          // 2. Calculate time
          const wordCount = scrapedArticle.trim().split(/\s+/).length;
          const totalSeconds = Math.ceil((wordCount / currentSpeed) * 60);
  
          // 3. Format (show only minutes if >1min, else seconds)
          let formattedTime;
          if (totalSeconds >= 60) {
            const minutes = Math.floor(totalSeconds / 60);
            formattedTime = `${minutes} min read`;
          } else {
            formattedTime = `${totalSeconds} sec read`;
          }
  
          setReadTime(formattedTime);
        } catch (error) {
          console.error("Error calculating read time:", error);
          setReadTime("Unknown");
        } finally {
          setIsCalculating(false);
        }
      };
  
      calculateReadTime();
    }, [clerkId, scrapedArticle, readingSpeed]);

  async function handleLike(index: number, collectionName: string) {
    try {
      if (!article?.id) {
        console.error("Article ID is undefined!");
        return;
      }

      const docRef = doc(firestoreDb, collectionName, article.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error("Document not found!");
        return;
      }

      let docData = docSnap.data() as { [key: string]: any }; // Replace with actual type if known
      let articles = docData.articles || []; // Ensure it's an array

      if (article.arrayIndex < 0 || article.arrayIndex >= articles.length) {
        console.error(`Index ${index} is out of bounds.`);
        return;
      }

      if (articles[article.arrayIndex] === undefined) {
        console.log(`No article found at index ${article.arrayIndex}.`);
        return;
      }

      // Handle like/unlike
      const articleToUpdate = articles[article.arrayIndex];

      if (
        !articleToUpdate.likesBy ||
        !articleToUpdate.likesBy.includes(userId)
      ) {
        articleToUpdate.likesBy = articleToUpdate.likesBy
          ? [...articleToUpdate.likesBy, userId]
          : [userId];
        articleToUpdate.like = (articleToUpdate.like || 0) + 1;
      } else {
        articleToUpdate.likesBy = articleToUpdate.likesBy.filter(
          (id: string) => id !== userId
        );
        articleToUpdate.like = Math.max((articleToUpdate.like || 0) - 1, 0);
      }

      articles[article.arrayIndex] = articleToUpdate;

      await updateDoc(docRef, { articles });

      console.log(`Like status updated for article at index ${index}.`);
    } catch (error) {
      console.error("Error handling like operation:", error);
    }
  }

  const handleShare = (articleSource: string) => {
    const website = window.location.origin; // Gets the base URL dynamically
    const link = articleSource;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        console.log("Link copied to clipboard:", link);
        setAlert(true);
        setTimeout(() => setAlert(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy link to clipboard:", err);
      });
  };

  //Scraping content
  async function sendScrapeRequest(index: number, collectionName: string) {
    if (!article?.source) {
      console.error("No article URL available to scrape.");
      return;
    }

    //Referencing the database
    const docRef = doc(firestoreDb, collectionName, article.id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("Document not found!");
      return;
    }
    let docData = docSnap.data() as { [key: string]: any }; // Replace with the actual type if known
    let articles = docData.articles || []; // Ensure it's an array

    // Check if the index is valid
    if (article.arrayIndex < 0 || article.arrayIndex >= articles.length) {
      console.error(`Index ${index} is out of bounds.`);
      return;
    }

    // Check if the value exists at that index
    if (articles[article.arrayIndex] === undefined) {
      console.log(`No article found at index ${article.arrayIndex}.`);
      return;
    }

    if (!articles[article.arrayIndex].summary) {
      setLoading(true);

      try {
      
        const summarizedContent = await fetch("/api/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: scrapedArticle || "Don't have content",
          }),
        }).then((res) => res.json());

        articles[article.arrayIndex] = {
          ...articles[article.arrayIndex],
          summary: summarizedContent.message,
        };

        await updateDoc(docRef, { articles });

        console.log(
          `Article at index ${article.arrayIndex} updated successfully!`
        );
        setResponse(summarizedContent.message);
      } catch (error) {
        setResponse("Summarization is not available for this article");
      } finally {
        setLoading(false);
      }
    }
  }


  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl h-full overflow-auto animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">View Article</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{article.title}</h1>
            <div className="flex gap-2 ml-2 flex-shrink-0">
              {/* <Button variant="ghost" size="icon" onClick={() => {console.log(article.arrayIndex)}}>test index</Button>
              <Button variant="ghost" size="icon" onClick={() => {console.log(article.id)}}>test article id</Button> */}

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleBookmark(article)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Posted {article.timePosted}</span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1" />
            {isCalculating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>{readTime || "Calculating..."}</span>
            )}{" "}          </div>
          <div className="text-sm text-gray-500 mb-4">
            <span>
              Source:{" "}
              <a
                href={article.source}
                className="text-blue-500 hover:underline"
              >
                {article.source}
              </a>
            </span>
          </div>

          <Tabs defaultValue="preview" className="mb-6">
            <TabsList className="bg-blue-900 dark:bg-gray-700">
              <TabsTrigger
                onClick={() =>
                  sendScrapeRequest(
                    article.arrayIndex,
                    article.openAiCollectionName
                  )
                }
                value="summarization"
                className="text-gray-500"
              >
                Summarization
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-gray-500">
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="summarization"
              className="bg-gray-200 p-4 mt-4 "
            >
              <p className="text-gray-800 dark:text-gray-300">
                {loading ? (
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  </div>
                ) : article.summary ? (
                  article.summary
                    .split("\n")
                    .map((point, index) => <p key={index}>{point}</p>)
                ) : response ? (
                  response
                    .split("\n")
                    .map((point, index) => <p key={index}>{point}</p>)
                ) : (
                  <p> No summary found </p>
                )}
              </p>
            </TabsContent>

            <TabsContent value="preview" className="bg-gray-200 p-4 mt-4">
              <p className=" text-gray-700 dark:text-gray-300 ">
                {article.preview}
              </p>
            </TabsContent>
          </Tabs>

          <div className="mb-6">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              width={700}
              height={400}
              className="w-full h-auto rounded-md"
            />
          </div>

          <div className="flex items-center gap-4 py-4 border-t border-b mb-6">
            {liveArticles[article.arrayIndex].likesBy?.includes(userId) ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() =>
                  handleLike(article.arrayIndex, article.openAiCollectionName)
                }
              >
                <ThumbsUp className="h-4 w-4 fill-blue-500 stroke-blue-500" />
                {liveArticles[article.arrayIndex].like}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() =>
                  handleLike(article.arrayIndex, article.openAiCollectionName)
                }
              >
                <ThumbsUp className="h-4 w-4" />
                {liveArticles[article.arrayIndex].like}
              </Button>
            )}
            {alert ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => handleShare(article.source)}
              >
                <CheckCircle color="green" size={24} />
                <p>Link is copied</p>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => handleShare(article.source)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}
          </div>
        </div>
      </div>
      {bookmarkAlert && (
        <div className="fixed inset-0 bg-black/50 z-80 flex items-center justify-center">
          <Alert className="relative w-full max-w-xl bg-white text-white rounded-lg overflow-hidden">
            <CheckCircle color="green" size={24} />
            <AlertDescription>Your article is bookmarked</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
