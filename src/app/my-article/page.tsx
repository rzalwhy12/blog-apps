"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { FaImage } from "react-icons/fa";
import { callAPI } from "@/config/axios";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PostPage: React.FunctionComponent = () => {
  const router = useRouter();
  const articleFormRef = React.useRef<any>(null);
  const articleTitleRef = React.useRef<HTMLInputElement>(null);
  const articleThumbnailRef = React.useRef<HTMLInputElement>(null);
  const articleCategoryRef = React.useRef<string | null>(null);

  const [postsList, setPostsList] = React.useState<any[]>([]);

  const getArticlesList = async () => {
    try {
      const { data } = await callAPI.get(`/articles`);

      setPostsList(data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getArticlesList();
  }, []);

  const printPostsList = () => {
    return postsList.map((val: any, idx: number) => {
      return (
        <div
          key={val.objectId}
          className="w-full p-4 flex items-center rounded-md bg-white cursor-pointer"
        >
          <div className="w-full rounded-e-xl">
            <h4
              className="font-bold cursor-pointer"
              onClick={() => router.push(`/article/${val.title}`)}
            >
              {val.title}
            </h4>
            <div className="w-full flex items-center justify-between">
              <div className="flex text-xs items-center gap-4">
                <h6 className="text-xs font-thin">
                  {new Date(val.created).toLocaleString()}
                </h6>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  Delete
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const onCreateArticle = async () => {
    try {
      if (articleTitleRef.current) {
        const response = await callAPI.post("/articles", {
          title: articleTitleRef.current.value,
          category: articleCategoryRef.current,
          thumbnail: articleThumbnailRef.current?.value,
          content: articleFormRef.current.getContent(),
        });
        alert("Tambah data article berhasil");
        getArticlesList();
      } else {
        alert("Form todo jangan sampai kosong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div id="timeline" className="w-full md:flex gap-4">
      <div className="lg:w-1/2 items-center">
        <div className="w-full bg-white md:p-3 rounded-lg shadow-md">
          <input
            placeholder="Title"
            className="w-full p-3 rounded-md focus:outline-none"
            ref={articleTitleRef}
            type="text"
          />
          <div className="flex items-center">
            <input
              placeholder="Thumbnail URL"
              className="w-full p-3 rounded-md focus:outline-none"
              ref={articleThumbnailRef}
              type="text"
            />
            <Select
              onValueChange={(value) => (articleCategoryRef.current = value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Economics">Economics</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Goverment">Goverment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <textarea ref={articleFormRef} />
          <hr className="md:mb-4" />
          <div className="flex p-2 justify-between items-center">
            <div className="flex gap-2">
              <div>
                <FaImage size={24} color="#334156" />
              </div>
            </div>
            <Button
              type="button"
              className="bg-slate-700 text-white md:px-3 md:py-0.5 text-sm rounded-full shadow"
              onClick={onCreateArticle}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 space-y-3">{printPostsList()}</div>
    </div>
  );
};

export default PostPage;
