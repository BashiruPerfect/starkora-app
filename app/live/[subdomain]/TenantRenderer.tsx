"use client";

import { Render, type Data } from "@puckeditor/core";
import { config, type ComponentProps } from "@/puck.config";

export default function TenantRenderer({
  data,
}: {
  data: Data<ComponentProps>;
}) {
  return <Render config={config} data={data} />;
}