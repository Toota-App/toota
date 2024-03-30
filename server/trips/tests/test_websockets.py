import pytest
import pdb
from channels.testing import WebsocketCommunicator
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from toota.asgi import application
from authentication.models import User, Driver
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import Group
from authentication.utils import VEHICLE_TYPES, get_current_time
from django.core import serializers

from trips.models import Trip
TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

@database_sync_to_async
def create_user(email, full_name, phone_number, password, group='user'):
    user = User.objects.create_user(
        email=email,
        full_name=full_name,
        phone_number=phone_number,
        password=password,

    )
    user_group, _ = Group.objects.get_or_create(name=group)
    user.groups.add(user_group)
    user.is_verified = True
    user.save()
    access = AccessToken.for_user(user)
    return user, access

@database_sync_to_async
def create_driver(
    email, 
    full_name, 
    phone_number, 
    physical_address, 
    vehicle_registration_no, 
    vehicle_type, 
    licence_no, 
    password,
    group='driver'):
    driver = Driver.objects.create_driver(
        email=email,
        full_name=full_name,
        phone_number=phone_number,
        physical_address=physical_address,
        vehicle_registration_no=vehicle_registration_no,
        vehicle_type=vehicle_type,
        licence_no=licence_no,
        password=password
        )
    driver_group, _ = Group.objects.get_or_create(name=group)
    driver.groups.add(driver_group)
    driver.is_verified = True
    driver.save()

    access = AccessToken.for_user(driver)
    return driver, access

