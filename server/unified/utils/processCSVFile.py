import csv, codecs

def process_csv_file(csv_file, required_headers):
    if not csv_file or not csv_file.name.endswith('.csv'):
        return None, 'Failed, not a CSV file'

    try:
        reader = csv.DictReader(codecs.iterdecode(csv_file, 'utf-8'), delimiter=',')
        data = list(reader)
    except Exception as e:
        return None, 'Failed, error reading CSV'
    
    if not data: 
        return None, 'Failed, data is empty'

    missing_headers = required_headers - set(reader.fieldnames)
    if missing_headers:
        missing_headers_str = ', '.join(missing_headers)
        return None, f'Failed, missing headers: {missing_headers_str}'
    
    return data, None