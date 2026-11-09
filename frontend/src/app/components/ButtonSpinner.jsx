import { LoaderCircle } from "lucide-react";

export default function ButtonSpinner({ className = "size-4" }) {
  return (
    <LoaderCircle
      aria-hidden="true"
      className={`shrink-0 animate-spin ${className}`}
    />
  );
}
