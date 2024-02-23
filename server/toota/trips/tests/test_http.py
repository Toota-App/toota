import base64
import json
import datetime
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase


from trips.models import User, EmailVerificationToken, Trip, PickupLocation

PASSWORD = 'pAssw0rd!'


def create_user(username='user', password=PASSWORD):
    return get_user_model().objects.create_user(
        username=username,
        first_name='Test',
        last_name='User',
        password=password
    )

class AuthenticationTest(APITestCase):
    def test_user_can_sign_up(self):
        response = self.client.post(reverse('sign_up'), data={
            'username': 'user123',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'testuser@gmail.com',
            'password1': PASSWORD,
            'password2': PASSWORD,
        })
        user = get_user_model().objects.last()
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(response.data['id'], user.id)
        self.assertEqual(response.data['username'], user.username)
        self.assertEqual(response.data['first_name'], user.first_name)
        self.assertEqual(response.data['last_name'], user.last_name)
        self.assertEqual(response.data['email'], user.email)
        
    def test_user_login(self):
        user = create_user()
        response = self.client.post(reverse('login'), data={
            'username': user.username,
            'password': PASSWORD
        })
        access = response.data['access']
        header, payload, signature = access.split('.')
        decoded_payload = base64.b64decode(f'{payload}==')
        payload_data = json.loads(decoded_payload)
        
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIsNotNone(response.data['access'])
        self.assertEqual(payload_data['id'], user.id)
        self.assertEqual(payload_data['username'], user.username)
        self.assertEqual(payload_data['email'], user.email)
        self.assertEqual(payload_data['first_name'], user.first_name)
        self.assertEqual(payload_data['last_name'], user.last_name)
        

    
class HttpTripTest(APITestCase):
    def setUp(self):
        user = create_user()
        response = self.client.post(reverse('login'), data={
            'username': user.username,
            'password': PASSWORD,
        })
        self.access = response.data['access']

    def test_user_can_list_trips(self):
        dropoff_location1 = PickupLocation.objects.create(location='C')
        dropoff_location2 = PickupLocation.objects.create(location='C')
        driver = 

        trip1 = Trip.objects.create(pickup_location='A', number_of_helpers=2, pickup_time=datetime.datetime.now(), load_description='Fridge', bid=250)
        trip1.dropoff_location.add(dropoff_location1)

        trip2 = Trip.objects.create(pickup_location='B', number_of_helpers=3, pickup_time=datetime.datetime.now(), load_description='Computer', bid=500)
        trip2.dropoff_location.add(dropoff_location2)

        response = self.client.get(reverse('trip:trip_list'),
            HTTP_AUTHORIZATION=f'Bearer {self.access}'
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        exp_trip_ids = [str(trip.id) for trip in [trip1, trip2]]
        act_trip_ids = [trip.get('id') for trip in response.data]
        self.assertCountEqual(exp_trip_ids, act_trip_ids)