@database_sync_to_async
def create_trip(
    pickup_location='Main Avenue',
    dropoff_location='Cresta Mall',
    status='REQUESTED',
    load_description='Fridge',
    number_of_floors=2,
    bid=300,
    pickup_time=get_current_time(),
    user=None,
    driver=None,
    ):
    return Trip.objects.create(
        pickup_location=pickup_location,
        dropoff_location=dropoff_location,
        status=status,
        load_description=load_description,
        number_of_floors=number_of_floors,
        bid=bid,
        pickup_time=pickup_time,
        user=user,
        driver=driver)


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestWebSocket:
    async def test_can_connect_to_server(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user, access = await create_user(
            'testuser@test.com',
            'Test User',
            '1234567890',
            'password'
        )
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
        )
        connected, _ = await communicator.connect()
        assert connected is True
        await communicator.disconnect()
        
    async def test_can_send_and_receive_messages(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user, access = await create_user(
            'testuser@test.com',
            'Test User',
            '1234567890',
            'password'
        )
        communicator = WebsocketCommunicator(
            application=application,
            path='/toota/?token={access}'
        )
        connected, _ = await communicator.connect()
        
        message = {
            'type': 'echo.message',
            'data': 'This is a test message.',
        }
       
        await communicator.send_json_to(message)
        response = await communicator.receive_json_from()

        assert response == message
        
        await communicator.disconnect()
        
        
        
    async def test_cannot_connect_to_socket(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        communicator = WebsocketCommunicator(
            application=application,
            path='/toota/'
        )
        connected, _ = await communicator.connect()
        assert connected is False
        await communicator.disconnect()
        

    async def test_join_driver_pool(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        
        _, access = await create_driver(
            'testdriver@test.com',
            'Test Driver',
            '0123456789',
            'Main Avenue',
            'reg-345-678',
            VEHICLE_TYPES[0][0],
            'dr-gy-56-89',
            'Test@password_driver'
            )
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
            )
        connected, _ = await communicator.connect()
        message = {
            'type': 'echo.message',
            'data': 'This is a test message',
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send('drivers', message=message)
        response = await communicator.receive_json_from()
        assert response == message
        await communicator.disconnect()


    async def test_request_trip(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user, access = await create_user(
            'testuser@test.com',
            'Test User',
            '1234567890',
            'password'
        )
       
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}')
        connected, _ = await communicator.connect()
        
        await communicator.send_json_to({
            'type': 'create.trip',
            'data': {
                'pickup_location': 'Randburg CBD',
                'dropoff_location': 'Cresta Mall',
                'vehicle_type': VEHICLE_TYPES[0][0],
                'number_of_floors': 2,
                'pickup_time': get_current_time(),
                'load_description': 'Fridge',
                'user': user.id,
                'bid': 255,
                },
            })
        response = await communicator.receive_json_from()
        response_data = response.get('data')
        assert response_data['id'] is not None
        assert response_data['pickup_location'] == 'Randburg CBD'
        assert response_data['dropoff_location'] == 'Cresta Mall'
        assert response_data['status'] == 'REQUESTED'
        # assert response_data['user_name'] == user.full_name
        assert response_data['driver'] is None
        await communicator.disconnect()


    async def test_driver_alerted_on_request(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        #Listen  to the driver's group test channel
        channel_layer = get_channel_layer()
        await channel_layer.group_add(
            group='drivers',
            channel='test_channel'
        )
        user, access = await create_user(
            'testuser@test.com',
            'Test User',
            '1234567890',
            'password'
        )
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
        )
        connected, _ = await communicator.connect()
        await communicator.send_json_to({
            'type': 'create.trip',
            'data': {
                'pickup_location': 'Randburg CBD',
                'dropoff_location': 'Cresta Mall',
                'vehicle_type': VEHICLE_TYPES[0][0],
                'number_of_floors': 2,
                'pickup_time': get_current_time(),
                'load_description': 'Fridge',
                'user': user.id,
                'bid': 255,
                },
        })
        # Receive JSON message from server on test channel.
        response = await channel_layer.receive('test_channel')
        response_data = response.get('data')
        assert response_data['id'] is not None
        assert response_data['user']['full_name'] == user.full_name
        assert response_data['driver']  is None
        await communicator.disconnect()


    async def test_create_trip_group(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user, access = await create_user(
            'testuser@test.com',
            'Test User',
            '1234567890',
            'password'
        )
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
        )
        connected, _ = await communicator.connect()

        await communicator.send_json_to({
            'type': 'create.trip',
            'data': {
                'pickup_location': 'Randburg CBD',
                'dropoff_location': 'Cresta Mall',
                'vehicle_type': VEHICLE_TYPES[0][0],
                'number_of_floors': 2,
                'pickup_time': get_current_time(),
                'load_description': 'Fridge',
                'user': user.id,
                'bid': 255,
                },
        })
        response = await communicator.receive_json_from()
        response_data = response.get('data')

        # Send a message to the trip group.
        message = {
            'type': 'echo.message',
            'data': 'This is a test message.',
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send(response_data['id'], message=message)

        result = await communicator.receive_json_from()
        assert result == message
        await communicator.disconnect()

    async def test_join_trip_group_on_connect(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user, access = await create_user(
            'testuser@test.com',
            'Test User',
            '1234567890',
            'password'
        )
        trip = await create_trip(user=user)

        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
        )

        connected, _ = await communicator.connect()

        # Send a message to the trip group
        message = {
        'type': 'echo.message',
        'data': 'This is a test message.',
        }

        channel_layer = get_channel_layer()
        await channel_layer.group_send(f'{trip.id}', message=message)

        # Rider receives message.
        response = await communicator.receive_json_from()
        assert response == message
        await communicator.disconnect()


    async def test_driver_can_update_trip(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user, access = await create_user(
            'testuser1@test.com',
            'Test User',
            '1234567890',
            'password'
        )
        
        trip = await create_trip(user=user)
        print(trip)
        trip_id = f'{trip.id}'
        channel_layer = get_channel_layer()
        await channel_layer.group_add(
            group=trip_id,
            channel='test_channel'
        )
        driver, _ = await create_driver(
            'testdriver@test.com',
            'Test Driver',
            '0123456789',
            'Main Avenue',
            'reg-345-678',
            VEHICLE_TYPES[1][1],
            'dr-gy-56-89',
            'Test@password_driver'
            )
        
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}',
        )
       
        connected, _ = await communicator.connect()
        message = {
            'type': 'update.trip',
            'data': {
                'id': f'{trip_id}',
                'pickup_location': 'Randburg CBD',
                'dropoff_location': 'Cresta Mall',
                'vehicle_type': VEHICLE_TYPES[0][0],
                'number_of_floors': 2,
                'status': Trip.IN_PROGRESS,
                'pickup_time': get_current_time(),
                'load_description': 'Fridge',
                'driver': driver.id,
                'bid': 255,
            }
        }
        # pdb.set_trace()
        await communicator.send_json_to(message)

        response = await channel_layer.receive('test_channel')
        response_data = response.get('data')
        print(response_data)
        assert response_data['id'] == trip_id
        assert response_data['user']['full_name'] == user.full_name
        assert response_data['driver'] == driver.full_name

        await communicator.disconnect()


    async def test_driver_join_trip_group_on_connect(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        
        driver, access = await create_driver(
            'testdriver@test.com',
            'Test Driver',
            '0123456789',
            'Main Avenue',
            'reg-345-678',
            VEHICLE_TYPES[1][1],
            'dr-gy-56-89',
            'Test@password_driver'
            )
        trip = await create_trip(driver=driver)
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
        )
        connected, _ = await communicator.connect()

        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }
        print(connected)
        channel_layer = get_channel_layer()
        await channel_layer.group_send(f'{trip.id}', message=message)
        response = await communicator.receive_json_from()
        assert response == messages
        await communicator.disconnect()

