import Header from "@/components/layout/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header defaultView="public" />
      {children}
    </div>
  );
}