// src/app/my-article/components/UpdateArticleDialog.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DialogClose, // Keep DialogClose as it's used for the Cancel button
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; // Remove Dialog, DialogContent, DialogTrigger
import FormInput from "@/components/core/FormInput";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { dataCategory } from "@/helper/dataCategory";
import { Textarea } from "@/components/ui/textarea";

interface IUpdateArticleDialogProps {
    data: any;
    onSave: (updatedData: any) => Promise<void>;
    // You might still want to pass individual field handlers if PostPage manages them
    // For now, let's assume `data` contains current values and `onSave` gets final state.
}

const UpdateArticleDialog: React.FunctionComponent<
    IUpdateArticleDialogProps
> = (props) => {
    // State to manage the form data (we put this back as discussed in previous iterations
    // because it makes the dialog self-contained for its form fields before saving).
    const [formData, setFormData] = React.useState({
        title: props.data?.title || "",
        thumbnail: props.data?.thumbnail || "",
        category: props.data?.category || "",
        content: props.data?.content || "",
    });

    // Reset form data when the dialog is opened for a new article (data prop changes)
    React.useEffect(() => {
        setFormData({
            title: props.data?.title || "",
            thumbnail: props.data?.thumbnail || "",
            category: props.data?.category || "",
            content: props.data?.content || "",
        });
    }, [props.data]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            category: value,
        }));
    };

    const handleSaveChanges = () => {
        props.onSave({ ...formData, objectId: props.data.objectId });
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <DialogHeader>
                <DialogTitle>Edit Article</DialogTitle>
                <DialogDescription>
                    Make changes to your article here. Click save when you&apos;re done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <FormInput
                    type="text"
                    name="title"
                    label="Title"
                    value={formData.title}
                    onChange={handleChange}
                    id="edit-article-title"
                />
                <FormInput
                    type="text"
                    name="thumbnail"
                    label="Thumbnail URL"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    id="edit-article-thumbnail"
                />
                <div className="grid gap-2">
                    <label htmlFor="edit-article-category" className="font-medium text-sm">Category</label>
                    <Select
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger id="edit-article-category" className="w-full">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {dataCategory.map((val: string) => {
                                return (
                                    <SelectItem key={val} value={val}>
                                        {val}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <label htmlFor="edit-article-content" className="font-medium text-sm">Content</label>
                    <Textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        id="edit-article-content"
                        rows={6}
                        placeholder="Write your article content here..."
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSaveChanges}>
                    Save changes
                </Button>
            </DialogFooter>
        </form>

    );
};

export default UpdateArticleDialog;