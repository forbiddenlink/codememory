import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background:
            "linear-gradient(135deg, rgb(30, 64, 175) 0%, rgb(79, 70, 229) 55%, rgb(2, 6, 23) 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.1, marginBottom: 14 }}>
          CodeMemory
        </div>
        <div style={{ fontSize: 34, opacity: 0.92, marginBottom: 16 }}>
          Learn. Code. Remember.
        </div>
        <div style={{ fontSize: 24, opacity: 0.82 }}>
          Adaptive spaced repetition for developers
        </div>
      </div>
    ),
    size
  );
}
