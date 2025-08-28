import type { Route } from "./+types/home";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "../components/ResumeCard";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumemind" },
    { name: "description", content: "Smart feedback for your Dream Job" },
  ];
}

export default function Home() {
  return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <section className="main-section">
          <div className={"page-heading py-2"}>
            <h1>Track Your Applications & Resume Ratings</h1>
            <h2>Review your submissions and check AI-powered feedback</h2>
          </div>
          {resumes.length > 0 && (
              <div className="resumes-section" id="resumes-section">
                {resumes.map((resume) => (
                    <div key={resume.id} className="resume-card">
                      <ResumeCard resume={resume} />
                    </div>
                ))}
              </div>
          )}
        </section>
      </main>
  );
}
