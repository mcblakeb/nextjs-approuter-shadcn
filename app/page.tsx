import { RetroList } from "@/components/ui/retro-list";
import Topbar from "@/components/ui/topbar";
import { AddRetroColumn } from "@/components/ui/retro-column";
import { getUserRetros } from "@/lib/retro";

export default async function Retro() {
  // Mock data for retros
  const retros = await getUserRetros(1); // Replace with actual user ID

  return (
    <div className="flex flex-col h-screen text-gray-900">
      {/* Top bar */}
      <Topbar />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* First sidebar with retro list */}
        <div className="w-1/5 bg-gray-100 p-4">
          <RetroList retros={retros} />
        </div>

        {/* Other sidebars */}
        <AddRetroColumn columnId={0} headerText="The Good" items={[]} />
        <AddRetroColumn columnId={1} headerText="To Improve" items={[]} />
        <AddRetroColumn columnId={2} headerText="Action Items" items={[]} />
        <AddRetroColumn
          columnId={3}
          headerText="Summary"
          items={[]}
          aiSummary={true}
        />
      </div>
    </div>
  );
}
