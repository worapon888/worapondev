export default function Showcase() {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "A modern online shopping experience",
      image: "/placeholder-1.jpg",
    },
    {
      title: "Social Network",
      description: "Connect with people around the world",
      image: "/placeholder-2.jpg",
    },
    {
      title: "Task Manager",
      description: "Organize your work efficiently",
      image: "/placeholder-3.jpg",
    },
    {
      title: "Analytics Dashboard",
      description: "Track your business metrics",
      image: "/placeholder-4.jpg",
    },
  ];

  return (
    <section id="showcase" className="py-20 sm:py-32">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Our Work
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Check out some of our recent projects
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <div
            key={project.title}
            className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-colors"
          >
            <div className="aspect-[4/3] bg-gray-800">
              {/* Add actual images here */}
              <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="mt-2 text-gray-300">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
