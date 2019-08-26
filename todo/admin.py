from django.contrib import admin
from .models import Todo


class TodoAdmin(admin.ModelAdmin):
    list_display = ('position', 'element_title', 'content')
    list_filter = ('element_title', 'content')
    search_fields = ('element_title', 'position')
    # date_hierarchy = 'timestamp'
    ordering = ('position',)


admin.site.register(Todo, TodoAdmin)
