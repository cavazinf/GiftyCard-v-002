import { Play, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Gift Cards da Próxima Geração
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Transforme gift cards em NFTs com Token Bound Accounts (ERC-6551). 
            Emissão ultra-barata, privacidade com ZK Proofs e liquidação instantânea.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary px-8 py-3 hover:bg-gray-50">
              <Play className="w-4 h-4 mr-2" />
              Ver Demo
            </Button>
            <Button variant="outline" className="border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-primary">
              <Book className="w-4 h-4 mr-2" />
              Documentação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
