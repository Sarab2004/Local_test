from django.contrib import admin

from .models import Action, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Action)
class ActionAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'priority', 'due_date', 'owner', 'created_at')
    list_filter = ('status', 'priority', 'due_date')
    search_fields = ('title', 'description')
    autocomplete_fields = ('tags', 'owner')
