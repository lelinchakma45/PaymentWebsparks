import { Rocket, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative">
                {/* Floating stars background */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white animate-pulse"
                            style={{
                                width: Math.random() * 3 + 'px',
                                height: Math.random() * 3 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                animationDuration: Math.random() * 3 + 1 + 's',
                                animationDelay: Math.random() * 2 + 's'
                            }}
                        />
                    ))}
                </div>

                {/* Main content */}
                <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-8">
                        <Rocket className="w-24 h-24 text-white animate-bounce" />
                    </div>

                    <h1 className="text-8xl font-bold text-white mb-4 tracking-wider">
                        4<span className="text-purple-400">0</span>4
                    </h1>

                    <h2 className="text-2xl font-light text-purple-200 mb-8">
                        Page Not Found!
                    </h2>

                    <p className="text-purple-200 mb-12 max-w-md mx-auto">
                        The page you're looking for has drifted into deep space or never existed in this universe.
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 group"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                            Go Back
                        </button>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 blur-sm" />
            </div>
        </div>
    );
}

export default NotFound;