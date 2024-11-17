import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pricing from '../components/stripecheckout';
import { API_BASE_URL } from '../config';

export interface User {
    access_token: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    id: number;
    language: string;
    profile_pic: string;
    register_type: string;
    status: string;
    theme: string;
}

export interface UserPlan {
    name: string;
    plan_end_date: string;
    plan_start_date: string;
    remaining_chat_time: number;
    status: string;
}

export interface UserResponse {
    user: User;
    user_plan: UserPlan;
}

const Home = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const { access_token } = useParams<{ access_token: string }>();

    useEffect(() => {
        const validateUser = async () => {
            if (!access_token) {
                toast.error("No access token provided. Please login again.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/user/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch user data: ${response.status} ${response.statusText}`
                    );
                }

                const userData: UserResponse = await response.json();
                setUser(userData.user);
                setUserPlan(userData.user_plan);
            } catch (error) {
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : 'An unexpected error occurred';
                    
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.error('Authentication error:', errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        validateUser();
    }, [access_token]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user || !userPlan) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">No User Data Available</h2>
                    <p className="text-gray-600">Please try logging in again</p>
                </div>
            </div>
        );
    }

    return <Pricing user={user} userPlan={userPlan} />;
};

export default Home;