export default function CenterContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-[30%]">
      <div className="h-dvh w-full flex flex-col justify-center items-center">{children}</div>
    </div>)
}