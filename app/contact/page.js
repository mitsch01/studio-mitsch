import EmailForm from "@/components/EmailForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Miriam Schwartz for freelance web and app development projects.",
};

export default function Page() {
  return (
    <div>
      <Header logoColor="white" burgerColor="white" />

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Left: Image */}
        <div className="relative w-full h-[50vh] md:h-screen">
          <Image
            src="/images/contact-image.jpeg"
            alt="Contact"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Right: Form side */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-section">
          <h1 className="md:text-7xl text-6xl font-bold uppercase text-black mb-6 tracking-tight">
            Contact
          </h1>

          <p className="mb-6 text-gray-600 leading-relaxed">
            Got a project in mind, a question, or just want to say hello?
            I&apos;m always happy to hear from people who care about good design
            and thoughtful builds. Drop me a message below or find me on social
            media — I&apos;ll get back to you.
          </p>

          {/* Social links */}
          <div className="flex gap-4 mb-16">
            <Link
              href="https://github.com/mitsch01"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/miriam-schwartz-568aaa30b/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </Link>
          </div>

          <EmailForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}
