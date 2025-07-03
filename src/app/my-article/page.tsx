"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { FaImage } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiCall } from "@/helper/apiCall";
import { toast } from "react-toastify";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // Import Dialog and DialogContent
import UpdateArticleDialog from "./components/UpdateArticleDialog";
import { dataCategory } from "@/helper/dataCategory"; // Import dataCategory

const PostPage: React.FunctionComponent = () => {
  const router = useRouter();
  const articleContentRef = React.useRef<HTMLTextAreaElement>(null);
  const articleTitleRef = React.useRef<HTMLInputElement>(null);
  const articleThumbnailRef = React.useRef<HTMLInputElement>(null);
  const articleCategoryRef = React.useRef<string | null>(null);

  const [articleList, setArticleList] = React.useState<any[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [currentEditingArticle, setCurrentEditingArticle] = React.useState<any | null>(null);

  const getArticlesList = async () => {
    try {
      const res = await apiCall.get(
        "/articles?pageSize=100&sortBy=%60created%60%20desc"
      );
      setArticleList(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch articles.");
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem("tkn")) {
      getArticlesList();
    } else {
      router.replace("/sign-in");
    }
  });

  const onDelete = async (objectId: string) => {
    try {
      if (confirm("Are you sure you want to delete this?")) {
        await apiCall.delete(`/articles/${objectId}`);
        toast.success("Delete article success", {
          autoClose: 3000,
        });
        getArticlesList();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete article.");
    }
  };

  const handleOpenEditDialog = (article: any) => {
    setCurrentEditingArticle(article);
    setIsEditDialogOpen(true);
  };

  const handleSaveUpdatedArticle = async (updatedData: any) => {
    try {
      if (!updatedData.objectId) {
        toast.error("Article ID is missing for update.");
        return;
      }
      await apiCall.put(`/articles/${updatedData.objectId}`, updatedData);
      toast.success("Article updated successfully!", {
        autoClose: 3000,
      });
      getArticlesList();
      setIsEditDialogOpen(false); // Close dialog on successful save
      setCurrentEditingArticle(null); // Clear editing state
    } catch (error) {
      console.log(error);
      toast.error("Failed to update article.");
    }
  };

  const printArticleList = () => {
    return articleList.map((val: any, idx: number) => {
      return (
        <div
          key={idx}
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(val.objectId)}
                >
                  Delete
                </Button>
                {/* Use a regular Button and control the Dialog state manually */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEditDialog(val)}
                >
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
      if (articleTitleRef.current && articleCategoryRef.current && articleContentRef.current && articleThumbnailRef.current) {
        if (!articleTitleRef.current.value || !articleCategoryRef.current || !articleContentRef.current.value || !articleThumbnailRef.current.value) {
          toast.error("Please fill in all article fields.");
          return;
        }

        await apiCall.post("/articles", {
          title: articleTitleRef.current.value,
          category: articleCategoryRef.current,
          thumbnail: articleThumbnailRef.current.value,
          content: articleContentRef.current.value,
        });
        getArticlesList();
        toast.success("Article added successfully!");

        // Clear form fields
        articleTitleRef.current.value = "";
        articleThumbnailRef.current.value = "";
        if (articleContentRef.current) articleContentRef.current.value = "";
        articleCategoryRef.current = null;
      } else {
        toast.error("Please fill in all article fields.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create article.");
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
                {dataCategory.map((category: string) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <textarea
            ref={articleContentRef}
            placeholder="Write your article content here..."
            className="w-full p-3 rounded-md focus:outline-none min-h-[100px]"
          />
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
      <div className="lg:w-1/2 space-y-3">{printArticleList()}</div>

      {currentEditingArticle && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <UpdateArticleDialog
              data={currentEditingArticle}
              onSave={handleSaveUpdatedArticle}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PostPage;