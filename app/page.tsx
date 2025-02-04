import TaxCalculator from '@/components/tax-calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            TaxCalc
          </h1>
          <p className="text-muted-foreground">
            Compare your tax liability under both new and old tax regimes
          </p>
        </div>
        <TaxCalculator />
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        Made with ❤️ by Subhash Gottumukkala
      </footer>
    </main>
  );
}