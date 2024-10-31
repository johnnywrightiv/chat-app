import Chat from "./components/chat";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen">
      <main className="">
        <Chat />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        footer content
      </footer>
    </div>
  );
}
