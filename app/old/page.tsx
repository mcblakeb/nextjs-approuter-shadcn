import CardCategory from "@/components/CardCategory";

export default function Admin() {
  return (
    <main>
      <div className="flex">
        <div className="bg-blue-100 w-52 h-screen">1st col</div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-cyan-700 to-cyan-900">
          <CardCategory />
        </div>
      </div>
    </main>
  );
}
