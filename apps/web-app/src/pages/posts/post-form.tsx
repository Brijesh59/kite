import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@kite/ui";
import { Input } from "@kite/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@kite/ui";
import { ArrowLeft, Save } from "lucide-react";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { usePost, useCreatePost, useUpdatePost } from "@/api/posts/use-posts";
import { LoadingSpinner } from "@kite/ui";

export default function PostFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: postData, isLoading } = usePost(id || "");
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  // Load post data for edit mode
  useEffect(() => {
    if (isEditMode && postData?.data.data.post) {
      const post = postData.data.data.post;
      setTitle(post.title);
      setContent(post.content);
    }
  }, [isEditMode, postData]);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content");
      return;
    }

    const data = { title: title.trim(), content };

    if (isEditMode && id) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/posts")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditMode ? "Update your post" : "Write and publish your content"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              maxLength={200}
            />
            <p className="mt-1 text-sm text-gray-500">{title.length}/200</p>
          </div>

          {/* Content Editor */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Content <span className="text-red-500">*</span>
            </label>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your post..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? "Update Post" : "Save as Draft"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/posts")}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            * Your post will be saved as a draft. You can publish it later from the posts list.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
