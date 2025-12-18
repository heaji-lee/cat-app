import { Card } from "@heroui/react";
import Moo1 from "../assets/images/moo1.jpeg";
import Moo2 from "../assets/images/moo2.jpeg";
import Moo3 from "../assets/images/moo3.jpeg"; 
import Moo4 from "../assets/images/moo4.jpeg";

const mooImages = [Moo1, Moo2, Moo3, Moo4];

export default function Moo() {
  return (
    <div className="h-full flex flex-col p-4 gap-7">
      <h1 className="text-3xl font-bold mb-4">Hi I'm Moo 😺</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mooImages.map((img, idx) => (
          <Card key={idx} className="relative aspect-square overflow-hidden rounded-2xl">
            <img
              src={img}
              alt={`Moo ${idx + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </Card>
        ))}
      </div>

      <div className="text-center text-gray-700 text-lg bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md mt-6">
        <p>Hi there!👋 I'm glad you made it here 😸</p>
        <p>I'm Moo 🐮, born in March, 2022. I live in New Zealand 🇳🇿</p>
        <p>I hope you're enjoying navigating this app! 🚀</p>
        <p>Have a lovely day 😸</p>
      </div>
    </div>
  )
}