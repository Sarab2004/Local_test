from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from actions.models import Action, Tag

User = get_user_model()


class ActionAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='owner@example.com',
            email='owner@example.com',
            password='password123',
        )
        self.other_user = User.objects.create_user(
            username='other@example.com',
            email='other@example.com',
            password='password123',
        )
        self.tag = Tag.objects.create(name='Safety')
        self.client.force_authenticate(user=self.user)

    def test_owner_can_create_and_list_own_actions(self):
        url = reverse('action-list')
        payload = {
            'title': 'Check equipment',
            'description': 'Inspect all equipment in the storage room.',
            'status': Action.Status.OPEN,
            'priority': Action.Priority.HIGH,
            'tag_ids': [self.tag.id],
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Action.objects.count(), 1)
        action = Action.objects.get()
        self.assertEqual(action.owner, self.user)

        list_response = self.client.get(url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 1)

        self.client.force_authenticate(user=self.other_user)
        other_response = self.client.get(url)
        self.assertEqual(other_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(other_response.data), 0)
