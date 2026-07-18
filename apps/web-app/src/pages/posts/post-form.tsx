import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { usePost, useCreatePost, useUpdatePost } from "@/api/posts/use-posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { useWorkspaceStore } from "@/utils/workspace-store";
import { Badge } from "@/components/ui/badge";

export default function PostFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [draft, setDraft] = useState({
    key: "new",
    title: "",
    content: "",
  });

  const { currentWorkspace } = useWorkspaceStore();

  const { data: postData, isLoading } = usePost(id || "");
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();
  const post = isEditMode ? postData?.data.data.post : undefined;
  const draftKey = post?.id ?? "new";
  const title = draft.key === draftKey ? draft.title : post?.title ?? "";
  const content =
    draft.key === draftKey ? draft.content : post?.content ?? "";

  const setTitle = (value: string) => {
    setDraft((current) => ({
      key: draftKey,
      title: value,
      content:
        current.key === draftKey ? current.content : post?.content ?? "",
    }));
  };

  const setContent = (value: string) => {
    setDraft((current) => ({
      key: draftKey,
      title: current.key === draftKey ? current.title : post?.title ?? "",
      content: value,
    }));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content");
      return;
    }

    if (!currentWorkspace) {
      alert("Please select a workspace from the sidebar");
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditMode ? "Update your post" : "Write and publish your content"}
          </p>
        </div>
        {currentWorkspace && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Workspace:</span>
            <Badge variant="secondary">{currentWorkspace.name}</Badge>
          </div>
        )}
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
