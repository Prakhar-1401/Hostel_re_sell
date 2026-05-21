from django.contrib import admin
from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'seller', 'category', 'price', 'condition', 'is_available', 'is_sold', 'created_at']
    list_filter = ['condition', 'is_available', 'is_sold', 'category', 'hostel_name', 'created_at']
    search_fields = ['name', 'description', 'seller__full_name', 'seller__email']
    inlines = [ProductImageInline]
    ordering = ['-created_at']
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
