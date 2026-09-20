export default function CreativeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="creative-experience"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
}
