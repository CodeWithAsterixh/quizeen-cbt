import { Button, Card, GraduationCap, useAppLicense, bakedWhitelabelConfig } from "@cbt/shared";
import React from "react";

interface StartScreenProps {
  onStartExamClick: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartExamClick }) => {
  const { licenseState } = useAppLicense();
  const branding = licenseState?.license?.branding;
  const logo = branding?.appIconUrl || branding?.logoUrl || bakedWhitelabelConfig?.appIconUrl || bakedWhitelabelConfig?.logo;
  const appTitle = branding?.appName || branding?.schoolName || bakedWhitelabelConfig?.studentName || bakedWhitelabelConfig?.suiteName || 'CBT Portal';

  return (
    <section
      aria-label="Student Welcome Screen"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: "2rem 1.5rem",
        position: "relative",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <Card
        style={{
          maxWidth: 540,
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          padding: "2.5rem 2rem",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "var(--radius-lg, 12px)",
            backgroundColor: "#ffffff",
            color: "var(--color-primary)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {logo ? (
            <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} />
          ) : (
            <GraduationCap size={44} weight="fill" />
          )}
        </div>

        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "var(--color-text)",
            }}
          >
            Welcome to {appTitle}
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--color-text-muted)",
              lineHeight: 1.5,
            }}
          >
            Hello candidate! Enter the 6-character Student ID code provided by
            your teacher to start your Assessments.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onStartExamClick}
          style={{ minWidth: 200 }}
        >
          Enter Student ID
        </Button>
      </Card>
    </section>
  );
};
