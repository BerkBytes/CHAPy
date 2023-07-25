import os
import sys
import io

from config_parser import parse_config_file
from load_data import load_data
from openai_interaction import analysisBot, interpretBot
from contextlib import redirect_stdout
from save_python_file import save_python_file


def main(analysis_specifics):
    try:
        data_filename, data_format, data_structure, analysis_type, _ = parse_config_file('settings.conf')
    except ValueError as e:
        print(f"Error parsing config file: {e}")
        return
    
    try:
        df = load_data(os.path.join(os.getcwd(), 'data', data_filename), data_format)  # replace 'data_file' with your actual data file path
    except Exception as e:
        print(f"Error loading data: {e}")
        return

    if analysis_type == 'statistical analysis':
        code = analysisBot(data_filename, data_structure, analysis_specifics)

        save_python_file('scripts',code)

        # Create a StringIO object to capture the output
        output_buffer = io.StringIO()
    
        # Use the redirect_stdout context manager to redirect the output to the buffer
        with redirect_stdout(output_buffer):
            exec(code)
  
        response = interpretBot(data_structure, analysis_specifics, code, output_buffer.getvalue())
        print(response)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide analysis_specifics as a command line argument.")
        sys.exit(1)

    analysis_specifics = sys.argv[1]
    main(analysis_specifics)
