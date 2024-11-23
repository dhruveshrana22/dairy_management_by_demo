'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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

import { useRouter } from 'next/navigation';
import { getApiData } from '@/helpers/apiHelper';
import { BaseUrl, endpoint } from '@/config/siteconfig';
import toast from 'react-hot-toast';

type FormData = {
  loginType: 'email' | 'phone';
  email?: string;
  phone?: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      loginType: 'email',
    },
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const loginType = watch('loginType');

  const onSubmit = async (data: FormData) => {
    const payload = {
      loginType: data.loginType,
      ...(data.loginType === 'email' ? { email: data.email } : { phone: data.phone }),
      password: data.password,
    };
    console.log('payload onSubmit', payload);
    const toastId = toast.loading('Submitting your data...');
    try {
      setLoading(true);
      const response = await getApiData('post', `${BaseUrl}${endpoint.logIn}`, payload);

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
      console.log('Error during API call:', error);
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
            {/* Login Type */}
            <div className="space-y-2">
              <Label>Login Method</Label>
              <Select
                value={loginType}
                onValueChange={(value) => setValue('loginType', value as 'email' | 'phone')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select login method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Mobile Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email or Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="loginValue">
                {loginType === 'email' ? 'Email Address' : 'Mobile Number'}
              </Label>
              <Input
                id="loginValue"
                type={loginType === 'email' ? 'email' : 'text'}
                placeholder={`Enter your ${loginType === 'email' ? 'email' : 'mobile number'}`}
                {...register(loginType === 'email' ? 'email' : 'phone', {
                  required: `Please enter your ${
                    loginType === 'email' ? 'email' : 'mobile number'
                  }`,
                  pattern:
                    loginType === 'email'
                      ? {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Please enter a valid email address',
                        }
                      : {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit mobile number',
                        },
                })}
                className={
                  errors[loginType === 'email' ? 'email' : 'phone'] ? 'border-destructive' : ''
                }
              />
              {errors[loginType === 'email' ? 'email' : 'phone'] && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors[loginType === 'email' ? 'email' : 'phone']?.message}
                  </AlertDescription>
                </Alert>
              )}
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
              {errors.password && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.password.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" loading={loading} className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
