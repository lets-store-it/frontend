"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { PageMetadata } from "@/components/header/page-metadata";
import {
  Block,
  BlockTextElement,
  BlockCustomElement,
  BlockedPageRow,
} from "@/components/common-page/block";
// import client from "@/hooks/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import InstancesView from "@/components/common-page/instances-view";
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";

export default function TaskPage() {
  const { id } = useParams() as { id: string };
  const client = useApiQueryClient();
  const { data: task, isPending } = client.useQuery("get", "/tasks/{id}", {
    params: {
      path: { id },
    },
  });

  return (
    <div className="container py-6 space-y-6">
      <PageMetadata
        title={task?.data.name}
        breadcrumbs={[
          { href: "/tasks", label: "Задания" },
          { label: task?.data.name ?? "..." },
        ]}
        actions={
          [
            // <DeleteButton onClick={() => {}} />,
            // <EditButton onClick={() => {}} />,
          ]
        }
      />
      <BlockedPageRow>
        <Block title="Информация о задаче">
          <BlockTextElement label="ID" value={task?.data.id} copyable />
          <BlockTextElement label="Название" value={task?.data.name} />
          <BlockTextElement
            label="Подразделение"
            value={task?.data.unit.name}
          />
          <BlockTextElement label="Описание" value={task?.data.description} />
          <BlockTextElement
            label="Дата создания"
            value={task?.data.createdAt}
          />
        </Block>
        <Block title="Статус выполнения">
          <BlockCustomElement label="Статус">
            <Badge variant="outline" className="bg-green-500 text-white">
              {task?.data.status}
            </Badge>
          </BlockCustomElement>
          <BlockTextElement
            label="Ответственный сотрудник"
            value={`${task?.data.assignedTo?.lastName} ${
              task?.data.assignedTo?.firstName
            } ${task?.data.assignedTo?.middleName ?? ""}`}
          />
          <BlockTextElement
            label="Взята в работу в"
            value={task?.data.assignedAt ?? "-"}
          />
          <BlockTextElement
            label="Выполнена в"
            value={task?.data.completedAt ?? "-"}
          />
          {/* <BlockTextElement label="Время выполнения" value="10 минут" /> */}
        </Block>
      </BlockedPageRow>
      <InstancesView affectedByTaskId={id} withNoCell />
      <HistoryTable objectType={ObjectType.Task} objectId={id} />
    </div>
  );
}
