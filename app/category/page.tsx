"use client";
import React, { useEffect } from "react";
import { GetFirestoreData } from "@/app/firebase/(hooks)/getFirestoreData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarComponent from "@/components/sidebar";
import { useState } from "react";
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import CreateCategoryModal from "@/components/create-category-modal";
import { DocumentData } from "firebase/firestore";
import { getFirestoreSnapshot } from "../firebase/(hooks)/getFirestoreSnapsot";

const Category = () => {
  //   const { data } = GetFirestoreData("categoryKeywords");
  const { data } = getFirestoreSnapshot("categoryKeywords");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<DocumentData[]>([]);

  // const handleDeleteCategory = (index: number) => {
  //     const newCategories = [...categories]
  //     newCategories.splice(index, 1)
  //     setCategories(newCategories)
  //   }

  const handleCreateCategory = (category: any) => {
    setCategories([...categories, category]);
    // Here you would typically save the category to your backend
    console.log("Created category:", category);
  };

  const onDelete = (index: number) => {
    console.log(`Delete item at index: ${index}`);
  };
  const onEdit = (index: number) => {
    console.log(`Edit item at index: ${index}`);
  };

  const handleRefreshClick = () => {
    router.push("/newsfetch");
  };
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setCategoriesData(data);
    }
  }, [data]);

  return (
    <div className="flex w-full h-screen">
      <SidebarComponent activeTab="categories" setActiveTab={() => {}} />
      <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 ml-24 p-4">
        <header className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <Button
            variant="default"
            className="bg-blue-950 hover:bg-blue-900"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Create Category
          </Button>

          <div className="relative w-full max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 bg-gray-100 dark:bg-gray-700 border-none"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleRefreshClick()}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>

            <SignedOut>
              <SignInButton>
                <Button className="bg-transparent border border-white-500 text-white hover:bg-white/50">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button
                  variant="secondary"
                  className="bg-white text-black hover:bg-white/50"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <h1 className="text-2xl font-bold ml-3 mt-3 mb-3">Categories</h1>
        {categoriesData &&
          categoriesData.map((item: any) => (
            <div key={item.id}>
              <Card
                className="overflow-hidden transition-all hover:shadow-md mb-3"
                onClick={() => router.push(`/category/${item.id}`)}
              >
                <CardHeader className="bg-gray-50 dark:bg-gray-800 pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">
                      {item.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onEdit(item.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Source
                      </h3>
                      <p className="flex flex-wrap gap-1 mt-1">
                       
                          {item.source.map((source: string, i: number) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:blue-green-300 dark:border-blue-800 "
                            >
                              {source}
                        
                            </Badge>
                          ))}

                      </p>
                    </div>

                    {item.includeKeyword.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Include Keywords
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.includeKeyword.map(
                            (keyword: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                              >
                                {keyword}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {item.excludeKeyword.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Exclude Keywords
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.excludeKeyword.map(
                            (keyword: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                              >
                                {keyword}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        <CreateCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onCreateCategory={handleCreateCategory}
        />{" "}
      </main>
    </div>
  );
};

export default Category;
