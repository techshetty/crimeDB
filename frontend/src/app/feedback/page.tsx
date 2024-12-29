'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Loader2, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FeedbackFormData {
  name: string;
  rating: number;
  comments: string;
}

const FeedbackPage = () => {
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    rating: 0,
    comments: ''
  });

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!formData.comments.trim()) {
      toast.error('Please enter your feedback comments');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Feedback submitted successfully');
        setFormData({
          name: '',
          rating: 0,
          comments: ''
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit feedback');
    }
    setLoading(false);
  };

  const RatingStars = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
        title="sub"
          key={star}
          type="button"
          className="focus:outline-none transition-colors"
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setFormData({ ...formData, rating: star })}
        >
          <Star
            className={`h-8 w-8 ${
              star <= (hoveredRating || formData.rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Share Your Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name*</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter your full name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Rating*</label>
            <RatingStars />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Comments*</label>
            <Textarea
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
              placeholder="Tell us about your experience"
              className="w-full min-h-[150px]"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            * All fields are required
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;