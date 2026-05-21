from django.db import migrations


def create_initial_categories(apps, schema_editor):
    Category = apps.get_model('categories', 'Category')
    categories = [
        ('Cooler', 'cooler'),
        ('Cycle', 'cycle'),
        ('Mattress', 'mattress'),
        ('Kettle', 'kettle'),
        ('Books', 'books'),
        ('Electronics', 'electronics'),
        ('Furniture', 'furniture'),
        ('Guitar', 'guitar'),
        ('Speakers', 'speakers'),
        ('Study Table', 'study-table'),
    ]
    for name, slug in categories:
        Category.objects.get_or_create(slug=slug, defaults={'name': name})


class Migration(migrations.Migration):
    dependencies = [
        ('categories', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_initial_categories, migrations.RunPython.noop),
    ]
