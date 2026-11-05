"use client";

export const dynamic = "force-dynamic";

import { useParams } from "next/navigation";
import BhajanEditor from "../BhajanEditor";

export default function EditBhajanPage() {
  const params = useParams<{ id: string }>();
  return <BhajanEditor id={params.id} />;
}
