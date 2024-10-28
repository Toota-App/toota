from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, EmailVerification

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    google_id = serializers.CharField(max_length=50, required=False, allow_null=True)
    apple_id = serializers.CharField(max_length=50, required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'google_id', 'apple_id']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        google_id = validated_data.get('google_id')
        apple_id = validated_data.get('apple_id')

        # Check that only one login method is provided
        if google_id and apple_id:
            raise serializers.ValidationError("Only one login method (Google or Apple) should be provided.")
        if not google_id and not apple_id and not password:
            raise serializers.ValidationError("Password is required if not using Google or Apple login.")

        # Create user with email and password
        user = CustomUser.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        
        # Generate OTP for email verification
        EmailVerification.objects.create(user=user)
        return user


class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=4)

    def validate(self, data):
        email = data.get('email')
        otp = data.get('otp')

        try:
            user = CustomUser.objects.get(email=email)
            verification = user.email_verification
            if verification.otp != otp:
                raise serializers.ValidationError("Invalid OTP.")
            verification.is_verified = True
            verification.save()
            user.is_active = True  # Activate the user account after successful verification
            user.save()
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        except EmailVerification.DoesNotExist:
            raise serializers.ValidationError("No OTP verification record found for this user.")
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, required=False)
    google_id = serializers.CharField(max_length=50, required=False, allow_null=True)
    apple_id = serializers.CharField(max_length=50, required=False, allow_null=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        google_id = data.get('google_id')
        apple_id = data.get('apple_id')

        # Login with email and password
        if password:
            user = authenticate(email=email, password=password)
            if user is None:
                raise serializers.ValidationError("Incorrect email or password.")
        
        # Login with Google ID
        elif google_id:
            try:
                user = CustomUser.objects.get(email=email, google_id=google_id)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError("No account associated with this Google ID.")
        
        # Login with Apple ID
        elif apple_id:
            try:
                user = CustomUser.objects.get(email=email, apple_id=apple_id)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError("No account associated with this Apple ID.")
        
        else:
            raise serializers.ValidationError("Password, Google ID, or Apple ID is required for login.")

        if not user.is_active:
            raise serializers.ValidationError("This account is not active. Please verify your email.")
        
        data['user'] = user
        return data

