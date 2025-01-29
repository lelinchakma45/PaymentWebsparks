import React, { useEffect } from 'react';
import { CHAT_URL } from '../config';

const Loading = () => {
    useEffect(() => {
        // Create and append Twitter pixel script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = `
            twq('event', 'tw-p1k9l-p1k9m', {
                conversion_id: null,
                email_address: null
            });
        `;
        document.body.appendChild(script);

        // Cleanup function to remove the script when component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []); // Empty dependency array means this runs once when component mounts

    return (
        <div className="bg-gradient-to-b from-black via-gray-900 to-black fixed inset-0 flex items-center justify-center text-white">
            <div className='bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-2xl min-w-96 md:min-w-96 min-h-48 flex items-center justify-center px-4'>
                <div className='text-center p-4'>
                    <h5 className='text-3xl font-bold mb-3'>Payment Success</h5>
                    <div className='bi bi-check-circle text-8xl text-green-500' />
                    <div className="text-white mt-4">
                        <div className="text-white mt-4">
                            <button
                                onClick={() => window.location.href = `${CHAT_URL}`}
                                className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/25`}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loading;