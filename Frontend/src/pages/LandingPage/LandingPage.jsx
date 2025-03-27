import React from 'react';
import { Activity, CheckCircle, Rocket } from 'lucide-react';
import { SignInButton,  useAuth  } from '@clerk/clerk-react'
import './LandingPage.css';
import { Navigate } from 'react-router-dom';

const LandingPage = () => {

    const { isSignedIn} = useAuth();

    if (isSignedIn) {
        return <Navigate to="/dashboard" replace />;
      }
    

    return (
        <div className="landing-page-container">
            <div className="landing-page-card">
                <h1 className="landing-page-title">TaskMaster</h1>
                <p className="landing-page-subtitle">Your ultimate productivity companion</p>

                <div className="landing-page-features">
                    <div className="landing-page-feature">
                        <CheckCircle className="landing-page-icon check-icon" />
                        <p>Manage Tasks Effortlessly</p>
                    </div>
                    <div className="landing-page-feature">
                        <Rocket className="landing-page-icon rocket-icon" />
                        <p>Boost Your Productivity</p>
                    </div>
                    <div className="landing-page-feature">
                        <Activity className="landing-page-icon activity-icon" />
                        <p>Track Your Progress</p>
                    </div>
                </div>
                <div className="landing-page-buttons">
                    <SignInButton>
                        <button className="landing-page-primary-button">Get Started</button>
                    </SignInButton>
                    <button className="landing-page-secondary-button">Learn More</button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
