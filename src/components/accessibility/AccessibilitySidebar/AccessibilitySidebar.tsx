
"use client";

import { THEME_SWITCH_ENABLED } from "@/config/features.config";
import {
    DEFAULT_FONT_SIZE,
    MAX_FONT_SIZE,
    MIN_FONT_SIZE,
    useAccessibility,
} from "@/context/AccessibilityContext";
import { LargerTextIcon, ResetIcon, SmallerTextIcon } from "./TextSizeIcons";
import styles from "./AccessibilitySidebar.module.scss";

export default function AccessibilitySidebar() {
    const {
        theme,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleTheme,
    } = useAccessibility();

    const isDarkTheme = theme === "dark";
    const percent = Math.round((fontSize / DEFAULT_FONT_SIZE) * 100);

    /* A button at its limit stays focusable, so keyboard users keep their
       place; aria-disabled says it will do nothing. */
    const sizeControls = [
        { label: "Smaller", Icon: SmallerTextIcon, run: decreaseFontSize, off: fontSize <= MIN_FONT_SIZE },
        { label: "Default", Icon: ResetIcon, run: resetFontSize, off: fontSize === DEFAULT_FONT_SIZE },
        { label: "Larger", Icon: LargerTextIcon, run: increaseFontSize, off: fontSize >= MAX_FONT_SIZE },
    ];

    return (
        <aside
            className={`offcanvas offcanvas-end ${styles.sidebarPanel}`}
            tabIndex={-1}
            id="accessibilityPanel"
            aria-labelledby="accessibilityPanelTitle"
        >
            <div className="offcanvas-header">
                <h2 className={`offcanvas-title h5 ${styles.sidebarTitle}`} id="accessibilityPanelTitle">
                    Accessibility Options
                </h2>


                <button
                    type="button"
                    className={`btn-close ${styles.closeButton}`}
                    data-bs-dismiss="offcanvas"
                    aria-label="Close accessibility options"
                />

            </div>

            <div className="offcanvas-body">
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Text size</h3>

                    <p className={styles.helperText}>
                        Changes the size of the text on the website.
                    </p>

                    <div className={styles.buttonGroup} role="group" aria-label="Text size">
                        {sizeControls.map(({ label, Icon, run, off }) => (
                            <button
                                key={label}
                                type="button"
                                className={styles.sizeButton}
                                onClick={off ? undefined : run}
                                aria-disabled={off}
                            >
                                <Icon />
                                <span data-label>{label}</span>
                                <span className="visually-hidden"> text size</span>
                            </button>
                        ))}
                    </div>

                    <p className={styles.status} role="status">
                        Current text size: <strong>{percent}%</strong>
                    </p>
                </div>

                {THEME_SWITCH_ENABLED ? (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Theme</h3>

                        <button
                            type="button"
                            className={styles.themeButton}
                            onClick={toggleTheme}
                            aria-pressed={isDarkTheme}
                            aria-label={
                                isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
                            }
                        >
                            {isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
                        </button>
                    </div>
                ) : null}
            </div>
        </aside>
    );
}
