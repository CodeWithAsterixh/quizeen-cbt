import { Button, Card, GraduationCap, useAppLicense } from "@cbt/shared";
import React from "react";

interface StartScreenProps {
  onStartExamClick: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartExamClick,
}) => {
  const { licenseState} = useAppLicense();
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
            width: 72,
            height: 72,
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-primary-light)",
            color: "var(--color-primary)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap size={40} weight="fill" />
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
            Welcome to {licenseState?.license?.branding.appName}
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
