import { RetroList } from "@/components/ui/retro-list";
import Topbar from "@/components/ui/topbar";
import { AddRetroColumn } from "@/components/ui/retro-column";
import { RetroNote } from "@/lib/schema";

export default function Retro() {
  // Mock data for retros
  const mockRetros = [
    { id: 1, name: "Sprint Review - April", slug: "sprint-review-april-123" },
    { id: 2, name: "Product Roadmap", slug: "product-roadmap-456" },
    { id: 3, name: "Team Retrospective", slug: "team-retro-789" },
    { id: 4, name: "UX Feedback", slug: "ux-feedback-101" },
    { id: 5, name: "Q2 Planning", slug: "q2-planning-112" },
  ];

  const mockRetroItems: RetroNote[] = [
    {
      id: 1,
      retroId: 1,
      content: "Great teamwork and collaboration.",
      createdByName: "Alice Cooper",
      createdByEmail: "test@test.com",
      category: null,
      categoryId: 0,
      createdAt: new Date(),
    },
    {
      id: 2,
      retroId: 1,
      content: "Great other stuff.",
      createdByName: "Frank Weenie",
      createdByEmail: "test@test.com",
      category: null,
      categoryId: 0,
      createdAt: new Date(),
    },
    {
      id: 3,
      retroId: 1,
      content: "Oops.",
      createdByName: "John Smith",
      createdByEmail: "test@test.com",
      category: null,
      categoryId: 1,
      createdAt: new Date(),
    },
    {
      id: 3,
      retroId: 1,
      content: "Plan better",
      createdByName: "John Smith",
      createdByEmail: "test@test.com",
      category: null,
      categoryId: 2,
      createdAt: new Date(),
    },
  ];

  return (
    <div className="flex flex-col h-screen text-gray-900">
      {/* Top bar */}
      <Topbar />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* First sidebar with retro list */}
        <div className="w-1/5 bg-gray-100 p-4">
          <RetroList retros={mockRetros} />
        </div>

        {/* Other sidebars */}
        <AddRetroColumn
          columnId={0}
          headerText="The Good"
          items={mockRetroItems}
        />
        <AddRetroColumn
          columnId={1}
          headerText="To Improve"
          items={mockRetroItems}
        />
        <AddRetroColumn
          columnId={2}
          headerText="Action Items"
          items={mockRetroItems}
        />
        <AddRetroColumn
          columnId={3}
          headerText="Summary"
          items={mockRetroItems}
          aiSummary={true}
        />
      </div>
    </div>
  );
}
