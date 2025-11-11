from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from actions.models import Action, Tag

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed demo data for the HSE Action Tracker Lite application.'

    def handle(self, *args, **options):
        user, created = User.objects.get_or_create(
            email='demo@example.com',
            defaults={'username': 'demo@example.com'}
        )
        if created:
            user.set_password('demo1234')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created demo user.'))
        else:
            self.stdout.write('Demo user already exists.')

        Action.objects.filter(owner=user).delete()

        tags = {
            name: Tag.objects.get_or_create(name=name)[0]
            for name in ['Safety', 'Training', 'Equipment', 'Audit', 'Reporting']
        }

        actions_payload = [
            {
                'title': 'Inspect safety harnesses',
                'description': 'Ensure all harnesses are compliant with the latest standards.',
                'status': Action.Status.OPEN,
                'priority': Action.Priority.HIGH,
                'tags': ['Safety', 'Equipment'],
            },
            {
                'title': 'Schedule fire drill',
                'description': 'Coordinate with facilities to run a site-wide fire drill.',
                'status': Action.Status.IN_PROGRESS,
                'priority': Action.Priority.MEDIUM,
                'tags': ['Training', 'Safety'],
            },
            {
                'title': 'Update incident report template',
                'description': 'Revise the template to include new reporting categories.',
                'status': Action.Status.OPEN,
                'priority': Action.Priority.MEDIUM,
                'tags': ['Reporting'],
            },
            {
                'title': 'Complete equipment audit',
                'description': 'Finalize the quarterly equipment audit for the warehouse.',
                'status': Action.Status.DONE,
                'priority': Action.Priority.LOW,
                'tags': ['Audit', 'Equipment'],
            },
            {
                'title': 'Deliver safety onboarding',
                'description': 'Prepare onboarding session for new hires focusing on safety.',
                'status': Action.Status.IN_PROGRESS,
                'priority': Action.Priority.HIGH,
                'tags': ['Training'],
            },
        ]

        for payload in actions_payload:
            action = Action.objects.create(
                owner=user,
                title=payload['title'],
                description=payload['description'],
                status=payload['status'],
                priority=payload['priority'],
            )
            action.tags.set([tags[name] for name in payload['tags']])

        self.stdout.write(self.style.SUCCESS('Seeded demo actions.'))
