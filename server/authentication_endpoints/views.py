from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, OTPVerificationSerializer, LoginSerializer
from .models import CustomUser, EmailVerification
from django.core.mail import send_mail
from django.conf import settings

class RegisterView(APIView):
    """
    Handles user registration with either email/password, Google ID, or Apple ID.
    """
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send OTP to the user's email for verification
            verification = user.email_verification
            send_mail(
                'Your OTP for Email Verification',
                f'Your OTP code is: {verification.otp}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )

            return Response({
                "message": "Registration successful. Please check your email for the OTP."
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerificationView(APIView):
    """
    Verifies the OTP sent to the user's email during registration.
    """
    def post(self, request, *args, **kwargs):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            return Response({
                "message": "Email verification successful. Your account is now active."
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Allows user login with email/password, Google ID, or Apple ID.
    """
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Create a login token or response data as needed
            return Response({
                "message": "Login successful.",
                "user_id": user.id,
                "email": user.email,
                # Include any additional info like tokens here if needed
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

