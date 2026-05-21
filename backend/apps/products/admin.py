from django.contrib import admin
from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'get_seller', 'get_category', 'price', 'condition', 'is_available', 'is_sold', 'created_at']
    list_filter = ['condition', 'is_available', 'is_sold', 'hostel_name', 'created_at']
    search_fields = ['name', 'description', 'seller__full_name', 'seller__email']
    list_select_related = ['seller', 'category']
    inlines = [ProductImageInline]
    ordering = ['-created_at']

    @admin.display(description='Seller')
    def get_seller(self, obj):
        return obj.seller.full_name if obj.seller else '-'

    @admin.display(description='Category')
    def get_category(self, obj):
        return obj.category.name if obj.category else '-'
    actions = ['mark_as_spam', 'mark_as_sold']

    @admin.action(description='Remove selected listings (spam)')
    def mark_as_spam(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'{count} spam listings removed.')

    @admin.action(description='Mark selected as sold')
    def mark_as_sold(self, request, queryset):
        queryset.update(is_sold=True, is_available=False)
        self.message_user(request, f'{queryset.count()} listings marked as sold.')
