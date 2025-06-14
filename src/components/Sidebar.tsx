
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Calendar,
  Users,
  Rocket,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    {
      name: "Información General",
      href: "/",
      icon: Home,
      current: location.pathname === "/",
    },
    {
      name: "Publicaciones",
      href: "/publicaciones",
      icon: FileText,
      current: location.pathname === "/publicaciones",
    },
    {
      name: "Calendario",
      href: "/calendario",
      icon: Calendar,
      current: location.pathname === "/calendario",
    },
    {
      name: "Perfiles Sociales",
      href: "/perfiles",
      icon: Users,
      current: location.pathname === "/perfiles",
    },
    {
      name: "Gestión de Lanzamientos",
      href: "/lanzamientos",
      icon: Rocket,
      current: location.pathname.startsWith("/lanzamientos"),
    },
  ];

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Social Media Manager
          </h2>
          <div className="space-y-1">
            <ScrollArea className="h-[300px] px-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={item.current ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      item.current && "bg-muted font-medium"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
