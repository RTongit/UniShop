export default function PasswordSideImage() {
  return (
    <aside className="relative hidden min-h-[600px] overflow-hidden bg-slate-100 lg:block">
      <img
        src="/forgot-passwordSideImage.jpg"
        alt="Students sharing items on campus"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </aside>
  );
}
