import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Error Code */}
        <div className="text-9xl font-bold text-gray-300">404</div>
        
        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-800">Page Not Found</h1>
        <p className="text-lg text-gray-600">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Illustration */}
        <div className="py-8">
          <div className="w-64 h-64 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
            <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="flex justify-center">
          <Button 
            onClick={handleBack}
            variant="outline" 
            className="gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}