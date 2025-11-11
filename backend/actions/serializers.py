from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Action, Tag

User = get_user_model()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class ActionSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Tag.objects.all(),
        source='tags',
        required=False,
    )

    class Meta:
        model = Action
        fields = [
            'id',
            'title',
            'description',
            'status',
            'priority',
            'due_date',
            'tags',
            'tag_ids',
            'owner',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at', 'tags']

    def create(self, validated_data):
        request = self.context['request']
        validated_data['owner'] = request.user
        tags = validated_data.pop('tags', [])
        action = super().create(validated_data)
        if tags:
            action.tags.set(tags)
        return action

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        action = super().update(instance, validated_data)
        if tags is not None:
            action.tags.set(tags)
        return action


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('کاربری با این ایمیل وجود دارد.')
        return value

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        user = User.objects.create_user(username=email, email=email, password=password)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']
