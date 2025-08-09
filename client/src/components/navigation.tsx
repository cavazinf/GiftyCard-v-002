import { Link, useLocation } from "wouter";
import { Gift, Plus, User } from "lucide-react";

interface NavigationProps {
  user?: {
    name: string;
    email: string;
  };
}

export default function Navigation({ user }: NavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", active: location === "/" },
    { href: "/gift-cards", label: "Gift Cards", active: location === "/gift-cards" },
    { href: "/merchants", label: "Comerciantes", active: location === "/merchants" },
    { href: "/analytics", label: "Analíticos", active: location === "/analytics" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">GIFTY</span>
              <span className="ml-1 text-xs bg-primary text-white px-2 py-1 rounded-full">BETA</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`px-1 pt-1 pb-4 text-sm font-medium border-b-2 cursor-pointer ${
                      item.active
                        ? "text-primary border-primary"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/gift-cards/new">
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                <Plus className="w-4 h-4 mr-2 inline" />
                Novo Gift Card
              </button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name || "João Silva"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
