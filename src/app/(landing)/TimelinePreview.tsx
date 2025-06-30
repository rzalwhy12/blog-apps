import { callAPI } from "@/config/axios";
import Image from "next/image";

// Fetch articles data directly in the Server Component
const getArticles = async (): Promise<any[]> => {
  try {
    const { data } = await callAPI.get("/articles?sortBy=%60created%60%20desc");
    return data.slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return []; // Return an empty array on failure
  }
};

// Server Component for TimelinePreview
const TimelinePreview = async () => {
  const articles = await getArticles();

  const printTimeline = () => {
    return articles.map((article) => (
      <div
        key={article.objectId}
        className="w-full flex bg-white rounded-lg shadow-md cursor-pointer"
      >
        <div className="relative h-52 w-80">
          <Image
            src={
              article.thumbnail ||
              `https://dummyimage.com/600x400/000/fff&text=PWD`
            }
            alt={article.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="w-full p-4 bg-slate-100 rounded-lg">
          <div className="flex items-center justify-between">
            {/* <h6 className="px-4 uppercase font-semibold text-sm text-gray-500">
              {article.accountData.username}
            </h6> */}
            <span className="border border-slate-500 rounded-full py-0.5 px-2 text-xs">
              {article.category}
            </span>
          </div>
          <p className="font-light text-lg px-4 py-2">{article.title}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="m-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      {printTimeline()}
    </div>
  );
};

export default TimelinePreview;
