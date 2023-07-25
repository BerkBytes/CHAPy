import pandas as pd

def load_data(file_path, data_format):
    if data_format == 'CSV':
        return pd.read_csv(file_path)
    elif data_format == 'JSON':
        return pd.read_json(file_path)
    elif data_format == 'SQL':
        # For SQL, you need to connect to a database and use pd.read_sql_query
        # The specific details would depend on your database configuration
        raise NotImplementedError("Loading SQL data is not implemented yet.")
    elif data_format == 'XML':
        # Pandas does not natively support reading XML
        # You may need to use libraries such as xml.etree.ElementTree or lxml.objectify
        raise NotImplementedError("Loading XML data is not implemented yet.")
    else:
        raise ValueError(f"Unexpected data format: {data_format}")
