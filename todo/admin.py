from django.contrib import admin

from .models import Todo


class TodoAdmin(admin.ModelAdmin):
    list_display = ("position", "element_title", "content", "date_created")
    list_filter = ("date_created",)
    search_fields = ("element_title", "position", "content")
    date_hierarchy = "date_created"
    ordering = ("position", "date_created")


admin.site.register(Todo, TodoAdmin)
