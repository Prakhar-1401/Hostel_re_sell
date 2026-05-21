from django.test import TestCase
from apps.categories.models import Category


class CategoryModelTest(TestCase):
    def test_auto_slug_generation(self):
        cat = Category.objects.create(name='Desert Cooler')
        self.assertEqual(cat.slug, 'desert-cooler')

    def test_get_or_create_case_insensitive(self):
        cat1 = Category.get_or_create_category('Cooler')
        cat2 = Category.get_or_create_category('cooler')
        cat3 = Category.get_or_create_category('COOLER')
        self.assertEqual(cat1.id, cat2.id)
        self.assertEqual(cat2.id, cat3.id)
        self.assertEqual(Category.objects.count(), 1)

    def test_different_categories(self):
        Category.get_or_create_category('Cooler')
        Category.get_or_create_category('Cycle')
        self.assertEqual(Category.objects.count(), 2)
