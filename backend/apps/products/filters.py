import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    condition = django_filters.CharFilter(field_name='condition')
    hostel = django_filters.CharFilter(field_name='hostel_name', lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='category__slug')

    class Meta:
        model = Product
        fields = ['condition', 'hostel_name', 'category']
