from django.utils import timezone
from dateutil.relativedelta import relativedelta

def get_start_date(time_period):
    now = timezone.now()

    if time_period == "last-7-days":
        return now - relativedelta(days=7)
    
    elif time_period == "this-month":
        return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    elif time_period == "this-quarter":
        quarter_month = (now.month - 1) // 3 * 3 + 1
        return now.replace(month=quarter_month, day=1, hour=0, minute=0, second=0, microsecond=0)
    elif time_period == "this-year":
        return now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    
    return None