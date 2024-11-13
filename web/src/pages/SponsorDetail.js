import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const SponsorDetail = () => {
    const { id } = useParams();
    const [sponsor, setSponsor] = useState(null);
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/sponsor/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setSponsor(data);
            setRating(typeof data.average_rating === 'number' ? data.average_rating : 0);
        })
        .catch(error => console.error('Error fetching sponsor:', error));
    }, [id]);

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const submitRating = async () => {
        if (!isAuthenticated) {
            alert('You must be logged in to rate.');
            navigate('/');
            return;
        }
        try {
            await fetch('/rate_sponsor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    sponsor_id: id,
                    rating: parseInt(rating, 10)
                })
            });
            alert('Rating submitted successfully!');
            setUserRating(rating);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    return (
        <div>
            {sponsor && (
                <>
                    <h1>{sponsor.organization_name}</h1>
                    <p><strong>Sponsorship Budget:</strong> {sponsor.sponsorship_budget}</p>
                    <p><strong>College Tier Requirement:</strong> {sponsor.college_tier_requirement}</p>
                    <p><strong>Crowd Requirements:</strong> {sponsor.crowd_requirements}</p>
                    <p><strong>Average Rating:</strong> {rating.toFixed(1)}</p>
                    <h2>Rate this Sponsor</h2>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={handleRatingChange}
                    />
                    <button onClick={submitRating}>Submit Rating</button>
                    <p>Your Rating: {userRating || 'No rating yet'}</p>
                    {sponsor.whatsapp_number && (
                        <a href={`https://wa.me/${sponsor.whatsapp_number}`} target="_blank" rel="noopener noreferrer">
                            Chat on WhatsApp
                        </a>
                    )}
                </>
            )}
        </div>
    );
};

export default SponsorDetail;
