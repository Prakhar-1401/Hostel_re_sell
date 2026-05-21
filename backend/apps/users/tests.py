from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UserModelTest(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User',
            phone_number='9876543210'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):
        user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            full_name='Admin User',
            phone_number='9876543211'
        )
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)


class AuthAPITest(TestCase):
    def test_signup(self):
        response = self.client.post('/api/auth/signup/', {
            'email': 'new@example.com',
            'password': 'newpass123',
            'full_name': 'New User',
            'phone_number': '9876543212',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('tokens', response.json())

    def test_login(self):
        User.objects.create_user(
            email='login@example.com',
            password='loginpass123',
            full_name='Login User',
            phone_number='9876543213'
        )
        response = self.client.post('/api/auth/login/', {
            'email': 'login@example.com',
            'password': 'loginpass123',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())
