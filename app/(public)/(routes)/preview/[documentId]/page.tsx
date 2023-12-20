"use client";

import dynamic from "next/dynamic";

import { useMemo } from "react";

import { Toolbar } from "@/app/(main)/_components/Toolbar";
import { Cover } from "@/components/Cover";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const update = useMutation(api.documents.update);
  const document = useQuery(api.documents.getById, {
    id: params.documentId,
  });

  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/Editor"), {
        ssr: false,
      }),
    []
  );

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content: content,
    });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="w-[50%] h-14" />
            <Skeleton className="w-[80%] h-14" />
            <Skeleton className="w-[40%] h-14" />
            <Skeleton className="w-[60%] h-14" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <p>Not found</p>;
  }

  return (
    <div className="pb-40">
      <Cover preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto ">
        <Toolbar preview initialData={document} />
        <Editor
          editable={false}
          onChange={onChange}
          initialContent={document.content}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;
