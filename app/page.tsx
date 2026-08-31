import { ArrowRight, Code2, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
   <div className="flex min-h-screen flex-col bg-white font-sans">
         <main className="flex-1">
           {/* Hero */}
           <section className="relative overflow-hidden px-4 pb-24 pt-20 md:pt-28">
             <div
               className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
               style={{ background: "radial-gradient(closest-side, #ede9fe, transparent)" }}
             />
             <div className="container relative mx-auto">
               <div className="mx-auto max-w-3xl text-center">
                 <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                   Real-time collaborative coding
                 </span>
                 <h1 className="mb-6 text-5xl font-bold tracking-tight text-[#17102b] md:text-6xl">
                   One file. Every cursor.{" "}
                   <span className="text-violet-600">Live.</span>
                 </h1>
                 <p className="mx-auto mb-10 max-w-xl text-lg text-slate-500 md:text-xl">
                   SyncCode is a shared workspace for your team&apos;s code — open a
                   room, share the link, and watch everyone&apos;s cursor move
                   through the file as you write.
                 </p>
                 <div className="mb-16 flex flex-col items-center gap-4">
                   <Link href="/sign-up">
                     <button className="inline-flex h-12 items-center rounded-md bg-violet-600 px-8 text-lg font-medium text-white shadow-lg shadow-violet-200 transition-colors hover:bg-violet-700">
                       Sign Up <ArrowRight className="ml-2 h-5 w-5" />
                     </button>
                   </Link>
                   <p className="text-sm text-slate-400">
                     Already have an account? {" "}
                     <Link href="/sign-in" className="font-medium text-violet-600 hover:text-violet-700">
                       Sign in
                     </Link>
                   </p>
                 </div>
               </div>
             </div>
           </section>
   
           {/* How it works */}
           <section className="border-t border-slate-100 bg-[#faf9ff] py-24">
             <div className="container mx-auto px-4">
               <h2 className="mb-14 text-center text-3xl font-bold text-[#17102b]">
                 From empty room to shared file, in three steps
               </h2>
               <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-3">
                 {[
                   { n: "01", title: "Create a workspace", body: "Spin up a project and pick your language. SyncCode sets up a Monaco-powered file, ready to edit." },
                   { n: "02", title: "Invite your team", body: "Share one link. Everyone who joins gets access based on the role you set for them." },
                   { n: "03", title: "Code in sync", body: "Edits land instantly for the whole room, cursors show who's here, and chat stays next to the file." },
                 ].map((s) => (
                   <div key={s.n} className="flex flex-col">
                     <span className="mb-3 font-mono text-sm font-semibold text-violet-400">{s.n}</span>
                     <h3 className="mb-2 text-xl font-semibold text-[#17102b]">{s.title}</h3>
                     <p className="text-slate-500">{s.body}</p>
                   </div>
                 ))}
               </div>
             </div>
           </section>
   
           {/* Features */}
           <section className="border-t border-slate-100 bg-white py-24">
             <div className="container mx-auto px-4">
               <div className="grid gap-12 md:grid-cols-3">
                 <div className="flex flex-col">
                   <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                     <Code2 className="h-6 w-6 text-violet-600" />
                   </div>
                   <h3 className="mb-3 text-2xl font-semibold text-[#17102b]">
                     Real-time editing
                   </h3>
                   <p className="text-slate-500">
                     Built on Yjs, so every keystroke reaches the whole room
                     instantly — no save button, no merge conflicts.
                   </p>
                 </div>
                 <div className="flex flex-col">
                   <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                     <Users className="h-6 w-6 text-violet-600" />
                   </div>
                   <h3 className="mb-3 text-2xl font-semibold text-[#17102b]">
                     Live presence
                   </h3>
                   <p className="text-slate-500">
                     Colored cursors and file presence show exactly who's
                     viewing what, in real time.
                   </p>
                 </div>
                 <div className="flex flex-col">
                   <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                     <MessageSquare className="h-6 w-6 text-violet-600" />
                   </div>
                   <h3 className="mb-3 text-2xl font-semibold text-[#17102b]">
                     Project chat
                   </h3>
                   <p className="text-slate-500">
                     Talk it through right next to the code, so context never
                     leaves the tab you're both looking at.
                   </p>
                 </div>
               </div>
             </div>
           </section>
         </main>
       </div>
  );
}
