import Header from "../components/Header";

const features = [
  {
    img: "/img/home/features/ai.png",
    title: "AI Powered",
    text: "After writing a daily journal, a machine learning algorithm will derive your sentiments and help you understand how you’re feeling, when no one else can.",
  },
  {
    img: "/img/home/features/analysis.png",
    title: "Curated Analysis",
    text: "Analyze your emotions and receive customized resources matching your sentiment composition, along with graphs to study your emotional progress.",
  },
  {
    img: "/img/home/features/assist.png",
    title: "Interactive Assistance",
    text: "Receive and complete daily tasks tailored to combat negative emotions you may be feeling and foster positive ones to enhance wellness.",
  },
];

export default function Home() {
  return (
    <main className="flex-grow">
      <Header />
      {/* Hero */}
      <div
        className="bg-cover bg-gray-900 bg-no-repeat bg-center min-h-screen flex items-center relative overflow-hidden"
        style={{
          backgroundImage: `url(/img/home/hero.png)`,
        }}
      >
        <div className="container mx-auto relative sm:pb-12 sm:pt-9 md:pt-6 xl:pt-0">
          <main className="mt-5">
            <h1 className="h1 text-6xl text-white mb-4">Welcome to Mindful</h1>
            <p className="text-gray-400 text-3xl">
              The app that's there to help when no one else can.
            </p>
          </main>
        </div>
      </div>
      {/* Features */}
      <div className="flex flex-col bg-black px-2 md:px-8 py-8">
        <h1 className="text-white text-6xl text-center mb-12">Features</h1>
        <div className="flex space-x-12 container mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col border border-1 border-gray-600 rounded-lg p-4"
            >
              <img className="block h-12 w-12 mb-4" src={f.img} alt={f.title} />
              <h1 className="text-xl text-white mb-2">{f.title}</h1>
              <p className="text-gray-500">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
