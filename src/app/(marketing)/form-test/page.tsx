import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lead Enquiry Form" };

import LeadForm from "@/components/forms/LeadForm/LeadForm";

export default function FormTestPage() {
    return (
        <section className="section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <h1 className="mb-3">
                            Lead Enquiry Form
                        </h1>

                        <p className="mb-4">
                            Complete the required fields to test the
                            reusable form architecture.
                        </p>

                        <LeadForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
