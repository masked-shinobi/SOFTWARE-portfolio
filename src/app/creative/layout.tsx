export default function CreativeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="creative-experience">
      {children}
    </div>
  );
}
