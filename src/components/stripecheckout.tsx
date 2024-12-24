//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { API_BASE_URL } from '../config';
import { useParams } from 'react-router-dom';
import { User, UserPlan } from '../pages/Home';
import Meeting from './Meeting';

interface PricingPlan {
    id: string;
    title: string;
    subtitle: string;
    button: string;
    monthlyPrice?: string;
    yearlyPrice?: string;
    monthlyPlanId?: string; // Added monthly plan ID
    yearlyPlanId?: string;  // Added yearly plan ID
    list: string[];
    highlight?: boolean;
}

const PRICING_DATA: PricingPlan[] = [
    {
        id: 'Free',
        title: 'Free',
        subtitle: 'Perfect for getting started',
        button: 'Get Started',
        monthlyPrice: '$0',
        yearlyPrice: '$0',
        monthlyPlanId: 'null',
        yearlyPlanId: 'null',
        list: [
            "1 hour daily access",
            "Limited project creation",
            "Free access to images, drawing tools",
            "Web crawler functionality",
            "Basic email support",
            "Community forum access",
        ],
    },
    {
        id: 'Individual',
        id2:'Yearly',
        title: 'Professional',
        subtitle: 'Everything you need to grow',
        button: 'Get Professional',
        monthlyPrice: '$15',
        yearlyPrice: '$144',
        monthlyPlanId: 'prod_RPQBukYOseyuUD', // Monthly plan ID
        yearlyPlanId: 'prod_RSO2Ov4Pswv1Go',  // Yearly plan ID
        highlight: true,
        list: [
            "Unlimited project creation",
            "24/7 access",
            "Free access to images and drawing tools",
            "Advanced web crawler functionality",
            "Higher usage limits",
            "Priority enterprise-grade support",
        ]
    },
    {
        id: 'Enterprise',
        title: 'Enterprise',
        subtitle: 'Advanced features for teams',
        button: 'Contact Sales',
        monthlyPrice: 'Custom',
        yearlyPrice: 'Custom',
        monthlyPlanId: 'null',
        yearlyPlanId: 'null',
        list: [
            "Everything in Professional plan",
            "Unlimited team members",
            "Custom usage limits",
            "Dedicated account manager",
            "24/7 premium support",
            "Custom training sessions",
            "On-premises deployment options"
        ],
    },
];

const STRIPE_PUBLISHABLE_KEY = 'pk_live_51PxjW50608wKLaILUdG67qGTO74EAMqX5V53sDXkQ7mTYAp02OtgI9eimgdhZTvws2cobeXsyWdhlodbpGZsGCcM00RCIPxotw';

interface HeaderProps {
    user: User;
    userPlan: UserPlan;
}

const Pricing: React.FC<HeaderProps> = ({ user, userPlan }) => {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
    const [isYearly, setIsYearly] = useState(true);
    const [isMeetingOpen, setIsMeetingOpen] = useState(false);

    const { access_token } = useParams();

    useEffect(() => {
        if (!stripePromise) {
            setStripePromise(loadStripe(STRIPE_PUBLISHABLE_KEY));
        }
    }, []);

    const checkout = async (plan: PricingPlan) => {
        if (!stripePromise) {
            setError('Stripe has not been initialized');
            return;
        }

        // Get the appropriate plan ID based on billing period
        const productId = isYearly ? plan.yearlyPlanId : plan.monthlyPlanId;
        
        setIsLoading(productId);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/create-checkout-session-stripe-auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    product_id: productId,
                    other_data: {
                        plan_name: isYearly && plan.id2 ? plan.id2 : plan.id,
                        billing_period: isYearly ? 'yearly' : 'monthly'
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const { sessionId } = await response.json();
            if (!sessionId) throw new Error('No session ID returned from server');

            const stripe = await stripePromise;
            const { error: redirectError } = await stripe.redirectToCheckout({ sessionId });
            if (redirectError) throw redirectError;
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(null);
        }
    };

    const handlePlanBuy = async (plan: PricingPlan) => {
        if (plan.id === 'Enterprise') {
            setIsMeetingOpen(true);
            return;
        }

        if (!access_token) {
            setError('Please log in to purchase a plan');
            return;
        }
        
        const relevantPlanId = isYearly ? plan.yearlyPlanId : plan.monthlyPlanId;
        if (relevantPlanId === 'null') {
            return;
        }
        
        await checkout(plan);
    };

    return (
        <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white p-8 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="flex flex-col justify-center items-center mb-12 space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Welcome back, {user.full_name}
                        </h2>
                        <p className="text-xl text-gray-400">Choose the perfect plan for your needs</p>
                    </div>

                    <div className="flex flex-col items-center gap-6 bg-gray-900/50 p-6 rounded-2xl backdrop-blur-lg border border-gray-800">
                        <div className="flex items-center gap-8">
                            <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
                            <button
                                onClick={() => setIsYearly(!isYearly)}
                                className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none bg-gradient-to-r from-blue-600 to-purple-600"
                            >
                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                                    isYearly ? 'translate-x-9' : 'translate-x-1'
                                }`} />
                            </button>
                            <div className="flex flex-col items-start">
                                <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                                    Yearly
                                </span>
                                <span className="text-sm text-green-400 font-medium">Save 20%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PRICING_DATA.map((item) => (
                        <div key={item.id} className={`relative group transition-transform duration-300 hover:-translate-y-2`}>
                            {item.highlight && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}
                            <div className={`h-full rounded-2xl p-8 transition-colors duration-300
                                ${item.highlight 
                                    ? 'bg-gradient-to-b from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 hover:border-blue-400'
                                    : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                                }
                            `}>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-gray-400 mb-4">{item.subtitle}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">
                                            {isYearly ? item.yearlyPrice : item.monthlyPrice}
                                        </span>
                                        {item.id !== 'Enterprise' && (
                                            <span className="text-gray-400">
                                                /{isYearly ? 'year' : 'month'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => handlePlanBuy(item)}
                                    disabled={isLoading === (isYearly ? item.yearlyPlanId : item.monthlyPlanId) || item.id === userPlan.name}
                                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 mb-6
                                        ${item.highlight
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/25'
                                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                                        } 
                                        ${isLoading === (isYearly ? item.yearlyPlanId : item.monthlyPlanId) ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {isLoading === (isYearly ? item.yearlyPlanId : item.monthlyPlanId) ? 'Processing...' : 
                                     item.id === userPlan.name ? 'Current Plan' : item.button}
                                </button>

                                <ul className="space-y-4">
                                    {item.list.map((feature, index) => (
                                        <li className="flex items-start gap-3" key={index}>
                                            <span className="text-green-400 mt-1">✓</span>
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-gray-500 text-sm text-center mt-12">
                    Powered by Websparks Corporation
                </p>
            </div>
            <Meeting 
                meetingOpen={isMeetingOpen} 
                handleMeetingClose={() => setIsMeetingOpen(false)} 
            />
        </div>
    );
};

export default Pricing;