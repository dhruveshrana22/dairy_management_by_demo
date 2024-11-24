'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { endpoint } from '@/config/siteconfig';
import getApiData from '@/helpers/apiHelper';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store';
import { setToken } from '@/store/authSlice';

const LoginForm = () => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      loginType: 'email', // Default login type
      email: '',
      phone: '',
      password: '',
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { token, authState } = useAppSelector((state) => state.auth);
  console.log('token: authState ', token, authState);

  const dispatch = useAppDispatch();

  const loginType = watch('loginType'); // Watch for login type changes

  const onSubmit = async (data) => {
    const payload = {
      loginType: data.loginType,
      ...(data.loginType === 'email' ? { email: data.email } : { phone: data.phone }),
      password: data.password,
    };

    const toastId = toast.loading('Submitting your data...');
    try {
      setLoading(true);
      const response = await getApiData(`${endpoint.logIn}`, payload, 'POST');

      if (response?.status) {
        toast.success(response.data?.message || response.message || 'Operation was successful', {
          id: toastId,
        });

        if (response?.token) {
          dispatch(setToken(response?.token));
        }

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login to Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Login Method</Label>
              <Controller
                name="loginType"
                control={control}
                render={({ field }) => (
                  <Select {...field} onValueChange={(value) => setValue('loginType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select login method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Mobile Number</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {loginType === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email format',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                  )}
                />
                {errors.email && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.email.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {loginType === 'phone' && (
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/,
                      message: 'Invalid phone number',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phone"
                      type="tel"
                      placeholder="Enter your mobile number"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                  )}
                />
                {errors.phone && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.phone.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className={errors.password ? 'border-destructive' : ''}
                  />
                )}
              />
              {errors.password && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.password.message}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm">
                Don&apos;t have an account?{' '}
                <Link href={'/signup'} className="text-blue-600 hover:text-blue-800">
                  Sign Up
                </Link>
              </span>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
