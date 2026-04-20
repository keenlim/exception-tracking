import { resetStore } from '@/features/exceptions';
import { PAGE_ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router';

const NAV_LINKS = [
  { label: 'Dashboard', href: PAGE_ROUTES.DASHBOARD },
  { label: 'My Tasks', href: PAGE_ROUTES.MY_TASKS },
  { label: 'Upload CSV', href: PAGE_ROUTES.UPLOAD },
] as const;

export function Navbar() {
  const { pathname } = useLocation();

  function handleReset() {
    if (window.confirm('Reset all demo data? This cannot be undone.')) {
      resetStore();
      window.location.reload();
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="max-w-site flex-between mx-auto px-6 py-4">
        <Link to={PAGE_ROUTES.DASHBOARD} className="text-xl font-bold tracking-tight">
          CPF Exceptions
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleReset}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </nav>
  );
}
