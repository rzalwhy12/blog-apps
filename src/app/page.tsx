"use client";
import * as React from "react";
import Image from "next/image";
import { apiCall } from "@/helper/apiCall";
import { dataCategory } from "@/helper/dataCategory";
import { useRouter } from "next/navigation";


const Home: React.FunctionComponent = () => {

  const router = useRouter();
  const [articleList, setArticleList] = React.useState<any[]>([]);
  const [category] = React.useState<string[]>([
    "All",
    ...dataCategory,
  ]);
  const [filterCategory, setFilterCategory] = React.useState<string>("All");

  const [displayArticleList, setDisplayArticleList] = React.useState<any[]>([]);

  const getArticlesList = async () => {
    try {
      const url = "/articles?pageSize=100&sortBy=%60created%60%20desc";
      const { data } = await apiCall.get(url);
      setArticleList(data);

      setDisplayArticleList(data);
    } catch (error) {
      console.log("Error fetching all articles:", error);
    }
  };

  

  React.useEffect(() => {
    getArticlesList();
  }, []);

  const handleFilterArticles = (categoryName: string) => {
    setFilterCategory(categoryName);

    if (categoryName === 'All') {
      setDisplayArticleList(articleList);
    } else {

      const filtered = articleList.filter(item => item.category === categoryName);
      setDisplayArticleList(filtered);
    }
  };

  const printArticleList = () => {
    if (displayArticleList.length === 0 && filterCategory !== "All") {
      return (
        <div className="col-span-full text-center text-gray-500 text-lg py-10" >
          No articles found for category &quot;{filterCategory}&quot;.
        </div>
      );
    }
    if (displayArticleList.length === 0 && filterCategory === "All") {
      return (
        <div className="col-span-full text-center text-gray-500 text-lg py-10">
          No articles available.
        </div>
      );
    }
    return displayArticleList.map((val: any) => {
      const imageUrl = val.thumbnail &&
        `https://picsum.photos/id/${Math.floor(Math.random() * 30)}/200/300`;

      return (
        <div
          key={val.objectId}
          className="h-72 flex flex-col items-center bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer "
          onClick={() => router.push(`/article/${val.title}`)}
        >
          <div className="relative h-36 w-full">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={val.title || "Article thumbnail"}
                layout="fill"
                objectFit="cover"
                className="rounded-t-xl"
              />
            )}
          </div>
          <div className="w-full p-4 flex-grow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              {/* <h6 className="px-4 uppercase font-semibold text-sm text-gray-500">
                {val.accountData.username}
              </h6> */}
              {val.category && (
                <span className="border border-slate-500 text-slate-700 rounded-full py-0.5 px-2 text-xs font-medium">
                  {val.category}
                </span>
              )}
            </div>
            <p className="font-bold text-base md:text-lg">
              {val.title && val.title.length > 55
                ? val.title.slice(0, 52) + "..."
                : val.title}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {val.created ? new Date(val.created).toLocaleDateString() : 'No Date'}
            </p>
          </div>
        </div>
      );
    });
  };


  return (
    <main>
      <section id="hero">
        <div className="relative h-[30rem] w-full">
          <Image
            src={`https://picsum.photos/id/${Math.floor(
              Math.random() * 30
            )}/600/300`}
            alt={"test"}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-0 right-0 w-full p-4 text-right bg-slate-200 bg-opacity-55">
            <p className="text-2xl md:text-4xl lg:text-5xl italic">
              {articleList[0]?.title}
            </p>
          </div>
        </div>
      </section>
      <section id="article-list" className="space-y-8 mt-8 px-20">
        <div id="article-filter" className="w-full overflow-x-auto py-8">
          {/* filter */}
          <ul className="flex gap-4 pb-2"> {/* Added pb-2 for scrollbar */}
            {category.map((val: string) => (
              <li key={val}>
                <span
                  className={`border ${filterCategory === val
                      ? "bg-slate-700 text-white font-semibold" // Darker background for active
                      : "border-slate-500 text-slate-700 hover:bg-slate-100" // Normal state and hover
                    } rounded-full py-1 px-4 cursor-pointer whitespace-nowrap transition-colors duration-200`}
                  onClick={() => handleFilterArticles(val)} // Call the new function here
                >
                  {val}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full min-h-screen grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {printArticleList()}
        </div>
      </section>
    </main>
  );
};

export default Home;