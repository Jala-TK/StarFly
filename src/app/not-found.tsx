import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl mt-4 text-gray-500">Oops! The page you're looking for does not exist.</p>
        <Link href="/">
          <p className="btn btn-primary mt-6">Go back home</p>
        </Link>
      </div>
    </div>
  );
};
