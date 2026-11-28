import Script from "next/script";

import { analyticsConfig } from "@/config/analytics.config";

export default function GoogleTagManager() {
    const { googleTagManagerId, appEnvironment, } = analyticsConfig;

    return (
        <>
            <Script
                id="google-tag-manager-initializer" strategy="afterInteractive">
                {`
                    window.dataLayer =
                        window.dataLayer || [];

                    window.dataLayer.push({
                        "gtm.start": new Date().getTime(),
                        event: "gtm.js",
                        app_environment:
                        "${appEnvironment}"
                    });

                    (function(w, d, s, l, i) {
                        var firstScript =
                        d.getElementsByTagName(s)[0];

                        var gtmScript =
                        d.createElement(s);

                        var dataLayerParameter =
                        l !== "dataLayer"
                            ? "&l=" + l
                            : "";

                        gtmScript.async = true;

                        gtmScript.src =
                        "https://www.googletagmanager.com/gtm.js?id=" +
                        i +
                        dataLayerParameter;

                        firstScript.parentNode.insertBefore(
                        gtmScript,
                        firstScript
                        );
                    })(
                        window,
                        document,
                        "script",
                        "dataLayer",
                        "${googleTagManagerId}"
                    );
                `}
            </Script>
        </>
    );
}

// Rendered by AnalyticsConsent once the visitor accepts. There is no
// <noscript> fallback: without JavaScript nobody can consent.