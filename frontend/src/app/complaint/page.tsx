'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ComplaintFormData {
  name: string;
  email: string;
  phone: string;
  details: string;
}

const ComplaintPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ComplaintFormData>({
    name: '',
    email: '',
    phone: '',
    details: ''
  });

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^\d{10}$/.test(phone);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }
    if (!validatePhone(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.details.trim()) {
      toast.error('Please enter complaint details');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/newcomplaint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Complaint registered successfully');
        setFormData({
          name: '',
          email: '',
          phone: '',
          details: ''
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register complaint');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Register New Complaint
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Applicant Name*</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter your full name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address*</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter your email"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number*</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Complaint Details*</label>
            <Textarea
              value={formData.details}
              onChange={(e) => setFormData({...formData, details: e.target.value})}
              placeholder="Provide detailed information about your complaint"
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
                'Submit Complaint'
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

export default ComplaintPage;