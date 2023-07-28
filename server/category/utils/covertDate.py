from datetime import date


def convertDate(created_at):
    now = date.today()
    delta = now - created_at
    days = delta.days

    if days > 3:
        created_at = created_at.strftime("%d %b, %Y")
    elif 0 < days <= 3:
        created_at = str(days) + ' days ago'
    else:
        created_at = 'Today'
    return created_at
