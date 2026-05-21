from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.products.models import Product
from apps.categories.models import Category

User = get_user_model()


class ProductAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='seller@example.com',
            password='sellerpass123',
            full_name='Seller User',
            phone_number='9876543210'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_product_creates_category(self):
        response = self.client.post('/api/products/create/', {
            'name': 'Symphony Cooler 50L',
            'category_name': 'Cooler',
            'price': '3500.00',
            'description': 'Good condition cooler',
            'condition': 'good',
            'hostel_name': 'Boys Hostel A',
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Category.objects.filter(slug='cooler').exists())
        self.assertEqual(Product.objects.count(), 1)

    def test_list_products(self):
        category = Category.get_or_create_category('Cycle')
        Product.objects.create(
            seller=self.user,
            category=category,
            name='Hero Cycle',
            description='Mountain bike',
            price=2000,
            condition='good',
            hostel_name='Boys Hostel B',
        )
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, 200)

    def test_delete_own_product(self):
        category = Category.get_or_create_category('Books')
        product = Product.objects.create(
            seller=self.user,
            category=category,
            name='Engineering Math',
            description='Textbook',
            price=200,
            condition='average',
            hostel_name='Boys Hostel A',
        )
        response = self.client.delete(f'/api/products/{product.id}/delete/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Product.objects.count(), 0)
