import React, {useEffect , useState} from 'react';
import {Link, useNavigate, useParams} from "react-router";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import CompanySuggestions from '~/components/CompanySuggestions';

export const meta = () => ([
    { title: "Resumemind | Review" },
    { name: "description", content: "Detailed overview of your resume" },
])

const Resume = () => {
    const {auth , isLoading , fs , kv} = usePuterStore();
    const { id } = useParams();
    const[imageUrl , setImageUrl] = useState('');
    const[resumeUrl , setResumeUrl] = useState('');
    const[feedback , setFeedback] = useState<Feedback | null>(null);
    const [isPaid, setIsPaid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [auth.isAuthenticated , isLoading , id]);

    useEffect(() => {
        setIsPaid(localStorage.getItem(`paid:${id}`) === "true");
    }, [id]);

    const companies = feedback?.suggestedCompanies ?? [
        "Improve your Resume , to be noticed by companies"
    ];
    const handlePayClick = () => {
        navigate(`/payment/${id}`);
    };

    useEffect(() => {
        const loadResume = async() => {
            const resume = await kv.get(`resume:${id}`);
            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob ([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl , feedback: data.feedback});
        }

        loadResume();
    }, [id]);

    return (
        <main className={"!pt-0"}>
            <nav className={"resume-nav"}>
                <Link to={"/"} className={"back-button"}>
                    <img src={"/icons/back.svg"} alt="logo" className={"w-2.5 h-2.5"}/>
                    <span className={"text-gray-800 text-sm font-semibold"}>Back to Homepage</span>
                </Link>
            </nav>
            <div className={"flex flex-row w-full max-lg:flex-col"}>
                <section className={"feedback-section bg-[url('/images/bg-small.svg') bg-cover h-auto lg:h-[100vh] lg:sticky lg:top-0 items-center justify-center"}>
                    {imageUrl && resumeUrl && (
                        <div className={"animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[100%] max-wxl:h-fit w-fit"}>
                            <a href={resumeUrl} target={"_blank"} rel={"noreferrer noopener"}>
                                <img
                                src={imageUrl}
                                className={"w-full h-full object-contain rounded-2xl"}
                                title = "resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className={"feedback-section"}>
                    <h2 className={"text-4xl !text-black font-bold"}>Resume Review</h2>
                    {feedback ? (
                        <div className={"flex flex-col gap-8 animate-in fade-in duration-1000"}>
                            <Summary feedback={feedback}/>
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                            <CompanySuggestions
                                companies={companies}
                                isPaid={isPaid}
                                onPayClick={handlePayClick}
                            />
                            <Details feedback={feedback}/>
                        </div>
                    ):(
                        <img  src={"/images/resume-scan-2.gif"} className={"w-full"}/>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Resume;