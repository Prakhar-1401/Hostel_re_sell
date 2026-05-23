from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from django.utils import timezone
from django.core.cache import cache
from datetime import timedelta
import cloudinary.uploader

from .models import Product, ProductImage
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateSerializer,
    ProductUpdateSerializer,
)
from .filters import ProductFilter


def cleanup_sold_products():
    """Delete products sold more than 4 days ago. Runs at most once per hour."""
    cache_key = 'last_cleanup_run'
    if cache.get(cache_key):
        return  # Already ran recently
    cache.set(cache_key, True, 3600)  # Don't run again for 1 hour

    cutoff = timezone.now() - timedelta(days=4)
    expired = Product.objects.filter(is_sold=True, sold_at__lte=cutoff)
    for product in expired:
        for img in product.images.all():
            if img.image:
                try:
                    public_id = img.image.name
                    if public_id.endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                        public_id = public_id.rsplit('.', 1)[0]
                    cloudinary.uploader.destroy(public_id)
                except Exception:
                    pass
        product.delete()


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'hostel_name']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        # Auto-cleanup sold products older than 4 days
        cleanup_sold_products()
        queryset = Product.objects.filter(is_available=True, is_sold=False)
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset.select_related('seller', 'category').prefetch_related('images')


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.select_related('seller', 'category').prefetch_related('images')
    serializer_class = ProductDetailSerializer


class ProductCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductCreateSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(
            ProductDetailSerializer(product, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class ProductUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductUpdateSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)


class ProductDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)


class MyListingsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(
            seller=self.request.user
        ).select_related('seller', 'category').prefetch_related('images')
