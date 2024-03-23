import jwt
import os
from rest_framework import generics, status, views, permissions
from rest_framework_simplejwt.views import TokenObtainPairView as Token, TokenVerifyView
from rest_framework.response import Response
from .serializers import UserSerializer, LoginUserSerializer, DriverSerializer, VerifyUserEmailSerializer, VerifyDriverEmailSerializer, LoginDriverSerializer, ResetPasswordEmailRequestSerializer, SetNewPasswordSerializer
from .models import  Driver, User
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.shortcuts import redirect
from django.http import HttpResponsePermanentRedirect


class CustomRedirect(HttpResponsePermanentRedirect):

    allowed_schemes=[os.environ.get('APP_SCHEME'), 'http', 'https']

class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated]
    
class UserSignUpView(generics.GenericAPIView):
    serializer_class = UserSerializer
    
    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        user_data = serializer.data
        user=User.objects.get(email=user_data['email'])

        token = RefreshToken.for_user(user).access_token
        current_site = get_current_site(request).domain
        relative_link = reverse('verify-user')
        abs_url = 'http://'+current_site+relative_link+"?token="+str(token)
        email_body=f'Hey {user.full_name} \nThank you for signing up for a Toota account, just one more step!\nFor security purposes, Please verify your email address using the link below \n {abs_url}'
        data={
            'email_body': email_body,
            'domain': abs_url, 
            'to_email': user.email,
            'email_subject': 'Please verify your Toota Account'}
        Util.send_email(data)
        return Response(user_data, status=status.HTTP_201_CREATED)


class LoginUserView(Token):
    serializer_class = LoginUserSerializer
    
    
class VerifyEmailUser(views.APIView):
    serializer_class = VerifyUserEmailSerializer

    token_param_config=openapi.Parameter(
        'token', 
        in_=openapi.IN_QUERY, 
        description='Description',
        type=openapi.TYPE_STRING)
    @swagger_auto_schema(manual_parameters=[token_param_config])
    def post(self, request):
        token = request.data['token']

        try:
            payload = AccessToken(token)
            user = User.objects.get(id=payload['user_id'])

            if not user.is_verified:
                user.is_verified = True
                user.save()

            return Response({'account': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': "Activation link expired"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    


class LoginDriverView(Token):
    serializer_class = LoginDriverSerializer
    
    
class RequestUserPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        data = {'request': request, 'data': request.data}
        serializer = self.serializer_class(data=data)
        email = request.data['email']
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request=request).domain
            relative_link = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            redirect_url = request.data.get('redirect_url', '')
            abs_url = f'http://{current_site}{relative_link}'
            email_body=f"Hey {user.full_name} \n\n It seems like you've requested a password reset for your Toota account.No worries, we've got you covered!\nTo reset your password, please follow the link below:\n{abs_url}?redirect_url={redirect_url}\n\nIf you did not request this password reset, please ignore this email. Your account is secure, and no changes have been made.\n\nToota Support Team"
            data={
                'email_body': email_body,
                'domain': abs_url, 
                'to_email': user.email,
                'email_subject': 'Reset your Password'
            }
            Util.send_email(data)
        return Response({'success': 'We have sent a link to reset your password'}, status=status.HTTP_200_OK)
    
    
class PasswordUserTokenCheck(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    def get(self, request, uidb64, token):
        redirect_url = request.GET.get('redirect_url')
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                if len(redirect_url) > 3:
                    return CustomRedirect(redirect_url+'?token_valid=False')
                else:
                    return CustomRedirect(os.environ.get('FRONTEND_URL', '')+'?token_valid=False')

            return CustomRedirect(redirect_url+'?token_valid=True&message=Credentials Valid&uidb64='+uidb64+'&token='+token)

        except DjangoUnicodeDecodeError as identifier:
           return CustomRedirect(f'{redirect_url}?token_valid=False')
       
    
class DriverSignUpView(generics.GenericAPIView):
    serializer_class = DriverSerializer
    
    def post(self, request):
        driver = request.data
        serializer = self.serializer_class(data=driver)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        driver_data = serializer.data
        
        driver=Driver.objects.get(email=driver_data['email'])

        token = RefreshToken.for_user(driver).access_token
        current_site = get_current_site(request).domain
        relative_link = reverse('verify-driver')
        abs_url = f'http://{current_site}{relative_link}?token={token}'
        email_body=f'Hey {driver.full_name} \n\nThank you for signing up for a Toota account, just one more step!.\n\nFor security purposes, Please verify your email address using the link below \n {abs_url}'
        data={
            'email_body': email_body,
            'domain': abs_url, 
            'to_email': driver.email,
            'email_subject': 'Please verify your Toota Account'}
        Util.send_email(data)
        return Response(driver_data, status=status.HTTP_201_CREATED)
    
class DriverProfileView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated]
    
class VerifyEmailDriver(views.APIView):
    serializer_class = VerifyDriverEmailSerializer

    token_param_config=openapi.Parameter(
        'token', 
        in_=openapi.IN_QUERY, 
        description='Description',
        type=openapi.TYPE_STRING)
    @swagger_auto_schema(manual_parameters=[token_param_config])
    def post(self, request):
        token = request.data['token']

        try:
            payload = AccessToken(token)
            user = Driver.objects.get(id=payload['user_id'])

            if not user.is_verified:
                user.is_verified = True
                user.save()

            return Response({'account': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': "Activation link expired"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    


    
class RequestDriverPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        data = {'request': request, 'data': request.data}
        serializer = self.serializer_class(data=data)
        email = request.data['email']
        if Driver.objects.filter(email=email).exists():
            user = Driver.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request=request).domain
            relative_link = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            redirect_url = request.data.get('redirect_url', '')
            abs_url = f'http://{current_site}{relative_link}'
            email_body=f"Hey {user.full_name} \n\n It seems like you've requested a password reset for your Toota account.No worries, we've got you covered!\nTo reset your password, please follow the link below:\n{abs_url}?redirect_url={redirect_url}\n\nIf you did not request this password reset, please ignore this email. Your account is secure, and no changes have been made.\n\nToota Support Team"
            data={
                'email_body': email_body,
                'domain': abs_url, 
                'to_email': user.email,
                'email_subject': 'Reset your Password'
            }
            Util.send_email(data)
        return Response({'success': 'We have sent a link to reset your password'}, status=status.HTTP_200_OK)



class PasswordDriverTokenCheck(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    def get(self, request, uidb64, token):
        redirect_url = request.GET.get('redirect_url')
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = Driver.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                if len(redirect_url) > 3:
                    return CustomRedirect(redirect_url+'?token_valid=False')
                else:
                    return CustomRedirect(os.environ.get('FRONTEND_URL', '')+'?token_valid=False')

            return CustomRedirect(redirect_url+'?token_valid=True&message=Credentials Valid&uidb64='+uidb64+'&token='+token)

        except DjangoUnicodeDecodeError as identifier:
           return CustomRedirect(f'{redirect_url}?token_valid=False')


class SetNewPasswordAPIVIew(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'sucess': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)
 
