import Header from "@/components/Header";
import bgVideo from '../assets/bg-video.mp4';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <video autoPlay muted loop className="absolute w-full h-full object-cover">
        <source type="video/mp4" src={bgVideo} />
      </video>
      {/* Header inside the video */} 
      <div className="absolute inset-0">
        <Header theme="dark"/>
      </div>
      {/* Headline over the video */}
      <div className="absolute inset-0 flex flex-col gap-3 items-center justify-center z-10">
        <h1 className="text-white text-4xl font-bold">
          Revolutionizing Anti-Counterfeiting
        </h1>
        <p className="text-lg text-white font-semibold text-center">Protect your brand and consumers with our cutting-edge blockchain solutions.<br/>
          Ensure authenticity,traceability,and trust in your supply chain
        </p>
        <Link to={'/home'}><Button variant={"outline"}>Get Started</Button></Link>
      </div>
    </main>
  );
};

export default HomePage;
