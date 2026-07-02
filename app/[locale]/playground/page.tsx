import PlaygroundClient from "./PlaygroundClient";

export const metadata = {
  title: "Playground",
  description:
    "An experimental creative space — AI haiku generator and interactive art by Miriam Schwartz.",
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
