import Link from "next/link";
export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Buyer Web Frontend Working 🎉</h1>
      <p className="text-gray-600 mt-2">Go to <code>/Home_Page</code> to view your custom page.</p>
      <p className="text-gray-600 mt-2">
        Visit the /components-demo <Link href="/components-demo" className="text-blue-500 hover:underline">
          Components Playground
        </Link>
      </p>
    </main>
  );
}
