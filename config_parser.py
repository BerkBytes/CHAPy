import configparser
import os

def parse_config_file(filename):
    # Define the expected options
    expected_types = ["cleaning", "graphic creation", "statistical analysis", "modeling"]

    config = configparser.ConfigParser()
    config.read(filename)

    # Check if sections exist
    if not all(section in config.sections() for section in ['data_file', 'data_structure', 'analysis_type', 'analysis_specifics']):
        raise ValueError("Config file is missing required sections.")

    # Get data file and format
    data_filename = config.get('data_file', 'filename')
    data_format = os.path.splitext(data_filename)[1][1:].upper()

    # Check data_structure
    data_structure = {}
    for column_str in config.get('data_structure', 'columns').split(','):
        try:
            name, dtype, desc = column_str.split(':')
            data_structure[name.strip()] = {'type': dtype, 'description': desc}
        except ValueError:
            raise ValueError(f"Unexpected data structure format. Expected 'column_name:data_type:description', but got {column_str}.")

    # Check analysis_type
    analysis_type = config.get('analysis_type', 'type')
    if analysis_type not in expected_types:
        raise ValueError(f"Unexpected analysis type. Expected one of {expected_types}, but got {analysis_type}.")

    # Parse analysis_specifics
    analysis_specifics = [item.strip() for item in config.get('analysis_specifics', 'instructions').split(',')]

    return data_filename, data_format, data_structure, analysis_type, analysis_specifics