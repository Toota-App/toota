from django.core.mail import EmailMessage
from django.template.loader import render_to_string
import logging

logger = logging.getLogger(__name__)

def send_trip_email(recipient_email, subject, template_name, context):
    """
    Sends an email for trip updates.
    Args:
        recipient_email (str): The recipient's email address.
        subject (str): The subject of the email.
        template_name (str): The path to the email template.
        context (dict): The context data for the template.
    """
    try:
        # Render the email template with context
        message = render_to_string(template_name, context)
        
        # Create and send the email
        email = EmailMessage(
            subject=subject,
            body=message,
            to=[recipient_email],
        )
        email.content_subtype = "html"  # Send as HTML
        email.send()
        logger.info(f"Email sent to {recipient_email} with subject: {subject}")
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_email}: {e}")

