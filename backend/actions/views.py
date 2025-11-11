from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Action, Tag
from .permissions import IsOwner
from .serializers import ActionSerializer, RegisterSerializer, TagSerializer, UserSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    pass


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all().order_by('name')


class ActionViewSet(viewsets.ModelViewSet):
    serializer_class = ActionSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        queryset = Action.objects.filter(owner=self.request.user).prefetch_related('tags')
        status_param = self.request.query_params.get('status')
        priority_param = self.request.query_params.get('priority')
        tag_params = self.request.query_params.getlist('tag') or []
        if not tag_params:
            single_tag = self.request.query_params.get('tag')
            if single_tag:
                tag_params = [value for value in single_tag.split(',') if value]
        tag_ids = []
        for value in tag_params:
            try:
                tag_ids.append(int(value))
            except (TypeError, ValueError):
                continue
        search_query = self.request.query_params.get('q')
        ordering = self.request.query_params.get('ordering')

        if status_param:
            queryset = queryset.filter(status=status_param)
        if priority_param:
            queryset = queryset.filter(priority=priority_param)
        if tag_ids:
            queryset = queryset.filter(tags__id__in=tag_ids)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | Q(description__icontains=search_query)
            )
        if ordering:
            queryset = queryset.order_by(*[o.strip() for o in ordering.split(',') if o])
        else:
            queryset = queryset.order_by('due_date', '-priority', '-created_at')
        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()
