"use client";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState<string>("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    e.stopPropagation();
    const promoise = restore({ id: documentId });
    toast.promise(promoise, {
      loading: "Restoring...",
      success: "Restored!",
      error: "Error restoring",
    });
  };

  const onRemove = (documentId: Id<"documents">) => {
    const promoise = remove({ id: documentId });
    toast.promise(promoise, {
      loading: "Deleting note...",
      success: "Deleted!",
      error: "Error deleting",
    });

    if (params.documentId === documentId) {
      router.push(`/documents`);
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Search"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-muted-foreground text-center pb-2">
          No Documents found
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            className="flex  text-sm rounded-sm w-full hover:bg-primary/5 items-center text-primary justify-between "
            role="button"
            onClick={() => onClick(document._id)}
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center ">
              <div
                onClick={(e) => {
                  onRestore(e, document._id);
                }}
                role="button"
                className="rounded=sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground " />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="rrounded=sm p-2 hover:bg-neutral-200  dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
