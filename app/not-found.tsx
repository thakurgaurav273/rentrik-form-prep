import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Home, Image, FileText } from "lucide-react";

export default function NotFound() {
  return (
    <Container as="main" className="py-20 text-center space-y-6">
      <div className="space-y-2">
        <p className="text-6xl font-bold text-muted-foreground/30">404</p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist. Try one of our tools below.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={cn(buttonVariants({ variant: "default" }), "gap-2")}>
          <Home className="h-4 w-4" aria-hidden />
          Go home
        </Link>
        <Link href="/image" className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
          <Image className="h-4 w-4" aria-hidden />
          Image tools
        </Link>
        <Link href="/pdf" className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
          <FileText className="h-4 w-4" aria-hidden />
          PDF tools
        </Link>
      </div>
    </Container>
  );
}
