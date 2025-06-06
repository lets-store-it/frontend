"use client";

import {
  Block,
  BlockedPage,
  BlockedPageRow,
  BlockTextElement,
} from "@/components/common-page/block";
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";
import InstancesView from "@/components/common-page/instances-view";
import { DeleteDialog } from "@/components/dialogs/deletion";
import { PageMetadata } from "@/components/header/page-metadata";
import PrintButton from "@/components/print-button";
import { Button } from "@/components/ui/button";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { getInstanceLabel } from "@/hooks/use-print-labels";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function InstancePage() {
  const { id } = useParams() as { id: string };
  const client = useApiQueryClient();
  const router = useRouter();
  const { data, isLoading, isError } = client.useQuery(
    "get",
    "/instances/{instanceId}",
    {
      params: {
        path: {
          instanceId: id,
        },
      },
    }
  );

  const deleteInstanceMutation = client.useMutation(
    "delete",
    "/instances/{instanceId}"
  );

  return (
    <BlockedPage>
      <PageMetadata
        title={`Экземпляр ${data?.data.id}`}
        actions={[
          <DeleteDialog
            buttonLabel="Удалить экземпляр"
            firstText="Вы действительно хотите удалить экземпляр?"
            onDelete={() => {
              deleteInstanceMutation.mutate(
                {
                  params: {
                    path: {
                      instanceId: id,
                    },
                  },
                },
                {
                  onSuccess: () => {
                    toast.success("Экземпляр успешно удален");
                    router.push("/instances");
                  },
                  onError: (error) => {
                    toast.error("Ошибка при удалении экземпляра", {
                      description: error.error.message,
                    });
                  },
                }
              );
            }}
          />,
          data?.data && (
            <PrintButton
              label={getInstanceLabel({
                id: data.data.id,
                name: data.data.item.name,
                variant: data.data.variant.name,
                instanceId: data.data.id,
              })}
            />
          ),
          <Button asChild>
            <Link href={`/instances/${data?.data.id}/edit`}>
              <Pencil />
              Редактировать
            </Link>
          </Button>,
        ]}
        breadcrumbs={[
          { label: "Экземпляры", href: "/instances" },
          {
            label: data?.data.id ?? "...",
            href: `/instances/${data?.data.id}`,
          },
        ]}
      />
      <BlockedPageRow>
        <Block title="Информация о Экземлпяре">
          <BlockTextElement label="ID" value={data?.data.id} copyable />
          <BlockTextElement label="Статус" value={data?.data.status} />
          <BlockTextElement
            label="Задание"
            value={data?.data.affectedByTaskId ?? "[Отсутствует]"}
          />
          <BlockTextElement label="Товар" value={data?.data.item.name} />
          <BlockTextElement label="Вариант" value={data?.data.variant.name} />
        </Block>
        <Block title="Вариант">
          <BlockTextElement label="ID" value={data?.data.variant.id} copyable />
          <BlockTextElement label="Название" value={data?.data.variant.name} />
          <BlockTextElement
            label="Артикул"
            value={data?.data.variant.ean13}
            copyable
          />
          <BlockTextElement
            label="EAN-13"
            value={data?.data.variant.ean13}
            copyable
          />
        </Block>
      </BlockedPageRow>
      <InstancesView instanceId={id} expanded />
      <HistoryTable objectType={ObjectType.ItemInstance} objectId={id} />
    </BlockedPage>
  );
}
