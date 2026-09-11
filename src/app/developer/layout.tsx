export default function DeveloperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="developer-experience">
      {children}
    </div>
  );
}
