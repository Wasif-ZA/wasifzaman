import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Wasif Zaman - Software Engineer, Sydney";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "80px",
                    backgroundColor: "#FAF9F6",
                    backgroundImage:
                        "radial-gradient(#000000 1.5px, transparent 0)",
                    backgroundSize: "40px 40px",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        padding: "10px 20px",
                        backgroundColor: "#CEFF1A",
                        border: "4px solid #000",
                        boxShadow: "8px 8px 0 #000",
                        fontSize: 28,
                        fontWeight: 900,
                        letterSpacing: "0.05em",
                        marginBottom: 32,
                    }}
                >
                    ● AVAILABLE FOR WORK
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: 160,
                        fontWeight: 900,
                        lineHeight: 0.9,
                        letterSpacing: "-0.03em",
                        color: "#000",
                        textTransform: "uppercase",
                    }}
                >
                    <span>Wasif</span>
                    <span>Zaman</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        marginTop: 32,
                        padding: "16px 24px",
                        backgroundColor: "#fff",
                        border: "4px solid #000",
                        boxShadow: "8px 8px 0 #000",
                        fontSize: 28,
                        fontWeight: 700,
                        maxWidth: 900,
                    }}
                >
                    Software Engineering (Honours), Macquarie University 2027.
                </div>
            </div>
        ),
        { ...size }
    );
}
