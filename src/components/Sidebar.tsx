
// Sidebar navigation component for the social media dashboard
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Info, 
  Users, 
  FileText, 
  Calendar,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  {
    title: 'Información General',
    href: '/',
    icon: Info,
    description: 'Productos, protocolos y recursos'
  },
  {
    title: 'Perfiles Sociales',
    href: '/perfiles',
    icon: Users,
    description: 'Gestión de cuentas y plataformas'
  },
  {
    title: 'Publicaciones',
    href: '/publicaciones',
    icon: FileText,
    description: 'Crear y gestionar contenido'
  },
  {
    title: 'Calendario Editorial',
    href: '/calendario',
    icon: Calendar,
    description: 'Planificación y programación'
  }
];

export const Sidebar = ({ className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold text-foreground">Miniland</h1>
              <p className="text-sm text-muted-foreground">Social Media Dashboard</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs opacity-70 truncate">{item.description}</div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Dashboard v1.0</p>
            <p>Gestión de Redes Sociales</p>
          </div>
        </div>
      )}
    </div>
  );
};
