from rest_framework import serializers
from .models import Product, ProductImage
from apps.categories.models import Category
from apps.users.serializers import UserSerializer


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url']

    def get_image_url(self, obj):
        if obj.image:
            url = obj.image.url
            # Cloudinary URLs are already absolute
            if url.startswith('http'):
                return url
            # For local/relative URLs, build absolute URI
            request = self.context.get('request')
            if request:
                if not url.startswith('/'):
                    url = '/' + url
                return request.build_absolute_uri(url)
            return url
        return None


class ProductListSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'condition', 'hostel_name',
            'seller_name', 'category_name', 'thumbnail',
            'is_available', 'is_sold', 'created_at'
        ]

    def get_thumbnail(self, obj):
        first_image = obj.images.first()
        if first_image and first_image.image:
            url = first_image.image.url
            # Cloudinary URLs are already absolute
            if url.startswith('http'):
                return url
            # For local/relative URLs, build absolute URI
            request = self.context.get('request')
            if request:
                if not url.startswith('/'):
                    url = '/' + url
                return request.build_absolute_uri(url)
            return url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'condition',
            'hostel_name', 'room_number', 'is_available', 'is_sold',
            'seller', 'category', 'category_name', 'images',
            'created_at', 'updated_at'
        ]


class ProductCreateSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(write_only=True)
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'condition',
            'hostel_name', 'room_number', 'category_name', 'images'
        ]

    def create(self, validated_data):
        category_name = validated_data.pop('category_name')
        images_data = validated_data.pop('images', [])

        # Dynamic category creation
        category = Category.get_or_create_category(category_name)

        product = Product.objects.create(
            seller=self.context['request'].user,
            category=category,
            **validated_data
        )

        for image in images_data:
            ProductImage.objects.create(product=product, image=image)

        return product


class ProductUpdateSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(write_only=True, required=False)
    new_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'condition',
            'hostel_name', 'room_number', 'is_available', 'is_sold',
            'category_name', 'new_images'
        ]

    def update(self, instance, validated_data):
        category_name = validated_data.pop('category_name', None)
        new_images = validated_data.pop('new_images', [])

        if category_name:
            instance.category = Category.get_or_create_category(category_name)

        # Auto-set sold_at when marking as sold
        if validated_data.get('is_sold') and not instance.is_sold:
            from django.utils import timezone
            instance.sold_at = timezone.now()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for image in new_images:
            ProductImage.objects.create(product=instance, image=image)

        return instance
