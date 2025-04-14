import { RetroList } from "@/components/ui/retro-list";
import Topbar from "@/components/ui/topbar";
import { AddRetroColumn } from "@/components/ui/retro-column";
import { getUserByEmail, getUserRetroBySlug, getUserRetros } from "@/lib/retro";
import { cookies } from "next/headers";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) {
    throw new Error("Slug is required");
  }
  const cookieStore = await cookies();
  const dataRaw = await cookieStore.get("sr.userData")?.value;
  const dataParsed = JSON.parse(dataRaw! || "{}");
  const user = await getUserByEmail(dataParsed.email!);
  const currentRetro = await getUserRetroBySlug(slug);
  const allRetros = await getUserRetros(user!.id!);
  return (
    <div className="flex flex-col h-screen text-gray-900">
      {/* Top bar */}
      <Topbar />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* First sidebar with retro list */}
        <div className="w-1/5 bg-gray-100 p-4">
          <RetroList retros={allRetros} />
        </div>

        {/* Other sidebars */}
        <AddRetroColumn
          columnId={0}
          headerText="The Good"
          items={currentRetro!.notes}
        />
        <AddRetroColumn
          columnId={1}
          headerText="To Improve"
          items={currentRetro!.notes}
        />
        <AddRetroColumn
          columnId={2}
          headerText="Action Items"
          items={currentRetro!.notes}
        />
        <AddRetroColumn
          columnId={3}
          headerText="Summary"
          items={currentRetro!.notes}
          aiSummary={true}
        />
      </div>
    </div>
  );
}
