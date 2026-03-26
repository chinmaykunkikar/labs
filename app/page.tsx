import Link from "next/link";

const experiments = [
  {
    slug: "scroll-frames",
    title: "Scroll-driven frame sequencer",
    description:
      "Apple-style scroll-driven video frames on canvas with synchronized text animations.",
  },
  {
    slug: "graceful-spinner",
    title: "Graceful spinner completion",
    description:
      "A refresh button spinner that finishes its current rotation before stopping.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Labs</h1>
      <p className="mt-2 text-sm text-gray-500">
        Small experiments and interactive demos.
      </p>
      <ul className="mt-8 space-y-4">
        {experiments.map((exp) => (
          <li key={exp.slug}>
            <Link
              href={`/${exp.slug}`}
              className="block rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-gray-300"
            >
              <span className="text-sm font-medium">{exp.title}</span>
              <p className="mt-0.5 text-xs text-gray-400">
                {exp.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
