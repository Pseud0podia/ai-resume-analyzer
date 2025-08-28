import { usePuterStore } from "~/lib/puter";
import { GoogleLogin } from "@react-oauth/google";
import {useEffect} from "react";
import {useLocation , useNavigate} from "react-router";
import $ from "jquery";

// Meta info remains same
export const meta = () => ([
    { title: "Resumemind - Auth" },
    { name: "description", content: "Log into your account" },
]);

const getGreeting = () => {
    useEffect(() => {
        const getGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) return "Good morning";
            if (hour < 18) return "Good afternoon";
            return "Good evening";
        };

        // Use jQuery to set greeting text inside element with id="greeting"
        $("#greeting").text(getGreeting());
    }, []);
}

const Auth = () => {
    const { isLoading , auth  } = usePuterStore()
    const googleLoginSuccess = usePuterStore(s => s.auth.googleLoginSuccess);
    const googleLoginError = usePuterStore(s => s.auth.googleLoginError);
    const greeting = getGreeting();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && auth.isAuthenticated) navigate(next || '/');
    }, [auth.isAuthenticated , next ]);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className={"gradient-border shadow-lg"}>
                <section className={"flex flex-col gap-8 bg-white rounded-2xl p-10"}>
                    <div className={"flex flex-col items-center gap-2 text-center"}>
                        <h1 id={"greeting"}></h1>
                        <h2>Log into Continue Your Job Journey</h2>
                    </div>
                    <section className={" gap-2"}>
                        <div className={"pb-2"}>
                            {!auth.isAuthenticated && (
                                <GoogleLogin
                                    theme="outline"
                                    size="large"
                                    shape="pill"
                                    text="signin_with"
                                    onSuccess={res => {
                                        if (res.credential) {
                                            googleLoginSuccess(res.credential); // update Zustand store!
                                        } else {
                                            googleLoginError();
                                        }
                                    }}
                                    onError={googleLoginError}
                                    logo_alignment="left"
                                />
                            )}
                        </div>
                        <div>
                            {auth.isAuthenticated ? (
                                <button className="auth-button" onClick={auth.signOut}>
                                    Log Out
                                </button>
                            ) : (
                                <>
                                </>
                            )}
                        </div>
                    </section>
                </section>
            </div>
        </main>
    );
};

export default Auth;
