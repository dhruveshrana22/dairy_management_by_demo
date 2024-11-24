'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import getApiData from '@/helpers/apiHelper';
import { endpoint } from '@/config/siteconfig';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (values) => {
    console.log('Form Values:', values);

    const toastId = toast.loading('Submitting your data...');
    try {
      setLoading(true);
      const response = await getApiData(`${endpoint.signUp}`, values, 'POST');

      if (response?.status) {
        toast.success(response?.data?.message || 'Operation was successful', {
          id: toastId,
        });
        router.push('home');
      } else {
        toast.error(response?.message || 'An error occurred', {
          id: toastId,
        });
      }
    } catch (error) {
      console.error('Error during API call:', error);
      toast.error('Something went wrong. Please try again.', {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderError = (error) => {
    if (!error) return null;
    return (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters long',
                  },
                })}
                className={errors.name ? 'border-destructive' : ''}
              />
              {renderError(errors.name)}

              {/* testing */}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Enter a valid 10-digit phone number',
                  },
                })}
                className={errors.phoneNumber ? 'border-destructive' : ''}
              />
              {renderError(errors.phoneNumber)}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Please enter a valid email address',
                  },
                })}
                className={errors.email ? 'border-destructive' : ''}
              />
              {renderError(errors.email)}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                })}
                className={errors.password ? 'border-destructive' : ''}
              />
              {renderError(errors.password)}
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm">
                Already have an account?{' '}
                <Link href={'/'} className="text-blue-600 hover:text-blue-800">
                  Login
                </Link>
              </span>
            </div>

            {/* Submit Button */}
            <Button type="submit" loading={loading} className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInForm;
