"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormBlock, useAppForm } from "@/components/common-form";
import React from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PathBreadcrumb } from "./path-breadcrumb";
import { storageGroupSchema } from "@/lib/zod/schemas";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  parentPath: { id: string; name: string }[];
  parentId: string | null;
  unitId: string;
}

export function CreateStorageGroupDialog({
  open,
  onOpenChange,
  parentPath,
  parentId,
  unitId,
}: CreateGroupDialogProps) {
  const queryClient = useApiQueryClient();
  const mutation = queryClient.useMutation("post", "/storage-groups");
  const globalClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      alias: "",
    },
    validators: {
      onChange: storageGroupSchema,
    },
    onSubmit: async (values) => {
      try {
        await mutation.mutateAsync({
          body: {
            unitId: unitId,
            parentId: parentId,
            name: values.value.name,
            alias: values.value.alias,
          },
        });

        toast.success("Группа успешно создана");
        globalClient.invalidateQueries({
          queryKey: ["get", "/storage-groups"],
        });
        onOpenChange(false);
      } catch (error: any) {
        toast.error("Ошибка при создании группы хранения", {
          description: error.message,
        });
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Новая Группа</DialogTitle>
          <PathBreadcrumb path={parentPath} />
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FormBlock>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <form.AppField
                  name="name"
                  children={(field) => <field.TextField label="Название" />}
                />
              </div>
              <div className="col-span-1">
                <form.AppField
                  name="alias"
                  children={(field) => <field.TextField label="Сокращение" />}
                />
              </div>
            </div>
          </FormBlock>
          <DialogFooter>
            <form.AppForm>
              <form.SubmitButton label="Create" />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
