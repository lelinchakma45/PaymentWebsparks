//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { API_BASE_URL } from '../config';
import { useParams } from 'react-router-dom';
import { User, UserPlan } from '../pages/Home';
// import useUser from '~/types/user';

// Types and Interfaces
interface PricingPlan {
    id: string;
    title: string;
    subtitle: string;
    button: string;
    price: string;
    plan: string;
    list: string[];
}
// Pricing Data
const PRICING_DATA: PricingPlan[] = [
    {
        id: 'Free',
        title: 'Free',
        subtitle: 'Basic features to get started',
        button: 'Select Free Plan',
        price: 'free',
        plan: 'null',
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
        title: 'Professional $15/month',
        subtitle: 'Pay monthly/billed annually',
        button: 'Select Professional',
        price: '',
        plan: 'prod_RPQBukYOseyuUD',
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
        title: 'Enterprise Custom pricing',
        subtitle: 'Tailored solutions for large teams',
        button: 'Schedule a meeting',
        price: '',
        plan: 'null',
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

// Constants
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51PxjW50608wKLaILUdG67qGTO74EAMqX5V53sDXkQ7mTYAp02OtgI9eimgdhZTvws2cobeXsyWdhlodbpGZsGCcM00RCIPxotw';

interface HeaderProps{
    user: User;
    userPlan: UserPlan;
}
const Pricing:React.FC<HeaderProps> = ({user, userPlan}) => {
    // const { getStoredToken } = useUser();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

    const {access_token} = useParams();

    // Initialize Stripe on component mount
    useEffect(() => {
        if (!stripePromise) {
            setStripePromise(loadStripe(STRIPE_PUBLISHABLE_KEY));
        }
    }, []);

    const checkout = async (plan: string) => {
        if (!stripePromise) {
            setError('Stripe has not been initialized');
            return;
        }

        setIsLoading(plan);
        setError(null);

        try {
            // Create checkout session
            const response = await fetch(`${API_BASE_URL}/create-checkout-session-stripe-auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    product_id: plan,
                    other_data:{
                        plan_name : 'Individual'
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const { sessionId } = await response.json();

            if (!sessionId) {
                throw new Error('No session ID returned from server');
            }

            // Get Stripe instance
            const stripe = await stripePromise;

            // Redirect to checkout
            const { error: redirectError } = await stripe.redirectToCheckout({
                sessionId: sessionId
            });

            if (redirectError) {
                throw redirectError;
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(null);
        }
    };

    const handlePlanBuy = async (plan: PricingPlan) => {
        if (!access_token) {
            setError('Please log in to purchase a plan');
            return;
        }
        if (plan.plan === 'null') {
            return;
        }
        await checkout(plan.plan);
    };

    return (

        <div className="bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                {error && (
                    <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="flex flex-col justify-center items-center mb-6">
                    <h2 className="text-2xl font-bold my-3">
                        You are {user.full_name}. Right?
                    </h2>
                    <h2 className="text-2xl font-bold my-3">
                        Upgrade your workspace for unlimited value
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                        <span>Choose Your Plan</span>
                        <div className="w-8 h-4 bg-green-500 rounded-full"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PRICING_DATA.map((item) => (
                        <div key={item.id}>
                            <div
                                className={`rounded-2xl p-6 ${item.id === 'Free' || item.id === userPlan.name
                                        ? 'border border-gray-800'
                                        : item.id === 'Individual'
                                            ? 'bg-gradient-to-br from-blue-600 to-blue-400'
                                            : 'bg-gradient-to-br from-red-500 via-red-400 to-pink-500'
                                    } mb-4`}
                            >
                                <div className="mb-3">
                                    <h3 className="text-xl mb-1">{item.title}</h3>
                                    <p className={`text-sm ${item.id === 'free'
                                            ? 'text-gray-400'
                                            : 'opacity-80'
                                        }`}>
                                        {item.subtitle}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handlePlanBuy(item)}
                                    disabled={isLoading === item.plan || item.id === userPlan.name }
                                    className={`w-full py-2 px-4 rounded-lg border border-gray-700 mb-0 
                                            ${isLoading === item.plan ? 'opacity-50 cursor-not-allowed' : ''}
                                            ${item.id === 'Individual' ? 'bg-white text-blue-600' :
                                            item.id === 'Enterprise' ? 'bg-white text-red-600' : 'text-white'}`}
                                >
                                    {isLoading === item.plan ? 'Processing...' : item.id === userPlan.name ? 'Your Current Plan' : item.button}
                                </button>
                            </div>
                            <ul className="space-y-4">
                                {item.list.map((feature, index) => (
                                    <li className="flex items-start gap-2" key={index}>
                                        <i className="w-5 h-5 text-white mt-0.5 bi bi-check2 text-green-500"></i>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <p className="text-gray-500 text-sm text-center mt-8">
                    Powered by Websparks Corporation.
                </p>
            </div>
        </div>
    );
};

export default Pricing;
