import { ImageResponse } from "next/og";

export const alt =
  "Nexora AI - Intelligent AI workflows for modern teams";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #05050a 0%, #0d0718 50%, #05050a 100%)",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {/* Background glow 1 */}
        <div
          style={{
            position: "absolute",
            width: "520px",
            height: "520px",
            borderRadius: "9999px",
            background: "rgba(124, 58, 237, 0.28)",
            filter: "blur(90px)",
            top: "-220px",
            left: "310px",
          }}
        />

        {/* Background glow 2 */}
        <div
          style={{
            position: "absolute",
            width: "360px",
            height: "360px",
            borderRadius: "9999px",
            background: "rgba(6, 182, 212, 0.13)",
            filter: "blur(90px)",
            right: "-100px",
            bottom: "-120px",
          }}
        />

        {/* Background glow 3 */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "9999px",
            background: "rgba(217, 70, 239, 0.12)",
            filter: "blur(90px)",
            left: "-80px",
            bottom: "-100px",
          }}
        />

        {/* Main content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "70px 82px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "16px",
                  background: "rgba(139, 92, 246, 0.18)",
                  border: "1px solid rgba(196, 181, 253, 0.32)",
                  color: "#c4b5fd",
                  fontSize: "27px",
                  fontWeight: 700,
                }}
              >
                N
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "30px",
                  fontWeight: 700,
                  letterSpacing: "-1px",
                }}
              >
                <span>Nexora</span>

                <span
                  style={{
                    marginLeft: "8px",
                    color: "#c4b5fd",
                  }}
                >
                  AI
                </span>
              </div>
            </div>

            {/* Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(167, 139, 250, 0.25)",
                background: "rgba(139, 92, 246, 0.09)",
                borderRadius: "9999px",
                padding: "11px 18px",
                color: "#ddd6fe",
                fontSize: "17px",
              }}
            >
              AI-powered workspace
            </div>
          </div>

          {/* Center */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "940px",
            }}
          >
            <div
              style={{
                fontSize: "70px",
                lineHeight: 1.02,
                letterSpacing: "-4px",
                fontWeight: 700,
              }}
            >
              Turn scattered work into
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "8px",
                fontSize: "70px",
                lineHeight: 1.02,
                letterSpacing: "-4px",
                fontWeight: 700,
                color: "#c4b5fd",
              }}
            >
              intelligent momentum.
            </div>

            <div
              style={{
                marginTop: "28px",
                maxWidth: "760px",
                color: "rgba(255,255,255,0.62)",
                fontSize: "25px",
                lineHeight: 1.4,
              }}
            >
              Connect knowledge, automate repetitive work and give your team
              an intelligent AI copilot.
            </div>
          </div>

          {/* Bottom */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "22px",
                color: "rgba(255,255,255,0.45)",
                fontSize: "17px",
              }}
            >
              <span>AI Workflows</span>
              <span>Automation</span>
              <span>Team Collaboration</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "13px 20px",
                borderRadius: "12px",
                background:
                  "linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)",
                fontSize: "17px",
                fontWeight: 600,
                boxShadow: "0 12px 40px rgba(109, 40, 217, 0.35)",
              }}
            >
              Start building free
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}