import { Button, Card, GraduationCap, useAppLicense, bakedWhitelabelConfig, PoweredByQueez } from "@cbt/shared";
import React, { useState, useEffect } from "react";

interface StartScreenProps {
  onStartExamClick: () => void;
  logoUrl?: string;
  portalTitle?: string;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartExamClick, logoUrl, portalTitle }) => {
  const { licenseState } = useAppLicense();
  const branding = licenseState?.license?.branding;
  const rawLogo = logoUrl || branding?.logoUrl || branding?.appIconUrl || bakedWhitelabelConfig?.logo || bakedWhitelabelConfig?.appIconUrl;
  const activeLogo = rawLogo && (rawLogo.startsWith('data:image/') || rawLogo.startsWith('/') || rawLogo.startsWith('http')) ? rawLogo : '/icon.png';
  const [logoSrc, setLogoSrc] = useState<string>(activeLogo);
  const [imgFailed, setImgFailed] = useState(false);
  const appTitle = portalTitle
    || (branding?.schoolName ? `${branding.schoolName} Student Portal` : undefined)
    || branding?.appName
    || bakedWhitelabelConfig?.studentName
    || 'Student Portal';

  useEffect(() => {
    setLogoSrc(activeLogo);
    setImgFailed(false);
  }, [activeLogo]);

  return (
    <section
      aria-label="Student Welcome Screen"
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        flex: 1, padding: "2rem 1.5rem", position: "relative", backgroundColor: "var(--color-bg)",
      }}
    >
      <Card
        style={{
          maxWidth: 540, width: "100%", textAlign: "center", display: "flex",
          flexDirection: "column", alignItems: "center", gap: "1.25rem", padding: "2.5rem 2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 90 }}>
          {!imgFailed && logoSrc ? (
            <img
              src={logoSrc}
              alt="School Logo"
              onError={() => {
                if (logoSrc !== '/icon.png') setLogoSrc('/icon.png');
                else setImgFailed(true);
              }}
              style={{
                maxHeight: 110,
                maxWidth: 240,
                width: "auto",
                height: "auto",
                objectFit: "contain",
                imageRendering: "-webkit-optimize-contrast",
              }}
            />
          ) : (
            <GraduationCap size={60} weight="fill" style={{ color: "var(--color-primary)" }} />
          )}
        </div>

        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--color-text)" }}>
            Welcome to {appTitle}
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
            Hello candidate! Enter the 6-character Student ID code provided by your teacher to start your Assessments.
          </p>
        </div>

        <Button variant="primary" size="lg" onClick={onStartExamClick} style={{ minWidth: 200 }}>
          Enter Student ID
        </Button>
      </Card>
      <PoweredByQueez style={{ marginTop: '1.5rem', opacity: 0.9 }} size={32} />
    </section>
  );
};
