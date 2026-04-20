interface SiteFooterProps {
  creditText?: string;
}

export function SiteFooter({ creditText = 'CPF Board · Exception Tracker POC' }: SiteFooterProps) {
  return (
    <footer className="w-full border-t bg-black">
      <div className="max-w-site mx-auto px-6 py-6">
        <p className="text-sm text-white">{creditText}</p>
      </div>
    </footer>
  );
}
