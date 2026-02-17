import { ImageResponse } from "next/og";

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
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background:
            "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 60%, rgb(15, 23, 42) 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 70, fontWeight: 700, lineHeight: 1.1, marginBottom: 18 }}>
          CodeMemory
        </div>
        <div style={{ fontSize: 38, fontWeight: 500, opacity: 0.95, marginBottom: 20 }}>
          Master web development with spaced repetition
        </div>
        <div style={{ fontSize: 28, opacity: 0.85 }}>
          Flashcards, coding challenges, and adaptive review scheduling
        </div>
      </div>
    ),
    size
  );
}
