import type { Metadata } from "next";

export const metadata: Metadata = { title: "Open Your Demat Account" };

import DematAccountForm from "@/components/forms/DematAccountForm/DematAccountForm";

export default function DematFormTestPage() {
    return (
        <section className="section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <h1 className="mb-3">
                            Open Your Demat Account
                        </h1>

                        <p className="mb-4">
                            Enter your details to continue to the
                            account-opening journey.
                        </p>

                        <DematAccountForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
