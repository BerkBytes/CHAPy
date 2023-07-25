import os
import datetime

def save_python_file(file_path, python_code):
    try:
        # Get the current date and time
        current_time = datetime.datetime.now()
        formatted_time = current_time.strftime("%H%M%S")  # Format: HoursMinutesSeconds
        formatted_date = current_time.strftime("%Y%m%d")  # Format: YearMonthDay

        # Generate the file name
        file_name = f"script_{formatted_time}_{formatted_date}.py"
        file_path = os.path.join(os.getcwd(), file_path,file_name)

        with open(file_path, 'w') as file:
            file.write(python_code)
    except Exception as e:
        print("Error saving Python code:", e)