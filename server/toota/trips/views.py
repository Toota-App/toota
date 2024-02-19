from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView as Token

from .serializers import UserSerializer, LoginSerializer


class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    
class LoginView(Token):
    serializer_class = LoginSerializer

